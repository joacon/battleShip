window.onload = init;
var socket = new WebSocket("ws://localhost:9000/socket");
socket.onmessage = onMessage;

function post(message) {
    //console.log(message);
    socket.send(message);
}

function onMessage(event) {
    console.log(event);
    var json = JSON.parse(event.data);
    var action = json.action;
    if (action === "Layout") {
        setTimeout(function () {
            $('.game').css("display", "block");
            $('.waiting').css("display", "none");
        }, 1500);
        $('.waiting-text').text("Matching with oponent");
    } else if (action === "Opponent left") {
        $('.game').css("display", "none");
        $('.opponent-left').css("display", "block");
    } else if (action === "Play") { //este jugador puede jugar
        if (!gameStarted) {
            gameStarted = true;
            Board.displayEnemyBoard();
        }
        startTurn();
        alert("This player can fire");
    } else if (action === "Fire") {//cuando te llega esto tenes que ver si te pego a algun barco
        alert("fire");
    } else if (action === "You hit") { //Su ultimo tiro pego en el barco del otro
        alert("you hit");
        Board.tiles[lastShot[0]][lastShot[1]].enemy = 'hit';
    } else if (action === "You were hitted") { //Su ultimo tiro pego en el barco del otro
        Board.tiles[lastShot[0]][lastShot[1]].ownHit = 'hit';
        alert("you are hit");
    } else if (action === "You missed") {// Su ultimo tiro pifio
        Board.tiles[lastShot[0]][lastShot[1]].enemy = 'miss';
        alert("you missed");
    } else if (action === "You are safe") {// Su enemigo pifio
        Board.tiles[lastShot[0]][lastShot[1]].ownHit = 'miss';
        alert("you are safe");
    } else if (action === "Wait") {//este jugador esta esperando a que el otro juegue
        if (!gameStarted) {
            gameStarted = true;
            Board.displayEnemyBoard();
        }
        alert("Waiting -> the other player is firing");
    } else if (action === "You sinked your enemy") {//este jugador hundio un barco de su enemigo
        alert("Sinked boat");
    } else if (action === "You are sinked") {//a este jugador le hundieron un bote
        alert("boat down");
    } else if (action === "You win") {//este jugador gano
        alert("you win");
    } else if (action === "You lose") {//este jugador perdio
        alert("you lose");
    }
}

var Websocket = {
    fire: function (x, y) {
        post(JSON.stringify({
            "action": "fire",
            "coordinate": [x, y]
        }));
    },
    sendFeedback: function (hit) {
        post(JSON.stringify({
            "action": "feedback",
            "hit": hit
        }));
    },
    ready: function () {
        post(JSON.stringify({
            "action": "ready",
            "boats": Board.boatCoordinates
        }));
        $("#ready-btn").prop("disabled", true);
    }
};

/*function fire(x, y) {//pegale a este metodo para disparar

 }

 function sendFeedback(hit) {//hit es true si pego y false si no pego

 }*/


function init() {
}
