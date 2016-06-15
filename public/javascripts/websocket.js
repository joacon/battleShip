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
        setTimeout(function () {
            $( "body" ).append( "<div class='message-div'><p class='fire-message turn'>Your turn</p></div>" );
            $( "body" ).css("opacity", 0.5);
            setTimeout(function () {
                $( ".turn" ).remove();
                $( "body" ).css("opacity", 1);
            },1000);
        },1000);
    } else if (action === "You hit") { //Su ultimo tiro pego en el barco del otro
        var x = json.x;
        var y = json.y;
        $( "body" ).append( "<div class='message-div'><p class='fire-message hit'>Hit</p></div>" );
        $( "body" ).css("opacity", 0.5);
        setTimeout(function () {
            $( ".hit" ).remove();
            $( "body" ).css("opacity", 1);
        },1000);
        Board.tiles[lastShot[0]][lastShot[1]].enemy = 'hit';
    } else if (action === "You were hitted") { //Su ultimo tiro pego en el barco del otro
        var x = json.x;
        var y = json.y;
        $( "body" ).append( "<div class='message-div'><p class='fire-message hit'>You were hitted</p></div>" );
        $( "body" ).css("opacity", 0.5);
        setTimeout(function () {
            $( ".hit" ).remove();
            $( "body" ).css("opacity", 1);
        },1000);
        Board.tiles[lastShot[0]][lastShot[1]].ownHit = 'hit';
    } else if (action === "You missed") {// Su ultimo tiro pifio
        var x = json.x;
        var y = json.y;
        $( "body" ).append( "<div class='message-div'><p class='fire-message miss'>You missed</p></div>" );
        $( "body" ).css("opacity", 0.5);
        setTimeout(function () {
            $( ".miss" ).remove();
            $( "body" ).css("opacity", 1);
        },1000);
        Board.tiles[lastShot[0]][lastShot[1]].enemy = 'miss';
    } else if (action === "You are safe") {// Su enemigo pifio
        var x = json.x;
        var y = json.y;
        $( "body" ).append( "<div class='message-div'><p class='fire-message miss'>You are safe</p></div>" );
        $( "body" ).css("opacity", 0.5);
        setTimeout(function () {
            $( ".miss" ).remove();
            $( "body" ).css("opacity", 1);
        },1000);
        Board.tiles[lastShot[0]][lastShot[1]].ownHit = 'miss';
    } else if (action === "Wait") {//este jugador esta esperando a que el otro juegue
        gameStarted = true;
        if (!turn) Board.displayEnemyBoard();
        setTimeout(function () {
            $( "body" ).append( "<div class='message-div'><p class='fire-message turn'>Your enemy's turn</p></div>" );
            $( "body" ).css("opacity", 0.5);
            setTimeout(function () {
                $( ".turn" ).remove();
                $( "body" ).css("opacity", 1);
            },1000);
        },1000);
        if (!gameStarted) {
            gameStarted = true;
            Board.displayEnemyBoard();
        }
    } else if (action === "You sinked your enemy") {//este jugador hundio un barco de su enemigo
        var ship = JSON.parse(json.ship);
        $( "body" ).append( "<div class='message-div'><p class='fire-message sink'>You sinked your enemy</p></div>" );
        $( "body" ).css("opacity", 0.5);
        setTimeout(function () {
            $( ".sink" ).remove();
            $( "body" ).css("opacity", 1);
        },1000);
    } else if (action === "You are sinked") {//a este jugador le hundieron un bote
        var ship = JSON.parse(json.ship);
        $( "body" ).append( "<div class='message-div'><p class='fire-message sink'>Your enemy sinked your boat</p></div>" );
        $( "body" ).css("opacity", 0.5);
        setTimeout(function () {
            $( ".sink" ).remove();
            $( "body" ).css("opacity", 1);
        },1000);
    } else if (action === "You win") {//este jugador gano
        gameOver(true);
        alert("you win");
    } else if (action === "You lose") {//este jugador perdio
        gameOver(false)
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
