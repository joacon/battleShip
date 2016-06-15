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

var fire = function (x, y, random) {
    if (!gameStarted) {
        //displayError("Game hasn't started yet!");
        return false;
    }
    if (!turn) {
        displayError("It's not your turn!");
        return false;
    }
    $("#error-message").css("display", "none");
    var state = Board.tiles[x][y].enemy;
    if (state == 'unknown') {
        Websocket.fire(x, y);
        lastShot = [x, y];
        endTurn();
        return true;
    } else {
        if (!random) displayError("You already fired there!");
        return false;
    }
};

var randomFire = function () {
    var couldFire = false;
    if (!turn) return;
    fire(parseInt(Math.random() * 10), parseInt(Math.random() * 10), true);
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
    $("#error-message").css("display", "block");
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