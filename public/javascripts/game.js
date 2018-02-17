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
    Load.stop();
    Facebook.load(function () {
            Facebook.setProfilePic("large");
            console.log(Facebook.firstName + " " + Facebook.lastName);
            document.getElementById("user-name").innerHTML = Facebook.firstName + " " + Facebook.lastName;
        }
    );
}));

var fire = function (x, y, random, cell) {
    if (!gameStarted) {
        displayError("Game hasn't started yet!");
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
        $("#"+cell + " .glyphicon").css("color","red");
        return true;
    } else {
        if (!random) displayError("You already fired there!");
        if (random) randomFire();
        return false;
    }
};

var randomFire = function () {
    var couldFire = false;
    if (!turn) return;
    var x =parseInt(Math.random() * 10); 
    var y =parseInt(Math.random() * 10); 
    fire(x, y, true, "cell"+String.fromCharCode(x+65)+""+y);
};

var startTurn = function () {
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