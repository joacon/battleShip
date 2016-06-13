package actor;

import akka.actor.AbstractActor;
import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Props;
import akka.japi.Creator;
import akka.japi.pf.ReceiveBuilder;
import akka.pattern.Patterns;
import akka.util.Timeout;
import play.mvc.WebSocket;
import scala.concurrent.Await;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;


public class GameRoom extends AbstractActor {
    private static ActorRef player1;
    private static ActorRef player2;


    public GameRoom(ActorRef player1, ActorRef player2) {
        this.player1 = player1;
        this.player2 = player2;
        tellPlayers(new Messages.Join());

        receive(
                ReceiveBuilder.match(Messages.Join.class, this::join)
                              .match(Messages.Leave.class, this::tellPlayers)
                              .match(Messages.BothReady.class, this::tellPlayers)
                        .build()
        );
    }



    private void join(Messages.Join p) {

    }

    private void tellPlayers(Object msg) {
        player1.tell(msg, self());
        player2.tell(msg, self());
    }

    public static Props props(ActorRef player1, ActorRef player2) {
        return Props.create(GameRoom.class, () -> new GameRoom(player1, player2));
    }




}
