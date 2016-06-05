package actor;

import akka.actor.AbstractActor;
import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Props;
import akka.japi.pf.ReceiveBuilder;
import akka.pattern.Patterns;
import akka.util.Timeout;
import play.libs.F;
import play.mvc.WebSocket;
import scala.concurrent.Await;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

/**
 * Created by joaquin on 01/06/16.
 */
public class GameRoom extends AbstractActor {
    private Map<String, WebSocket.Out> players = new HashMap<>();

    public GameRoom() {
        receive(
                ReceiveBuilder.match(Messages.Connection.class, this::connection)
                .build()
        );
    }

    private void connection(Messages.Connection connect) {
        players.put(connect.user, connect.out);

        connect.in.onMessage(new Consumer() {
            @Override
            public void accept(Object o) {
                for (WebSocket.Out out : players.values()) {
                    out.write(o);
                }
            }
        });
        connect.in.onClose(new Runnable() {
            @Override
            public void run() {
                players.remove(connect.user);
            }
        });

        sender().tell("connection-ok", self());
    }

    public static Props props() {
        return Props.create(GameRoom.class);
    }


    private static final ActorRef MAIN_GAME = ActorSystem.create().actorOf(GameRoom.props());

    public static void join(String user, WebSocket.In in, WebSocket.Out out) throws Exception {
        Timeout timeout = new Timeout(10, TimeUnit.SECONDS);

        Future<Object> ask = Patterns.ask(MAIN_GAME, new Messages.Connection(user, in, out), timeout);
        String result = (String) Await.result(ask, Duration.create(10, TimeUnit.SECONDS));

    }
}
