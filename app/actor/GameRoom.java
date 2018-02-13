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
        this.match.save();
        tellPlayers(new Messages.Join());

        receive(
                ReceiveBuilder
                              .match(Messages.Leave.class, this::tellPlayers)
                              .match(Messages.Ready.class, this::checkReady)
                              .match(Messages.Fire.class, this::checkFire)
                              .match(Messages.Feedback.class, this::sendFeedback)
                        .build()
        );
    }

    private void sendFeedback(Messages.Feedback msg) {
        if (turn){
            player1.tell(msg, self());
            player1.tell(new Messages.Wait(), self());
            player2.tell(new Messages.Play(), self());
        }else {
            player2.tell(msg, self());
            player2.tell(new Messages.Wait(), self());
            player1.tell(new Messages.Play(), self());
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
        match.addHit(turn, msg.x, msg.y);
        if (ship != null && ship.isSunk()){
            if (fleet.allSunk()){
                hitter.tell(new Messages.Win(new Messages.Sink(ship, true), true), self());
                receiver.tell(new Messages.Win(new Messages.Sink(ship, false), false), self());
                match.setWinner(match.getTurn());
                User user = getUser(hitter);
                if (user != null) {
                    user.addWins();
                    user.save();
                }
            }else{
                sendFireSinkFeedback(msg,receiver,hitter,ship);
            }
            match.getShipInPosition(turn, msg.x, msg.y).setSunk(true);
        }else if (ship != null){
            sendFireHitFeedback(msg,receiver,hitter);
        }else {
            sendFireMissFeedback(msg,receiver,hitter);
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
        shooter.tell(new Messages.Wait(), self());
        playerHit.tell(new Messages.Play(), self());
    }

    private void sendFireMissFeedback(Messages.Fire msg, ActorRef playerMiss, ActorRef shooter){
        shooter.tell(new Messages.Miss(msg.x, msg.y, true),self());
        playerMiss.tell(new Messages.Miss(msg.x, msg.y, false), self());
        shooter.tell(new Messages.Wait(), self());
        playerMiss.tell(new Messages.Play(), self());
    }

    private void sendFireSinkFeedback(Messages.Fire msg, ActorRef playerSink, ActorRef shooter, Ship ship){
        shooter.tell(new Messages.Sink(ship, true), self());
        playerSink.tell(new Messages.Sink(ship, false), self());
        shooter.tell(new Messages.Wait(), self());
        playerSink.tell(new Messages.Play(), self());
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
            player1.tell(new Messages.Play(), self());
            player2.tell(new Messages.Wait(), self());
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
