window.onload = init;
var socket = new WebSocket("ws://localhost:9000/socket");
socket.onmessage = onMessage;

function post(message) {
    console.log(message);
    socket.send(message);
}

function onMessage(event) {
    console.log(event);
    // var json = JSON.parse(event.data);
    if (event.data === "Layout") {
        setTimeout(function () {
            $('.game').css("display", "block");
            $('.waiting').css("display", "none");
        }, 1500);
        $('.waiting-text').text("Matching with oponent");
    } else if (event.data === "Opponent left") {
        $('.game').css("display", "none");
        $('.opponent-left').css("display", "block");
    } else if (event.data === "Play") { //este jugador puede jugar
        alert("This player can fire");
    } else if (json.action === "Fire") {//cuando te llega esto tenes que ver si te pego a algun barco
        alert("fire");
    } else if (event.data === "Hit") { //Su ultimo tiro pego en el barco del otro
        alert("Hit");
    } else if (event.data === "Miss") {// Su ultimo tiro pifio el barco del otro
        alert("Miss");
    } else if (event.data === "Wait") {//este jugador esta esperando a que el otro juegue
        alert("Waiting -> the other player is firing");
    }
}

var Websocket = {
    fire: function (x, y) {
        post("fire" + "-" + x + "-" + y);
    },
    sendFeedback: function (hit) {
        post("feedback-" + hit);
    }
};

/*function fire(x, y) {//pegale a este metodo para disparar

 }

 function sendFeedback(hit) {//hit es true si pego y false si no pego

 }*/


function init() {
}
