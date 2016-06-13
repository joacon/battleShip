var Tile = function (x, y) {
    this.x = x;
    this.y = y;
    this.own = 'water'; // HIT, MISS, BOAT, WATER
    this.enemy = 'unknown'; // HIT, MISS, UNKNOWN
};