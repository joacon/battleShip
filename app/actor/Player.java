package actor;

import actor.Messages.Join;
import akka.actor.AbstractActor;
import akka.actor.ActorRef;
import akka.actor.Props;
import akka.japi.pf.ReceiveBuilder;
import model.Coordinate;
import model.Ship;
import org.json.JSONArray;
import org.json.JSONObject;
import play.libs.Json;
import play.mvc.WebSocket;

import java.util.List;
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
                              .match(Messages.Hit.class, this::hit)
                              .match(Messages.Miss.class, this::miss)
                              .match(Messages.Sink.class, this::sink)
                              .match(Messages.Win.class, this::win)
                        .build()
        );


        in.onMessage(this::in);

        in.onClose(new Runnable() {
            @Override
            public void run() {
                System.out.println(room);
                room.tell(new Messages.Leave(user), self());
                out("{\"action\":\"Opponent left\"}");
            }
        });
    }

    private void win(Messages.Win msg) {
        sink(msg.sink);
        if (msg.you) {
            out("{\"action\":\"You win\"}");
        }else {
            out("{\"action\":\"You lose\"}");
        }
    }

    private void sink(Messages.Sink msg) {
        Ship ship = msg.ship;
        List<Coordinate> coordinates = ship.getShip();
        JSONArray shipCoor = new JSONArray();
        for (int i = 0; i< coordinates.size(); i++){
            Coordinate c = coordinates.get(i);
            shipCoor.put(c.getCoor());
        }
        if (msg.fromYou) {
            out("{\"action\":\"You sinked your enemy\", \"ship\" : \"" + shipCoor + "\"}");
        }else{
            out("{\"action\":\"You are sinked\", \"ship\" : \"" + shipCoor + "\"}");
        }
    }

    private void miss(Messages.Miss msg) {
        if (msg.fromYou){
            out("{\"action\":\"You missed\", \"x\" : \""+msg.x+"\" , \"y\" : \""+msg.y+"\"}");
        }else{
            out("{\"action\":\"You are safe\", \"x\" : \""+msg.x+"\" , \"y\" : \""+msg.y+"\"}");
        }
    }

    private void hit(Messages.Hit msg) {
        if (msg.fromYou){
            out("{\"action\":\"You hit\", \"x\" : \""+msg.x+"\" , \"y\" : \""+msg.y+"\"}");
        }else{
            out("{\"action\":\"You were hitted\", \"x\" : \""+msg.x+"\" , \"y\" : \""+msg.y+"\"}");
        }

    }

    private void wait(Messages.Wait msg) {
        out("{\"action\":\"Wait\"}");
    }

    private void checkFeedback(Messages.Feedback msg) {
        if (msg.hit){
            out("{\"action\":\"Hit\"}");
        }else{
            out("{\"action\":\"Miss\"}");
        }
    }

    private void checkFire(Messages.Fire fire) {
        out("{\"action\": \"Fire\", \"x\":"+fire.x+", \"y\":" +fire.y+"}");
    }

    private void play(Messages.Play ready) {
        out("{\"action\":\"Play\"}");
    }

    private void join(Join join) {
        this.room = sender();
        System.out.printf("Player %s joined %s\n", self().path(), room.path());
        out("{\"action\":\"Layout\"}");
    }

    private void left(Messages.Leave leave){
        out("{\"action\":\"Opponent left\"}");
    }

    private void in(Object message) {
        String msg = message.toString();
        JSONObject json = new JSONObject(msg);
        String action = json.getString("action");
        if (action.equals("ready")) ready((JSONArray)json.get("boats"));
        if (action.equals("fire")) fire((JSONArray)json.get("coordinate"));
//        if (action.equals("feedback")) feedback(arr);

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

    private void ready(JSONArray obj){
        room.tell(new Messages.Ready(self(), obj), self());
    }

    private void fire(JSONArray arr){
        int x = arr.getInt(0);
        int y = arr.getInt(1);
        room.tell(new Messages.Fire(x,y, self()), self());
    }

    private void out(Object message) {
        out.write(message);
    }

    public static Props props(String user, WebSocket.In in, WebSocket.Out out) {
        return Props.create(Player.class, () -> new Player(user, in, out));
    }
}
