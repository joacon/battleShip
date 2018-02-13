package model.dbModels;

import com.avaje.ebean.Model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import static javax.persistence.CascadeType.ALL;

@Entity
public class GameMatch extends Model{
    @Id
    private long id;

    @ManyToOne
    private User player1;

    @ManyToOne
    private User player2;

    @ManyToOne
    private User winner;

    private boolean player1Ready;

    private boolean player2Ready;

    //player id
    @ManyToOne
    private User turn;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Ship> player1Ships;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Ship> player2Ships;

    private String player1Hits;

    private String player2Hits;


    public GameMatch(User player1, User player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1Ships = new ArrayList<>();
        this.player2Ships = new ArrayList<>();
        this.player1Hits = "";
        this.player2Hits = "";
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public User getPlayer1() {
        return player1;
    }

    public void setPlayer1(User player1) {
        this.player1 = player1;
    }

    public User getPlayer2() {
        return player2;
    }

    public void setPlayer2(User player2) {
        this.player2 = player2;
    }

    public User getWinner() {
        return winner;
    }

    public void setWinner(User winner) {
        this.winner = winner;
    }

    public boolean isPlayer1Ready() {
        return player1Ready;
    }

    public void setPlayer1Ready(boolean player1Ready) {
        this.player1Ready = player1Ready;
    }

    public boolean isPlayer2Ready() {
        return player2Ready;
    }

    public void setPlayer2Ready(boolean player2Ready) {
        this.player2Ready = player2Ready;
    }

    public User getTurn() {
        return turn;
    }

    public void setTurn(User turn) {
        this.turn = turn;
    }

    public List<Ship> getPlayer1Ships() {
        return player1Ships;
    }

    public void setPlayer1Ships(List<Ship> player1Ships) {
        this.player1Ships = player1Ships;
    }

    public List<Ship> getPlayer2Ships() {
        return player2Ships;
    }

    public void setPlayer2Ships(List<Ship> player2Ships) {
        this.player2Ships = player2Ships;
    }

    public String[] getPlayer1Hits() {
        return player1Hits.split(",");
    }

    public void setPlayer1Hits(String[] player1Hits) {
        StringBuilder hits = new StringBuilder();
        for (String player1Hit : player1Hits) {
            hits.append(player1Hit + ",");
        }
        this.player1Hits = hits.substring(0, hits.length() - 1);
    }

    public String[] getPlayer2Hits() {
        return player2Hits.split(",");
    }

    public void setPlayer2Hits(String[] player2Hits) {
        StringBuilder hits = new StringBuilder();
        for (String player2Hit : player2Hits) {
            hits.append(player2Hit + ",");
        }
        this.player2Hits = hits.substring(0, hits.length() - 1);
    }

    public Ship getShipInPosition(boolean player, int x, int y){
        if (!player){
            return getShipInPosition(player1Ships, x, y);
        }else {
            return getShipInPosition(player2Ships, x, y);
        }
    }

    private Ship getShipInPosition(List<Ship> ships, int x, int y){
        for (Ship ship : ships) {
            if (ship.hasPosition(x, y)) return ship;
        }
        return null;
    }

    public void addHit(boolean player, int x, int y){
        if (player){
            this.player1Hits = addHit(getPlayer1Hits(), x, y);
        }else{
            this.player2Hits = addHit(getPlayer2Hits(), x, y);
        }
    }

    private String addHit(String[] hits, int x, int y){
        String h = String.join(",", hits);
        if (!h.equals("")){
            h += ",";
        }
        h += x + "" + y;
        return h;
    }
}
