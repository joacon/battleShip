/**
 * Created by yankee on 13/06/16.
 */
var gameStarted = false;
var turn = false;
var horizontal = [true, true, true, true];
var lastShot = [];

($(function () {
    Board.startBoard();
    document.getElementsByTagName("html")[0].addEventListener('click', clearError, true);
    $("#turn").text("");
}));

var fire = function (x, y) {
    if (!gameStarted) {
        //displayError("Game hasn't started yet!");
        return false;
    }
    if (!turn) {
        displayError("It's not your turn!");
        return false;
    }
    var state = Board.tiles[x][y].enemy;
    if (state == 'unknown') {
        WebSocket.fire(x, y);
        lastShot = [x, y];
        endTurn();
        return true;
    } else {
        displayError("You already fired there!");
        return false;
    }
};

var startTurn = function () {
    console.log("Starting turn!");
    turn = true;
    $("#turn").text("Your turn!");
};

var endTurn = function () {
    turn = false;
    $("#turn").text("Opponent's turn");
};

var rotate = function (i) {
    horizontal[i - 1] = !horizontal[i - 1];
    $("#boat-selector-" + i).text(horizontal[i - 1] ? "H" : "V");
};

var displayError = function (message) {
    $("#error-message").text(message);
};

var clearError = function () {
    $("#error-message").text("");
};

var gameOver = function (won) {
    if (won) {
        // TODO if player has won
    } else {
        // TODO if player has lost
    }
};