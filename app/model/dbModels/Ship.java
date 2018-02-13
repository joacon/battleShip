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

    public Ship(boolean sunk, String position) {
        this.sunk = sunk;
        this.position = position;
    }

    public Ship(String position) {
        this.position = position;
        this.sunk = false;
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
}
