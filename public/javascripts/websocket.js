window.onload = init;
// var socket = new WebSocket("ws://54.158.19.139:9000/socket");
// var socket = new WebSocket("ws://localhost:9000/socket");
console.log(window.location.host);
var socket = new WebSocket("ws://" + window.location.host + "/socket");
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
      $("body").append("<div class='message-div'><p class='fire-message win'>You won!</p></div>");
      setTimeout(function () {
        $(".win").remove();
        $("body").css("opacity", 1);
        setTimeout(function () {
          $(".game").css("display", "none");
          $(".end-view").css("display", "block");
          $(".end-title").html("You won!");
        }, 1000);
      }, 1000);
    }, 1000);
  }


  else if (action === "You lose") {//este jugador perdio
    gameOver(false);
    setTimeout(function () {
      $("body").append("<div class='message-div'><p class='fire-message lose'>You lost!</p></div>");
      setTimeout(function () {
        $(".lose").remove();
        $("body").css("opacity", 1);
        setTimeout(function () {
          $(".game").css("display", "none");
          $(".end-view").css("display", "block");
          $(".end-title").html("You lost!");
        }, 1000);
      }, 1000);
    }, 1000);
  }


  else if (action === "ReconnectLayout") {
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

  else if (action === "WaitingComeback") {
    var a = $(".op");
    if (a.length !== 0) {
      a.remove();
    }else {
      $("body").append("<div class='message-div'><p class='fire-message op'>Waiting for opponent to reconnect.</p></div>");
    }
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


function reconnectBoard(jsonHits) {
  console.log("Reconnected...");
  if (jsonHits !== null) {
    var hits = JSON.parse(jsonHits);
    console.log(hits);
    // Hits the enemy made
    var enemyHits = hits.enemyHits;
    for (var i = 0; i < enemyHits.length; i++) {
      var coords = enemyHits[i];
      Board.setEnemyHit(coords.x, coords.y);
      // Board.changeTile(coords.x, coords.y, 'hit');
      // Board.tiles[coords.x][coords.y].enemy = 'hit';
    }
    var myHits = hits.myHits;
    for (var i = 0; i < myHits.length; i++) {
      var coords = myHits[i];
      Board.setMyHit(coords.x, coords.y);
      // Board.tiles[coords.x][coords.y].ownHit = 'hit';
    }
    var enemyWater = hits.enemyWater;
    for (var i = 0; i < enemyWater.length; i++) {
      var coords = enemyWater[i];
      Board.setEnemyMiss(coords.x, coords.y);
      // Board.tiles[coords.x][coords.y].enemy = 'miss';
    }
    var myWater = hits.myWater;
    for (var i = 0; i < myWater.length; i++) {
      var coords = myWater[i];
      Board.setMyMiss(coords.x, coords.y);
      // Board.tiles[coords.x][coords.y].ownHit = 'miss';
    }

    var mySinks = hits.mySinks;
    for (var i = 0; i < mySinks.length; i++) {
      var mySink = mySinks[i];
      Board.setMySunk(mySink.x, mySink.y);
    }

    var enemySinks = hits.enemySinks;
    for (var i = 0; i < enemySinks.length; i++) {
      var enemySink = enemySinks[i];
      Board.setEnemySunk(enemySink.x, enemySink.y);
    }


    var myShips = hits.myShips;
    for (var i = 0; i < myShips.length; i++) {
      var myShip = myShips[i];
      for (var j = 0; j < myShip.length; j++) {
        var coords = myShip[j];
        Board.changeTile(coords.x, coords.y, 'boat');
      }
    }

    Board.displayEnemyBoard();
  }
}

/*function fire(x, y) {//pegale a este metodo para disparar

 }

 function sendFeedback(hit) {//hit es true si pego y false si no pego

 }*/

function init() {
}
