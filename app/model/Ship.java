package model;

import java.util.List;

/**
 * Created by joaquin on 13/06/16.
 */
public class Ship {
    private List<Coordinate> ship;
    private boolean sunk = false;

    public Ship(List<Coordinate> ship) {
        this.ship = ship;
    }

    public List<Coordinate> getShip() {
        return ship;
    }

    boolean hitCoordinate(Coordinate coordinate){
        for (Coordinate aShip : ship) {
            if (aShip.getX() == coordinate.getX() && aShip.getY() == coordinate.getY()) {
                aShip.setHit(true);
                setSunk();
                return true;
            }
        }
        return false;
    }

    private void setSunk(){
        sunk = true;
        for (Coordinate aShip : ship) {
            if (!aShip.isHit()) {
                sunk = false;
                break;
            }
        }
    }

    public boolean isSunk(){
        return sunk;
    }
}
