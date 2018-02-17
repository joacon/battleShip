package actor;

import actor.Messages.Join;
import akka.actor.AbstractActor;
import akka.actor.ActorRef;
import akka.actor.Props;
import akka.japi.pf.ReceiveBuilder;
import model.dbModels.Ship;
import org.json.JSONArray;
import org.json.JSONObject;
import play.mvc.WebSocket;

public class Player extends AbstractActor{
    public final String user;
    public WebSocket.In in;
    public WebSocket.Out out;
    private ActorRef room = null;
    private boolean isReady;

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
                              .match(Messages.Reconnect.class, this::reconnect)
                              .match(Messages.WaitingPlayer.class, this::waitingNotification)
                        .build()
        );


        replaceIn(in);
    }

    private void waitingNotification(Messages.WaitingPlayer msg) {
        JSONObject json = new JSONObject();
        json.put("action", "WaitingComeback");
        out(json.toString());
    }

    private void replaceIn(WebSocket.In in){
        in.onMessage(this::in);

        in.onClose(new Runnable() {
            @Override
            public void run() {
                System.out.println(room);
                room.tell(new Messages.Leave(user), self());
            }
        });
    }

    private void reconnect(Messages.Reconnect msg) {
        this.in = msg.in;
        this.out = msg.out;
        replaceIn(this.in);
        System.out.printf("Player %s reconnected in %s\n", self().path(), room.path());
        JSONObject json = new JSONObject();
        if (isReady) {
            json.put("action", "ReconnectLayout");
        }else {
            json.put("action", "Layout");
        }
        out(json.toString());
        room.tell(new Messages.ReconnectReady(self()), self());
    }

    private void win(Messages.Win msg) {
        if (msg.sink != null) {
            sink(msg.sink);
        }
        JSONObject json = new JSONObject();
        if (msg.you) {
            json.put("action", "You win");
        }else {
            json.put("action", "You lose");
        }
        out(json.toString());
    }

    private void sink(Messages.Sink msg) {
        Ship ship = msg.ship;
        JSONArray shipCoor = new JSONArray();
        for (String s : ship.getPosition()) {
            int[] arr = new int[2];
            arr[0] = Integer.parseInt(s.substring(0,1));
            arr[1] = Integer.parseInt(s.substring(1,2));
            shipCoor.put(arr);
        }
        JSONObject json = new JSONObject();
        json.put("ship", shipCoor.toString());
        if (msg.fromYou){
            json.put("action", "You sinked your enemy");
        }else{
            json.put("action", "You are sinked");
        }
        out(json.toString());
    }

    private void miss(Messages.Miss msg) {
        JSONObject json = new JSONObject();
        json.put("x", msg.x);
        json.put("y", msg.y);
        if (msg.fromYou){
            json.put("action", "You missed");
        }else{
            json.put("action", "You are safe");
        }
        out(json.toString());
    }

    private void hit(Messages.Hit msg) {
        JSONObject json = new JSONObject();
        json.put("x", msg.x);
        json.put("y", msg.y);
        if (msg.fromYou){
            json.put("action", "You hit");
        }else{
            json.put("action", "You were hitted");
        }
        out(json.toString());
    }

    private void wait(Messages.Wait msg) {
        JSONObject json = new JSONObject();
        json.put("action", "Wait");
        if (msg.fires != null) {
            json.put("hits", msg.fires.toString());
        }else {
            json.put("hits", msg.fires);

        }
        out(json.toString());
    }

    private void checkFeedback(Messages.Feedback msg) {
        JSONObject json = new JSONObject();
        if (msg.hit){
            json.put("action", "Hit");
        }else{
            json.put("action", "Miss");
        }
        out(json.toString());
    }

    private void checkFire(Messages.Fire fire) {
        JSONObject json = new JSONObject();
        json.put("action", "Fire");
        json.put("x", fire.x);
        json.put("y", fire.y);
        out(json.toString());
    }

    private void play(Messages.Play play) {
        JSONObject json = new JSONObject();
        json.put("action", "Play");
        if (play.fires != null) {
            json.put("hits", play.fires.toString());
        }else {
            json.put("hits", play.fires);

        }
        out(json.toString());
    }

    private void join(Join join) {
        this.room = sender();
        System.out.printf("Player %s joined %s\n", self().path(), room.path());
        JSONObject json = new JSONObject();
        json.put("action", "Layout");
        out(json.toString());
    }

    private void left(Messages.Leave leave){
        JSONObject json = new JSONObject();
        json.put("action", "Opponent left");
        out(json.toString());
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
        hit = "true".equals(arr[1]);
        room.tell(new Messages.Feedback(hit),self());
    }

    private void ready(JSONArray obj){
        this.isReady = true;
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

    static Props props(String user, WebSocket.In in, WebSocket.Out out) {
        return Props.create(Player.class, () -> new Player(user, in, out));
    }
}
