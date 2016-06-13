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
    public static class BothReady{
    }
}
