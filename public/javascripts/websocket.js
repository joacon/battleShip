window.onload = init;
var socket = new WebSocket("ws://localhost:9000/socket");
socket.onmessage = onMessage;


function post() {
    socket.send($("#message").val());
}

function onMessage(event) {
    console.log(event);
    $('body').append("<p>"+event.data+"</p>");
}


function init() {
}
