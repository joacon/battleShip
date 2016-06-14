package model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by joaquin on 13/06/16.
 */
public class Fleet {
    private List<Ship> ships;

    public Fleet() {
        ships = new ArrayList<>();
    }

    public List<Ship> getShips() {
        return ships;
    }

    public void addShip(Ship ship){
        ships.add(ship);
    }

    public void sinkShip(Ship ship){
        ships.remove(ship);
    }

    public Ship hit(Coordinate coordinate){
        for(int i=0; i< ships.size(); i++){
            if(ships.get(i).hitCoordinate(coordinate)){
                return ships.get(i);
            }
        }
        return null;
    }
}
