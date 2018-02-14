package actor;

import akka.actor.ActorRef;
import model.Ship;
import model.dbModels.GameMatch;
import model.dbModels.User;
import org.json.JSONArray;
import org.json.JSONObject;
import play.mvc.WebSocket;

public class Messages {
    public static class Join {
    }
    public static class Leave{
        public final String user;

        public Leave(String user){
            this.user = user;
        }
    }
    public static class Connection {
        public final String user;
        public final WebSocket.In in;
        public final WebSocket.Out out;
        public final User dbUser;

        public Connection(String user, WebSocket.In in, WebSocket.Out out, User dbUser) {
            this.user = user;
            this.in = in;
            this.out = out;
            this.dbUser = dbUser;
        }
    }
    public static class ReconnectReady{
        public final ActorRef player;

        public ReconnectReady(ActorRef player) {
            this.player = player;
        }
    }
    public static class Play{
        public final JSONObject fires;

        public Play(JSONObject fires) {
            this.fires = fires;
        }
    }
    public static class Wait{
        public final JSONObject fires;

        public Wait(JSONObject fires) {
            this.fires = fires;
        }
    }
    public static class Ready{
        public final ActorRef player;
        public final JSONArray boats;

        public Ready(ActorRef player, JSONArray boat) {
            this.player = player;
            this.boats = boat;
        }
    }
    public static class Fire{
        public final int x;
        public final int y;
        public final ActorRef player;

        public Fire(int x, int y, ActorRef player){
            this.x = x;
            this.y = y;
            this.player = player;
        }
    }
    public static class Feedback{
        public final boolean hit;

        public Feedback(boolean hit) {
            this.hit = hit;
        }
    }
    public static class Hit{
        public final int x;
        public final int y;
        public final boolean fromYou;

        public Hit(int x, int y, boolean fromYou) {
            this.x = x;
            this.y = y;
            this.fromYou = fromYou;
        }

    }
    public static class Miss{
        public final int x;
        public final int y;
        public final boolean fromYou;

        public Miss(int x, int y, boolean fromYou) {
            this.x = x;
            this.y = y;
            this.fromYou = fromYou;
        }
    }
    public static class Win{
        public final Sink sink;
        public final boolean you;

        public Win(Sink sink, boolean you) {
            this.sink = sink;
            this.you = you;
        }
    }
    public static class Sink{
        public final Ship ship;
        public final boolean fromYou;

        public Sink(Ship ship, boolean fromYou) {
            this.ship = ship;
            this.fromYou = fromYou;
        }
    }
    public static class Reconnect{
        public final WebSocket.In in;
        public final WebSocket.Out out;

        public Reconnect(WebSocket.In in, WebSocket.Out out) {
            this.in = in;
            this.out = out;
        }
    }

    public static class EndGame{
        public final ActorRef player1;
        public final ActorRef player2;
        public final ActorRef room;

        public EndGame(ActorRef player1, ActorRef player2, ActorRef room) {
            this.player1 = player1;
            this.player2 = player2;
            this.room = room;
        }
    }
}
