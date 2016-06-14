/**
 * Created by yankee on 13/06/16.
 */
var turn = false;
var horizontal = [true, true, true, true];

($(function () {
    Board.startBoard();
}));

var fire = function (x, y) {
    if (!turn) return false;
    var state = Board.tiles[x][y].enemy;
    if (state == 'unknown') {
        WebSocket.fire(x, y);
        turn = false;
        return true;
    } else {
        return false;
    }
};

var sendFeedback = function (x, y) {
    var state = Board.tiles[x][y].own;
    if (state == 'water') {
        Websocket.sendFeedback(false);
    } else if (state == 'boat') {
        Websocket.sendFeedback(true);
    }
};

var rotate = function (i) {

    horizontal[i - 1] = !horizontal[i - 1];
    $("#boat-selector-" + i).text(horizontal[i - 1] ? "H" : "V");
};