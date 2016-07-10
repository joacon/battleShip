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

    public boolean checkCoordinate(Coordinate coordinate){
        boolean hit = false;
        for (int i = 0; i< ship.size(); i++){
            if (ship.get(i).getX() == coordinate.getX() && ship.get(i).getY() == coordinate.getY()){
                hit = ship.get(i).isHit();
                break;
            }
        }
        return hit;
    }

    public boolean hitCoordinate(Coordinate coordinate){
        for (int i = 0; i< ship.size(); i++){
            if (ship.get(i).getX() == coordinate.getX() && ship.get(i).getY() == coordinate.getY()){
                ship.get(i).setHit(true);
                setSinked();
                return true;
            }
        }
        return false;
    }

    private void setSinked(){
        sunk = true;
        for (int i = 0; i< ship.size(); i++){
            if (!ship.get(i).isHit()){
                sunk = false;
                break;
            }
        }
    }

    public boolean isSinked(){
        return sunk;
    }
}
