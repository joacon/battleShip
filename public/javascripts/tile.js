var Tile = function (x, y) {
    this.x = x;
    this.y = y;
    this.own = 'water'; // water, boat
    this.ownHit = 'none'; // hit, none
    this.enemy = 'unknown'; // hit, miss, unknown
};