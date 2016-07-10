package controllers;

import actor.GameRoom;
import actor.GameRoomManager;
import com.fasterxml.jackson.databind.JsonNode;
import play.mvc.*;
import akka.actor.*;

/**
 * Created by joaquin on 01/06/16.
 */
public class SocketCtrl extends Controller {


    public LegacyWebSocket<String> socket() {
        String id2 = session("id");
        return  new LegacyWebSocket<String>() {
            @Override public void onReady(WebSocket.In in, WebSocket.Out out) {
                try {
                    GameRoomManager.join(id2 + "$" + Math.random(), in, out);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
    }


// private final ActorSystem actorSystem;
//    private final Materializer materializer;
//    private final OverflowStrategy overflowStrategy;
//
//    @Inject
//    public SocketCtrl(ActorSystem actorSystem, Materializer materializer) {
//        this.actorSystem = actorSystem;
//        this.materializer = materializer;
//        this.overflowStrategy= OverflowStrategy.dropNew();
//    }
//
//    public WebSocket socket() {
//        return WebSocket.Text.accept(new Function<Http.RequestHeader, akka.stream.javadsl.Flow<String, String, ?>>() {
//            @Override
//            public akka.stream.javadsl.Flow<String, String, ?> apply(Http.RequestHeader requestHeader) {
//                Flow<String, String, ?> inOutFlow = ActorFlow.actorRef(request ->
//                                Props.create(MyWebSocketActor.class, (Creator<MyWebSocketActor>) MyWebSocketActor::new), 16, overflowStrategy,
//                        actorSystem, materializer);
//                return inOutFlow;
//            }
//        });
//    }
}
