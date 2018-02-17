package actor;

import akka.actor.*;
import akka.japi.pf.ReceiveBuilder;
import model.dbModels.User;
import play.mvc.WebSocket;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by joaquin on 05/06/16.
 */
public class GameRoomManager extends AbstractActor {
    private List<ActorRef> rooms = new ArrayList<>();
    private List<ActorRef> waiting = new ArrayList<>();
    private List<ActorRef> currentPlayers = new ArrayList<>();
    private static int totalRooms;

    public GameRoomManager() {
        totalRooms = 0;
        receive(
                ReceiveBuilder
                        .match(Messages.Connection.class, this::connection)
                        .match(Messages.EndGame.class, this::endGame)
                        .build()
        );
    }

    private void connection(Messages.Connection connect) throws Exception{
        ActorRef existing = checkConnected(connect);
        if (existing == null) {
            System.out.println("Player " + connect.dbUser.getFirstName() + " " + connect.dbUser.getLastName() + " is waiting.");
            ActorRef player = context().system().actorOf(Player.props(connect.user, connect.in, connect.out), "player-" + connect.user);
            managePlayerExit(player, connect.in);
            waiting.add(player);
            if (waiting.size() > 1) {
                ActorRef player1 = waiting.remove(0);
                ActorRef player2 = waiting.remove(0);
                currentPlayers.add(player1);
                currentPlayers.add(player2);
                System.out.println("Connecting players to room");
                ActorRef actorRef = context().system().actorOf(GameRoom.props(player1, player2), "room-" + totalRooms);
                rooms.add(actorRef);
                totalRooms++;
            }
        }else{
            existing.tell(new Messages.Reconnect(connect.in, connect.out), self());
        }
    }

    private void managePlayerExit(ActorRef player, WebSocket.In in) {
        in.onClose(new Runnable() {
            @Override
            public void run() {
                waiting.remove(player);
            }
        });
    }

    private ActorRef checkConnected(Messages.Connection connect) {
        for (ActorRef player : currentPlayers) {
            if (player.path().name().split("\\$")[0].equals("player-" + connect.user.split("\\$")[0])) {
                System.out.println(player.path().name() + " is joining back into his game");
                return player;
            }
        }
        for (ActorRef player : waiting) {
            if (player.path().name().split("\\$")[0].equals("player-" + connect.user.split("\\$")[0])) {
                System.out.println(player.path().name() + " is joining back into his waiting");
                return player;
            }
        }
        return null;
    }

    private void endGame(Messages.EndGame msg){
        List<ActorRef> removePlayers = new ArrayList<>();
        for (ActorRef player : currentPlayers) {
            if (player.path().name().split("\\$")[0].equals(msg.player1.path().name().split("\\$")[0])
                    || player.path().name().split("\\$")[0].equals(msg.player2.path().name().split("\\$")[0]) ) {
                removePlayers.add(player);
                System.out.println("Removing player from rooms " + player.path().name());
            }
        }
        currentPlayers.removeAll(removePlayers);
        for (ActorRef room : rooms) {
            if (room.equals(msg.room)){
                rooms.remove(room);
                break;
            }
        }
    }

    private static Props props() {
        return Props.create(GameRoomManager.class);
    }

    private static final ActorSystem actorSystem = ActorSystem.create();
    public static final ActorRef MAIN_GAME = actorSystem.actorOf(GameRoomManager.props(), "manager");

    public static void join(String user, WebSocket.In in, WebSocket.Out out, User dbUser) throws Exception {
        MAIN_GAME.tell(new Messages.Connection(user, in, out, dbUser), MAIN_GAME);
    }
}
