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
    private boolean turn = true;
    private boolean p1Ready = false;
    private boolean p2Ready = false;



    public GameRoom(ActorRef player1, ActorRef player2) {
        this.player1 = player1;
        this.player2 = player2;
        tellPlayers(new Messages.Join());

        receive(
                ReceiveBuilder.match(Messages.Join.class, this::join)
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
            turn = false;
        }else {
            player2.tell(msg, self());
            player2.tell(new Messages.Wait(), self());
            player1.tell(new Messages.Play(), self());
            turn = true;
        }
    }


    private void join(Messages.Join p) {

    }

    private void checkFire(Messages.Fire msg){
        ActorRef player = msg.player;
        if (player.equals(player1)){
            player2.tell(msg, self());
        }else{
            player1.tell(msg, self());
        }
    }

    private void checkReady(Messages.Ready msg){
        if (player1.equals(msg.player)){
            p1Ready = true;
        }else if (player2.equals(msg.player)){
            p2Ready = true;
        }if (p1Ready && p2Ready){
            player1.tell(new Messages.Play(), self());
            player2.tell(new Messages.Wait(), self());
            turn = true;
        }
    }

    private void tellPlayers(Object msg) {
        player1.tell(msg, self());
        player2.tell(msg, self());
    }

    public static Props props(ActorRef player1, ActorRef player2) {
        return Props.create(GameRoom.class, () -> new GameRoom(player1, player2));
    }




}
