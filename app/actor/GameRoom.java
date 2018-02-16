package actor;

import akka.actor.AbstractActor;
import akka.actor.ActorRef;
import akka.actor.Props;
import akka.japi.pf.ReceiveBuilder;
import model.Coordinate;
import model.Fleet;
import model.Ship;
import model.dbModels.GameMatch;
import model.dbModels.User;
import org.json.JSONArray;
import org.json.JSONObject;
import services.EndGameTask;
import services.UserService;

import java.util.*;


public class GameRoom extends AbstractActor {
    private static ActorRef player1;
    private static ActorRef player2;
    private boolean turn = true;
    private boolean p1Ready = false;
    private boolean p2Ready = false;
    private User player1User;
    private User player2User;
    private Fleet p1Fleet;
    private Fleet p2Fleet;
    private GameMatch match;



    private GameRoom(ActorRef player1, ActorRef player2) {
        GameRoom.player1 = player1;
        GameRoom.player2 = player2;
        this.player1User = getUser(player1);
        this.player2User = getUser(player2);
        this.player1User.addMatch();
        this.player2User.addMatch();
        this.player1User.save();
        this.player2User.save();
        this.match = new GameMatch(player1User, player2User);
        System.out.println("Game room created");
        this.match.save();
        tellPlayers(new Messages.Join());

        receive(
                ReceiveBuilder
                              .match(Messages.Leave.class, this::playerLeft)
                              .match(Messages.Ready.class, this::checkReady)
                              .match(Messages.Fire.class, this::checkFire)
                              .match(Messages.Feedback.class, this::sendFeedback)
                              .match(Messages.ReconnectReady.class, this::reconnectPlayer)
                        .build()
        );
    }

    private void playerLeft(Messages.Leave msg) {
        String fbId = msg.user.split("\\$")[0];
        System.out.println("Player with fbID " + fbId + " left.");
        Timer t = match.getTimer();
        User winner;
        if (Long.parseLong(fbId) == player1User.getFacebookId()){
            winner = player2User;
            match.setPlayer1Ready(false);
            player2.tell(new Messages.WaitingPlayer(), self());
        }else {
            match.setPlayer2Ready(false);
            winner = player1User;
            player1.tell(new Messages.WaitingPlayer(), self());
        }
        match.save();
        t.schedule(new EndGameTask(player1, player2, match, winner, self()), 30000);
    }

    private void reconnectPlayer(Messages.ReconnectReady msg) {
        System.out.println("Player " + msg.player.path().name() + " returned.");
        match.getTimer().cancel();
        match.getTimer().purge();
        match.setTimer(new Timer());
        if (msg.player.equals(player1)){
            match.setPlayer1Ready(true);
            if (turn) {
                msg.player.tell(new Messages.Play(getPlayerHits(match.getPlayer1Ships(), match.getPlayer1Hits(), match.getPlayer2Hits(), match.getPlayer1Water(), match.getPlayer2Water(), match.getPlayer1Sinks(), match.getPlayer2Sinks())), self());
            }else {
                msg.player.tell(new Messages.Wait(getPlayerHits(match.getPlayer1Ships(), match.getPlayer1Hits(), match.getPlayer2Hits(), match.getPlayer1Water(), match.getPlayer2Water(), match.getPlayer1Sinks(), match.getPlayer2Sinks())), self());
            }
        }else {
            match.setPlayer2Ready(true);
            if (!turn) {
                msg.player.tell(new Messages.Play(getPlayerHits(match.getPlayer2Ships(), match.getPlayer2Hits(), match.getPlayer1Hits(), match.getPlayer2Water(), match.getPlayer1Water(), match.getPlayer2Sinks(), match.getPlayer1Sinks())), self());
            }else {
                msg.player.tell(new Messages.Wait(getPlayerHits(match.getPlayer2Ships(), match.getPlayer2Hits(), match.getPlayer1Hits(), match.getPlayer2Water(), match.getPlayer1Water(), match.getPlayer2Sinks(), match.getPlayer1Sinks())), self());
            }
        }
        match.save();
    }

    private JSONObject getPlayerHits(List<model.dbModels.Ship> myShips, String[] myHits, String[] enemyHits, String[] myWater, String[] enemyWater, String[] mySink, String[] enemySink){
        JSONObject json = new JSONObject();
        JSONArray shipsJson = new JSONArray();
        for (model.dbModels.Ship myShip : myShips) {
            shipsJson.put(getCoors(myShip.getPosition()));
        }
        JSONArray myHitsJson = getCoors(myHits);
        JSONArray enemyHitsJson = getCoors(enemyHits);
        JSONArray myWaterJson = getCoors(myWater);
        JSONArray enemyWaterJson = getCoors(enemyWater);
        JSONArray mySinksJson = getCoors(mySink);
        JSONArray enemySinkJson = getCoors(enemySink);
        json.put("myShips", shipsJson);
        json.put("myHits", myHitsJson);
        json.put("enemyHits", enemyHitsJson);
        json.put("myWater", myWaterJson);
        json.put("enemyWater", enemyWaterJson);
        json.put("mySinks", mySinksJson);
        json.put("enemySinks", enemySinkJson);
        return json;
    }

    private JSONArray getCoors(String[] arr){
        JSONArray jsonArray = new JSONArray();
        for (String s : arr) {
            if (!s.equals("")) {
                JSONObject coor = new JSONObject();
                coor.put("x", s.charAt(0));
                coor.put("y", s.charAt(1));
                jsonArray.put(coor);
            }
        }
        return jsonArray;
    }

    private void sendFeedback(Messages.Feedback msg) {
        if (turn){
            player1.tell(msg, self());
            player1.tell(new Messages.Wait(null), self());
            player2.tell(new Messages.Play(null), self());
        }else {
            player2.tell(msg, self());
            player2.tell(new Messages.Wait(null), self());
            player1.tell(new Messages.Play(null), self());
        }
        changeTurn();
    }

    private User getUser(ActorRef actorRef){
        String fbId = actorRef.path().name().split("-")[1].split("\\$")[0];
        Optional<User> userOpt = UserService.getUserService().getUserByFBId(Long.parseLong(fbId));
        return userOpt.orElse(null);
    }

    private void checkFire(Messages.Fire msg){
        ActorRef hitter = msg.player;
        Fleet fleet;
        ActorRef receiver;
        if (hitter.equals(player1)){
            fleet = p2Fleet;
            receiver = player2;
        }else{
            fleet = p1Fleet;
            receiver = player1;
        }
        Ship ship = fleet.hit(new Coordinate(msg.x, msg.y));
        if (ship != null && ship.isSunk()){
            if (fleet.allSunk()){
                hitter.tell(new Messages.Win(new Messages.Sink(ship, true), true), self());
                receiver.tell(new Messages.Win(new Messages.Sink(ship, false), false), self());
                GameRoomManager.MAIN_GAME.tell(new Messages.EndGame(player1, player2, self()), self());
                match.setWinner(match.getTurn());
                User user = getUser(hitter);
                if (user != null) {
                    user.addWins();
                    user.save();
                }
            }else{
                sendFireSinkFeedback(msg,receiver,hitter,ship);
            }
            match.addSinks(turn, msg.x, msg.y);
        }else if (ship != null){
            sendFireHitFeedback(msg,receiver,hitter);
            match.addHit(turn, msg.x, msg.y);
        }else {
            sendFireMissFeedback(msg,receiver,hitter);
            match.addWater(turn, msg.x, msg.y);
        }
        changeTurn();
    }

    private void changeTurn(){
        User matchTurn = match.getTurn();
        if (matchTurn.equals(player1User)){
            match.setTurn(player2User);
            turn = false;
        }else {
            match.setTurn(player1User);
            turn = true;
        }
        match.save();
    }

    private void sendFireHitFeedback(Messages.Fire msg, ActorRef playerHit, ActorRef shooter){
        shooter.tell(new Messages.Hit(msg.x, msg.y, true),self());
        playerHit.tell(new Messages.Hit(msg.x, msg.y, false),self());
        shooter.tell(new Messages.Wait(null), self());
        playerHit.tell(new Messages.Play(null), self());
    }

    private void sendFireMissFeedback(Messages.Fire msg, ActorRef playerMiss, ActorRef shooter){
        shooter.tell(new Messages.Miss(msg.x, msg.y, true),self());
        playerMiss.tell(new Messages.Miss(msg.x, msg.y, false), self());
        shooter.tell(new Messages.Wait(null), self());
        playerMiss.tell(new Messages.Play(null), self());
    }

    private void sendFireSinkFeedback(Messages.Fire msg, ActorRef playerSink, ActorRef shooter, Ship ship){
        shooter.tell(new Messages.Sink(ship, true), self());
        playerSink.tell(new Messages.Sink(ship, false), self());
        shooter.tell(new Messages.Wait(null), self());
        playerSink.tell(new Messages.Play(null), self());
    }

    private void checkReady(Messages.Ready msg){
        if (player1.equals(msg.player)){
            p1Ready = true;
            p1Fleet = new Fleet();
            Iterator<Object> ships = msg.boats.iterator();
            List<model.dbModels.Ship> shipList = setShips(ships, p1Fleet);
            match.setPlayer1Ships(shipList);
            match.setPlayer1Ready(true);
            match.save();
        }else if (player2.equals(msg.player)){
            p2Ready = true;
            p2Fleet = new Fleet();
            Iterator<Object> ships = msg.boats.iterator();
            List<model.dbModels.Ship> shipList = setShips(ships, p2Fleet);
            match.setPlayer2Ships(shipList);
            match.setPlayer2Ready(true);
            match.save();
        }if (p1Ready && p2Ready){
            player1.tell(new Messages.Play(null), self());
            player2.tell(new Messages.Wait(null), self());
            turn = true;
            match.setTurn(getUser(player1));
            match.save();
        }
    }

    private List<model.dbModels.Ship> setShips(Iterator<Object> ships, Fleet fleet){
        List<model.dbModels.Ship> shipList = new ArrayList<>();
        while (ships.hasNext()){
            JSONArray ship = (JSONArray)ships.next();
            model.dbModels.Ship dbShip = new model.dbModels.Ship(false,"");
            List<Coordinate> coordinates = new ArrayList<>();
            String[] coorArr = new String[ship.length()];
            for (int i = 0; i < ship.length(); i++){
                JSONArray coord = ship.getJSONArray(i);
                Coordinate coordinate = new Coordinate(coord.getInt(0), coord.getInt(1));
                coordinates.add(coordinate);
                coorArr[i] = (coord.getInt(0) + "" + coord.getInt(1));
            }
            fleet.addShip(new Ship(coordinates));
            dbShip.setPosition(coorArr);
            shipList.add(dbShip);
        }
        return shipList;
    }

    private void tellPlayers(Object msg) {
        player1.tell(msg, self());
        player2.tell(msg, self());
    }

    static Props props(ActorRef player1, ActorRef player2) {
        return Props.create(GameRoom.class, () -> new GameRoom(player1, player2));
    }




}
