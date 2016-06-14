package model;

import java.util.List;

/**
 * Created by joaquin on 13/06/16.
 */
public class Ship {
    private List<Coordinate> ship;

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
                return true;
            }
        }
        return false;
    }

    public boolean isSinked(){
        boolean sinked = true;
        for (int i = 0; i< ship.size(); i++){
            if (!ship.get(i).isHit()){
                sinked = false;
                break;
            }
        }
        return sinked;
    }
}
