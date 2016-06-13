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
                              .match(Messages.Leave.class, this::left)
                              .match(Messages.BothReady.class, this::play)
                        .build()
        );


        in.onMessage(this::in);

        in.onClose(new Runnable() {
            @Override
            public void run() {
                System.out.println(room);
                room.tell(new Messages.Leave(user), self());
                out("Oponent left");
            }
        });
    }

    private void play(Messages.BothReady ready) {
        out("Play");
    }

    private void join(Join join) {
        this.room = sender();
        System.out.printf("Player %s joined %s\n", self().path(), room.path());
        out("Layout");
    }

    private void left(Messages.Leave leave){
        out("Opponent left");
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
