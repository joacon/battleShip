package actor;

import akka.actor.ActorRef;
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

        public Connection(String user, WebSocket.In in, WebSocket.Out out) {
            this.user = user;
            this.in = in;
            this.out = out;
        }
    }
    public static class Play{
    }
    public static class Wait{
    }
    public static class Ready{
        public final ActorRef player;

        public Ready(ActorRef player) {
            this.player = player;
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
}
