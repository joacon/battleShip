window.onload = init;
// var socket = new WebSocket("ws://54.158.19.139:9000/socket");
// var socket = new WebSocket("ws://localhost:9000/socket");
console.log(window.location.host);
var socket = new WebSocket("ws://"+ window.location.host +"/socket");
socket.onmessage = onMessage;

function post(message) {
    socket.send(message);
}

// var clock = $('.your-clock').FlipClock(60, {
//     clockFace: 'MinuteCounter',
//     countdown: true,
//     autoStart: true,
//     callbacks: {
//         start: function() {
//            
//         },
//         stop: function () {
//             randomFire();
//         },
//         reset: function () {
//             destroy();
//         },destroy: function () {
//
//         }
//     }
// });
// clock.start();
function onMessage(event) {
    var json = JSON.parse(event.data);
    var action = json.action;

    if (action === "Layout") {
        setTimeout(function () {
            $('.game').css("display", "block");
            $('.waiting').css("display", "none");
            $(".panel-bottom").css("display", "none");
            $("#fire-btn").css("display", "none");
            $(".message-div").css("display", "none");
        }, 1500);
        $('.waiting-text').text("Matching with opponent");
    }

    else if (action === "Opponent left") {
        // $('.game').css("display", "none");
        // $('.opponent-left').css("display", "block");
        $('.waiting-text').text("Opponent left, 30 seconds to re join");
    }


    else if (action === "Play") { //este jugador puede jugar
        if (!gameStarted) {
            gameStarted = true;
        }
        console.log(json);
        $(".panel-bottom").css("display", "block");
        $("#fire-btn").css("display", "block");
        Board.displayEnemyBoard();
        startTurn();
        setTimeout(function () {
            $("body").append("<div class='message-div'><p class='fire-message turn'>Your turn</p></div>");
            // $("body").css("opacity", 0.5);
            setTimeout(function () {
                $(".turn").remove();
                $("body").css("opacity", 1);
            }, 1000);
        }, 1000);

        reconnectBoard(json.hits);
    }


    else if (action === "You hit") { //Su ultimo tiro pego en el barco del otro
        var x = json.x;
        var y = json.y;
        $("body").append("<div class='message-div'><p class='fire-message hit'>Hit!</p></div>");
        // $("body").css("opacity", 0.5);
        setTimeout(function () {
            $(".hit").remove();
            $("body").css("opacity", 1);
        }, 1000);
        Board.tiles[lastShot[0]][lastShot[1]].enemy = 'hit';
    }

    else if (action === "You were hitted") { //Su ultimo tiro pego en el barco del otro
        Board.tiles[json.x][json.y].ownHit = 'hit';
        var x = json.x;
        var y = json.y;
        $("body").append("<div class='message-div'><p class='fire-message hit'>You were hit!</p></div>");
        // $("body").css("opacity", 0.5);
        setTimeout(function () {
            $(".hit").remove();
            $("body").css("opacity", 1);
        }, 1000);
    }


    else if (action === "You missed") {// Su ultimo tiro pifio
        var x = json.x;
        var y = json.y;
        $("body").append("<div class='message-div'><p class='fire-message miss'>You missed!</p></div>");
        // $("body").css("opacity", 0.5);
        setTimeout(function () {
            $(".miss").remove();
            $("body").css("opacity", 1);
        }, 1000);
        Board.tiles[lastShot[0]][lastShot[1]].enemy = 'miss';
    }


    else if (action === "You are safe") {// Su enemigo pifio
        Board.tiles[json.x][json.y].ownHit = 'miss';
        var x = json.x;
        var y = json.y;
        $("body").append("<div class='message-div'><p class='fire-message miss'>Opponent missed!</p></div>");
        // $("body").css("opacity", 0.5);
        setTimeout(function () {
            $(".miss").remove();
            $("body").css("opacity", 1);
        }, 1000);
    }


    else if (action === "Wait") {//este jugador esta esperando a que el otro juegue
        if (!gameStarted) {
            gameStarted = true;
        }
        $(".panel-bottom").css("display", "block");
        $("#fire-btn").css("display", "block");
        endTurn();
        Board.displayEnemyBoard();
        setTimeout(function () {
            $("body").append("<div class='message-div'><p class='fire-message turn'>Your opponent's turn</p></div>");
            // $("body").css("opacity", 0.5);
            setTimeout(function () {
                $(".turn").remove();
                $("body").css("opacity", 1);
            }, 1000);
        }, 1000);

        reconnectBoard(json.hits);
    }


    else if (action === "You sinked your enemy") {//este jugador hundio un barco de su enemigo
        var ship = JSON.parse(json.ship);
        $("body").append("<div class='message-div'><p class='fire-message sink'>You sunk your opponent's battleship!</p></div>");
        // $("body").css("opacity", 0.5);
        setTimeout(function () {
            $(".sink").remove();
            $("body").css("opacity", 1);
        }, 1000);
        Board.sinkEnemyShip(ship);
    }


    else if (action === "You are sinked") {//a este jugador le hundieron un bote
        var ship = JSON.parse(json.ship);
        $("body").append("<div class='message-div'><p class='fire-message sink'>The enemy sunk your battleship!</p></div>");
        // $("body").css("opacity", 0.5);
        setTimeout(function () {
            $(".sink").remove();
            $("body").css("opacity", 1);
        }, 1000);
        Board.sinkOwnShip(ship);
    }


    else if (action === "You win") {//este jugador gano
        gameOver(true);
        setTimeout(function () {
            $( "body" ).append( "<div class='message-div'><p class='fire-message win'>You won!</p></div>" );
            $( "body" ).css("opacity", 0.5);
            setTimeout(function () {
                $( ".win" ).remove();
                $( "body" ).css("opacity", 1);
                setTimeout(function () {
                    $( ".game" ).css("display", "none");
                    $( ".end-view" ).css("display", "block");
                    $( ".end-title" ).html("You won!");
                },1000);
            },1000);
        }, 1000);
    }


    else if (action === "You lose") {//este jugador perdio
        gameOver(false);
        setTimeout(function () {
            $( "body" ).append( "<div class='message-div'><p class='fire-message lose'>You lost! :(</p></div>" );
            $( "body" ).css("opacity", 0.5);
            setTimeout(function () {
                $( ".lose" ).remove();
                $( "body" ).css("opacity", 1);
                setTimeout(function () {
                    $( ".game" ).css("display", "none");
                    $( ".end-view" ).css("display", "block");
                    $( ".end-title" ).html("You lost! :(");
                },1000);
            },1000);
        }, 1000);
    }


    else if (action === "ReconnectLayout"){
        setTimeout(function () {
            $('.game').css("display", "block");
            $('.waiting').css("display", "none");
            $("#ready-btn").prop("disabled", true);
            $("#buttons").css("display", "none");
            $("#auto-place-btn").css("display", "none");
            $("#ready-btn").css("display", "none");
            $(".title").html("Enemy's Board");
        }, 1500);
        $('.waiting-text').text("Matching with opponent");
    }

    else if (action === "WaitingComeback"){
        setTimeout(function () {
            console.log("Waiting for comeback");
            $('.waiting-text').text("Opponent left, 30 seconds to re join");
        }, 1500);
        $('.waiting-text').text("Matching with opponent");
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
        $("#buttons").css("display", "none");
        $("#auto-place-btn").css("display", "none");
        $("#ready-btn").css("display", "none");
        $(".title").html("Waiting for your enemy");
    }
};


function reconnectBoard(jsonHits){
    console.log("Reconnected...");
    if (jsonHits !== null){
        var hits = JSON.parse(jsonHits);
        console.log(hits);
        var myHits = hits[0];
        for (var i = 0; i < myHits.length; i++) {
            var coords = myHits[i];
            Board.changeTile(coords[0], coords[1], 'hit');
            Board.tiles[coords[0]][coords[1]].enemy = 'hit';
        }
        var ownHits = hits[1];
        for (var i = 0; i < ownHits.length; i++) {
            var coords = ownHits[i];
            Board.tiles[coords[0]][coords[1]].ownHit = 'hit';
        }
        var misses = hits[2];
        for (var i = 0; i < misses.length; i++) {
            var coords = misses[i];
            Board.tiles[coords[0]][coords[1]].enemy = 'miss';
        }
        var ownMisses = hits[3];
        for (var i = 0; i < ownMisses.length; i++) {
            var coords = ownMisses[i];
            Board.tiles[coords[0]][coords[1]].ownHit = 'miss';
        }
        var sunks = JSON.parse(hits[4]);
        Board.sinkEnemyShip(sunks);
        var ownSunks = JSON.parse(hits[5]);
        Board.sinkOwnShip(ownSunks);
        // var myShips = hits[6];
        // myShips.forEach(functionmyShip){
        //     myShip.forEach(coords in myShip){
        //         Board.changeTile(coords[0], coords[1], 'boat');
        //     }
        // }
    }
}

/*function fire(x, y) {//pegale a este metodo para disparar

 }

 function sendFeedback(hit) {//hit es true si pego y false si no pego

 }*/

function init() {
}
