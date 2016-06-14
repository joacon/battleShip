package actor;

import akka.actor.AbstractActor;
import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Props;
import akka.japi.Creator;
import akka.japi.pf.ReceiveBuilder;
import akka.pattern.Patterns;
import akka.util.Timeout;
import model.Coordinate;
import model.Fleet;
import model.Ship;
import org.json.JSONArray;
import org.json.JSONObject;
import play.mvc.WebSocket;
import scala.concurrent.Await;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;


public class GameRoom extends AbstractActor {
    private static ActorRef player1;
    private static ActorRef player2;
    private boolean turn = true;
    private boolean p1Ready = false;
    private boolean p2Ready = false;
    private Fleet p1Fleet;
    private Fleet p2Fleet;



    public GameRoom(ActorRef player1, ActorRef player2) {
        this.player1 = player1;
        this.player2 = player2;
        tellPlayers(new Messages.Join());

        receive(
                ReceiveBuilder.match(Messages.Join.class, this::join)
                              .match(Messages.Leave.class, this::tellPlayers)
                              .match(Messages.Ready.class, this::checkReady)
                              .match(Messages.Fire.class, this::checkFire)
                              .match(Messages.Feedback.class, this::sendFeedback)
                        .build()
        );
    }

    private void sendFeedback(Messages.Feedback msg) {
        if (turn){
            player1.tell(msg, self());
            player1.tell(new Messages.Wait(), self());
            player2.tell(new Messages.Play(), self());
            turn = false;
        }else {
            player2.tell(msg, self());
            player2.tell(new Messages.Wait(), self());
            player1.tell(new Messages.Play(), self());
            turn = true;
        }
    }


    private void join(Messages.Join p) {

    }

    private void checkFire(Messages.Fire msg){
        ActorRef player = msg.player;
        if (player.equals(player1)){
            Ship ship = p2Fleet.hit(new Coordinate(msg.x, msg.y));
            if (ship != null && ship.isSinked()){
                p2Fleet.sinkShip(ship);
                if (p2Fleet.getShips().isEmpty()){
                    player1.tell(new Messages.Win(new Messages.Sink(ship, true), true), self());
                    player2.tell(new Messages.Win(new Messages.Sink(ship, false), false), self());
                }else{
                    player1.tell(new Messages.Sink(ship, true), self());
                    player2.tell(new Messages.Sink(ship, false), self());
                }
            }else if (ship != null){
                player1.tell(new Messages.Hit(msg.x, msg.y, true),self());
                player2.tell(new Messages.Hit(msg.x, msg.y, false),self());
            }else {
                player1.tell(new Messages.Miss(msg.x, msg.y, true),self());
                player2.tell(new Messages.Miss(msg.x, msg.y, false), self());
            }
            player1.tell(new Messages.Wait(), self());
            player2.tell(new Messages.Play(), self());
            turn = false;
        }else{
            Ship ship = p1Fleet.hit(new Coordinate(msg.x, msg.y));
            if (ship != null && ship.isSinked()){
                p1Fleet.sinkShip(ship);
                if (p1Fleet.getShips().isEmpty()){
                    player2.tell(new Messages.Win(new Messages.Sink(ship, true), true), self());
                    player1.tell(new Messages.Win(new Messages.Sink(ship, false), false), self());
                }else{
                    player2.tell(new Messages.Sink(ship, true), self());
                    player1.tell(new Messages.Sink(ship, false), self());
                }
            }else if (ship != null){
                player2.tell(new Messages.Hit(msg.x, msg.y, true),self());
                player1.tell(new Messages.Hit(msg.x, msg.y, false),self());
            }else {
                player2.tell(new Messages.Miss(msg.x, msg.y, true),self());
                player1.tell(new Messages.Miss(msg.x, msg.y, false), self());
            }
            player2.tell(new Messages.Wait(), self());
            player1.tell(new Messages.Play(), self());
            turn = true;
        }
    }

    private void checkReady(Messages.Ready msg){
        if (player1.equals(msg.player)){
            p1Ready = true;
            p1Fleet = new Fleet();
            Iterator<Object> ships = msg.boats.iterator();
            while (ships.hasNext()){
                JSONArray ship = (JSONArray)ships.next();
                Iterator<Object> coor = ship.iterator();
                List<Coordinate> coordinates = new ArrayList<>();
                while (coor.hasNext()){
                    JSONArray coord = (JSONArray)coor.next();
                    Coordinate coordinate = new Coordinate(coord.getInt(0), coord.getInt(1));
                    coordinates.add(coordinate);
                }
                p1Fleet.addShip(new Ship(coordinates));
            }
        }else if (player2.equals(msg.player)){
            p2Ready = true;
            p2Fleet = new Fleet();
            Iterator<Object> ships = msg.boats.iterator();
            while (ships.hasNext()){
                JSONArray ship = (JSONArray)ships.next();
                Iterator<Object> coor = ship.iterator();
                List<Coordinate> coordinates = new ArrayList<>();
                while (coor.hasNext()){
                    JSONArray coord = (JSONArray)coor.next();
                    Coordinate coordinate = new Coordinate(coord.getInt(0), coord.getInt(1));
                    coordinates.add(coordinate);
                }
                p2Fleet.addShip(new Ship(coordinates));
            }
        }if (p1Ready && p2Ready){
            player1.tell(new Messages.Play(), self());
            player2.tell(new Messages.Wait(), self());
            turn = true;
        }
    }

    private void tellPlayers(Object msg) {
        player1.tell(msg, self());
        player2.tell(msg, self());
    }

    public static Props props(ActorRef player1, ActorRef player2) {
        return Props.create(GameRoom.class, () -> new GameRoom(player1, player2));
    }




}
