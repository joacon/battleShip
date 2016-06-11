package actor;

import akka.actor.AbstractActor;
import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Props;
import akka.japi.pf.ReceiveBuilder;
import akka.pattern.Patterns;
import akka.util.Timeout;
import play.mvc.WebSocket;
import scala.concurrent.Await;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

/**
 * Created by joaquin on 05/06/16.
 */
public class GameRoomManager extends AbstractActor {
    private List<ActorRef> rooms = new ArrayList<>();
    private List<ActorRef> waiting = new ArrayList<>();


    public GameRoomManager() {
        receive(
                ReceiveBuilder.match(Messages.Connection.class, this::connection)
                        .build()
        );
    }

    private void connection(Messages.Connection connect) throws Exception{
        waiting.add(context().system().actorOf(Player.props(connect.user, connect.in, connect.out), "player-"+connect.user));
        if (waiting.size() > 1) {
            ActorRef actorRef = context().system().actorOf(GameRoom.props(waiting.remove(0), waiting.remove(0)), "room-");
            rooms.add(actorRef);
        }
    }

    public static Props props() {
        return Props.create(GameRoomManager.class);
    }

    private static final ActorSystem actorSystem = ActorSystem.create();
    private static final ActorRef MAIN_GAME = actorSystem.actorOf(GameRoomManager.props(), "manager");

    public static void join(String user, WebSocket.In in, WebSocket.Out out) throws Exception {
        MAIN_GAME.tell(new Messages.Connection(user, in, out), MAIN_GAME);
    }
}
