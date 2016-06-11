package actor;

import actor.Messages.Join;
import akka.actor.AbstractActor;
import akka.actor.ActorRef;
import akka.actor.Props;
import akka.japi.pf.ReceiveBuilder;
import play.mvc.WebSocket;

import java.util.function.Consumer;

public class Player extends AbstractActor{
    public final String user;
    public final WebSocket.In in;
    public final WebSocket.Out out;
    private ActorRef room = null;

    public Player(String user, WebSocket.In in, WebSocket.Out out){
        this.user = user;
        this.in = in;
        this.out = out;

        receive(
                ReceiveBuilder.match(Join.class, this::join)
                        .build()
        );


        in.onMessage(this::in);
        /*in.onClose(new Runnable() {
            @Override
            public void run() {
                players.remove(connect.user);
            }
        });*/
    }

    private void join(Join join) {
        this.room = sender();
        System.out.printf("Player %s joined %s\n", self().path(), room.path());
        out("Layout " + self().path());
    }

    private void in(Object message) {

    }

    private void out(Object message) {
        out.write(message);
    }

    public static Props props(String user, WebSocket.In in, WebSocket.Out out) {
        return Props.create(Player.class, () -> new Player(user, in, out));
    }
}
