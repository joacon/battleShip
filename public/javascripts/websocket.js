window.onload = init;
var socket = new WebSocket("ws://localhost:9000/socket");
socket.onmessage = onMessage;


function post(message) {
    console.log(message);
    socket.send(message);
}

function onMessage(event) {
    console.log(event);
    if(event.data === "Layout"){
        setTimeout(function () {
            $('.game').css("display", "block");
            $('.waiting').css("display", "none");
        },1500);
        $('.waiting-text').text("Matching with oponent");
    }else if(event.data === "Opponent left"){
        $('.game').css("display", "none");
        $('.opponent-left').css("display", "block");
    }else if(event.data === "Play"){
        alert("start game");
    }
}


function init() {
}
