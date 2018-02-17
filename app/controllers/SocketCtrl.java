package controllers;

import actor.GameRoom;
import actor.GameRoomManager;
import com.fasterxml.jackson.databind.JsonNode;
import model.dbModels.User;
import play.mvc.*;
import akka.actor.*;
import services.UserService;

import java.util.Optional;

/**
 * Created by joaquin on 01/06/16.
 */
public class SocketCtrl extends Controller {


    public LegacyWebSocket<String> socket() {
        System.out.println("USER GET");
        String id2 = session("id");
        Optional<User> userByFBId = UserService.getUserService().getUserByFBId(Long.parseLong(id2));
        System.out.println("USER GET");
        if (userByFBId.isPresent()) {
            System.out.println(userByFBId.get());
        }else {
            System.out.println("USER NOT FOUND");
        }
        return  new LegacyWebSocket<String>() {
            @Override public void onReady(WebSocket.In in, WebSocket.Out out) {
                try {
                    System.out.println("Joining game in " + in);
                    System.out.println("Joining game out " + out);
                    GameRoomManager.join(id2 + "$" + Math.random(), in, out, userByFBId.get());
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
