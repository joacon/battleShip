package actor;

import play.mvc.WebSocket;

/**
 * Created by joaquin on 01/06/16.
 */
public class Messages {
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
}
