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
    $("#" + cell + " .glyphicon").css("color", "red");
    return true;
  } else {
    if (!random) displayError("You already fired there!");
    if (random) randomFire();
    return false;
  }
};

var determineDirection = function (coordinates) {
  const x = coordinates.x;
  const y = coordinates.y;
  const tiles = Board.tiles;
  var result;

  debugger;

  if (x - 1 >= 0 && tiles[x - 1][y].enemy === 'hit') {
    // Go up until you find a water
    var topMostTileCoordinates = {x: x - 1, y: y, status: 'hit'};
    while (topMostTileCoordinates.x > 0 && topMostTileCoordinates.status === 'hit') {
      topMostTileCoordinates.x--;
      topMostTileCoordinates.status = tiles[topMostTileCoordinates.x][y].enemy;
    }
    if (topMostTileCoordinates.status === 'unknown') {
      return topMostTileCoordinates;
    }
  }

  if (x + 1 <= 9 && tiles[x + 1][y].enemy === 'hit') {
    // Go down until you find a water
    var bottomMostTileCoordinates = {x: x + 1, y: y, status: 'hit'};
    while (bottomMostTileCoordinates.x < 9 && bottomMostTileCoordinates.status === 'hit') {
      bottomMostTileCoordinates.x++;
      bottomMostTileCoordinates.status = tiles[bottomMostTileCoordinates.x][y].enemy;
    }
    if (bottomMostTileCoordinates.status === 'unknown') {
      return bottomMostTileCoordinates;
    }
  }

  if (y - 1 >= 0 && tiles[x][y - 1].enemy === 'hit') {
    // Go left until you find a water
    var leftMostTileCoordinates = {x: x, y: y - 1, status: 'hit'};
    while (leftMostTileCoordinates.y > 0 && leftMostTileCoordinates.status === 'hit') {
      leftMostTileCoordinates.y--;
      leftMostTileCoordinates.status = tiles[x][leftMostTileCoordinates.y].enemy;
    }
    if (leftMostTileCoordinates.status === 'unknown') {
      return leftMostTileCoordinates;
    }
  }

  if (y + 1 <= 9 && tiles[x][y + 1].enemy === 'hit') {
    // Go right until you find a water
    var rightMostTileCoordinates = {x: x, y: y + 1, status: 'hit'};
    while (rightMostTileCoordinates.y < 9 && rightMostTileCoordinates.status === 'hit') {
      rightMostTileCoordinates.y++;
      rightMostTileCoordinates.status = tiles[x][rightMostTileCoordinates.y].enemy;
    }
    if (rightMostTileCoordinates.status === 'unknown') {
      return rightMostTileCoordinates;
    }
  }
};

var chooseRandomSurroundingCoordinates = function (coordinates) {
  const direction = determineDirection(coordinates);
  const availableCoordinates = [];

  if (direction) {
    availableCoordinates.push(direction);
    return availableCoordinates;
  }

  if (coordinates.x + 1 <= 9 && Board.tiles[coordinates.x + 1][coordinates.y].enemy === 'unknown') {
    availableCoordinates.push({x: coordinates.x + 1, y: coordinates.y});
  }
  if (coordinates.y + 1 <= 9 && Board.tiles[coordinates.x][coordinates.y + 1].enemy === 'unknown') {
    availableCoordinates.push({x: coordinates.x, y: coordinates.y + 1});
  }
  if (coordinates.x - 1 >= 0 && Board.tiles[coordinates.x - 1][coordinates.y].enemy === 'unknown') {
    availableCoordinates.push({x: coordinates.x - 1, y: coordinates.y});
  }
  if (coordinates.y - 1 >= 0 && Board.tiles[coordinates.x][coordinates.y - 1].enemy === 'unknown') {
    availableCoordinates.push({x: coordinates.x, y: coordinates.y - 1});
  }
  return availableCoordinates;
};

var randomFire = function () {
  var couldFire = false;
  if (!turn) return;
  const coordinates = findUnsunkHit();
  console.log("Coords: ", coordinates);
  var x;
  var y;
  if (coordinates.length > 0) {
    var coordinateChosen = 0;
    var availableCoordinates = chooseRandomSurroundingCoordinates(coordinates[coordinateChosen]);

    while (availableCoordinates.length === 0) {
      availableCoordinates = chooseRandomSurroundingCoordinates(coordinates[++coordinateChosen]);
    }

    const randomlyChoosenCoordinates = availableCoordinates[Math.floor(Math.random() * Math.floor(availableCoordinates.length))];
    x = randomlyChoosenCoordinates.x;
    y = randomlyChoosenCoordinates.y;
  } else {
    x = parseInt(Math.random() * 10);
    y = parseInt(Math.random() * 10);
  }
  fire(x, y, true, "cell" + String.fromCharCode(x + 65) + "" + y);
};

var findUnsunkHit = function () {
  const tiles = Board.tiles;
  console.log("Tiles: ", tiles);
  const unsunkHits = [];
  for (var i = 0; i < tiles.length; i++) {
    const row = tiles[i];
    console.log("Row: ", row);
    for (var j = 0; j < row.length; j++) {
      const cell = row[j];
      if (cell.enemy === 'hit') {
        unsunkHits.push({x: cell.x, y: cell.y});
      }
    }
  }
  return unsunkHits;
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
  var $error = $("#error-message");
  $error.text(message);
  $error.css("display", "block");
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