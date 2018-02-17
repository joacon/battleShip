package model.dbModels;

import com.avaje.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Ship extends Model{
    @Id
    private long id;

    private boolean sunk;

    private String position;

    private String hits;

    public Ship(boolean sunk, String position) {
        this.sunk = sunk;
        this.position = position;
        this.hits = "";
    }

    public Ship(String position) {
        this.position = position;
        this.sunk = false;
        this.hits = "";
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public boolean isSunk() {
        return sunk;
    }

    public void setSunk(boolean sunk) {
        this.sunk = sunk;
    }

    public String[] getPosition() {
        return position.split(",");
    }

    public void setPosition(String[] position) {
        StringBuilder positionBuilder = new StringBuilder();
        for (String pos : position) {
            positionBuilder.append(pos + ",");
        }
        this.position = positionBuilder.substring(0, positionBuilder.length() - 1);
    }

    boolean hasPosition(int x, int y){
        String[] position = getPosition();
        for (String s : position) {
            if (s.equals(x + "" + y)){
                return true;
            }
        }
        return false;
    }

    public String[] getHits() {
        return hits.split(",");
    }

    public void addHit(int x, int y){
        if (hits.length() == 0){
            this.hits = x + "" + y;
        }else{
            this.hits += "," + x + "" + y;
        }
        checkSink();
    }

    private void checkSink() {
        if (getHits().length == getPosition().length){
            setSunk(true);
        }
    }
}
