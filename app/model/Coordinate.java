package model;

/**
 * Created by joaquin on 13/06/16.
 */
public class Coordinate {
    private int x;
    private int y;
    private boolean hit = false;

    public Coordinate(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public boolean isHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }

    public int[] getCoor(){
        int[] arr = new int[2];
        arr[0] = x;
        arr[1] = y;
        return arr;
    }
}
