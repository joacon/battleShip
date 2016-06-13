package actor;

import actor.Messages.Join;
import akka.actor.AbstractActor;
import akka.actor.ActorRef;
import akka.actor.Props;
import akka.japi.pf.ReceiveBuilder;
import org.json.JSONObject;
import play.libs.Json;
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
                              .match(Messages.Play.class, this::play)
                              .match(Messages.Wait.class, this::wait)
                              .match(Messages.Fire.class, this::checkFire)
                              .match(Messages.Feedback.class, this::checkFeedback)
                        .build()
        );


        in.onMessage(this::in);

        in.onClose(new Runnable() {
            @Override
            public void run() {
                System.out.println(room);
                room.tell(new Messages.Leave(user), self());
                out("Opponent left");
            }
        });
    }

    private void wait(Messages.Wait msg) {
        out("Wait");
    }

    private void checkFeedback(Messages.Feedback msg) {
        if (msg.hit){
            out("Hit");
        }else{
            out("Miss");
        }
    }

    private void checkFire(Messages.Fire fire) {
        out("{action: Fire, x:"+fire.x+", y:" +fire.y+"}");
    }

    private void play(Messages.Play ready) {
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
        String msg = message.toString();
        String[] arr = msg.split("-");
        String action = arr[0];
        if (action.equals("ready")) ready();
        if (action.equals("fire")) fire(arr);
        if (action.equals("feedback")) feedback(arr);

    }

    private void feedback(String[] arr) {
        boolean hit;
        if("true".equals(arr[1])){
            hit = true;
        }else {
            hit = false;
        }
        room.tell(new Messages.Feedback(hit),self());
    }

    private void ready(){
        room.tell(new Messages.Ready(self()), self());
    }

    private void fire(String[] arr){
        int x = Integer.parseInt(arr[1]);
        int y = Integer.parseInt(arr[2]);
        room.tell(new Messages.Fire(x,y, self()), self());
    }

    private void out(Object message) {
        out.write(message);
    }

    public static Props props(String user, WebSocket.In in, WebSocket.Out out) {
        return Props.create(Player.class, () -> new Player(user, in, out));
    }
}
