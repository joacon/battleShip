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

    public Ship hit(Coordinate coordinate){
        for (Ship ship : ships) {
            if (ship.hitCoordinate(coordinate)) {
                return ship;
            }
        }
        return null;
    }

    public boolean allSunk(){
        for (Ship ship : ships) {
            if (!ship.isSunk()) {
                return false;
            }
        }
        return true;
    }
}
