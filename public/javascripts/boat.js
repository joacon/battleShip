function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  var id = ev.target.getAttribute("id"); // Boat id (boat-img-1, boat-img-2, ..)
  var num = id.charAt(id.length - 1); // Boat number (1, 2, 3, ..)
  ev.dataTransfer.setData("text", num);
}

function redrag(ev) {
  var id = ev.target.getAttribute("id"); // Cell id (cellA5, cellF8, ..)
  var coordinates = [id.charAt(4), id.charAt(5)];
  ev.dataTransfer.setData("coords", coordinates);
  ev.dataTransfer.setData("redrag", true);
  ev.dataTransfer.setData("id", ev.target.getAttribute("id"));
}

function drop(ev) {
  ev.preventDefault();
  var num;
  if (ev.dataTransfer.getData("redrag")) {
    var id = ev.dataTransfer.getData("id"); // Get the drag event for information on the source
    var startTile = $("#" + id); // Find the starting tile that was dragged
    num = startTile.data("coordinates").length; // The length of the boat dragged
    if (Board.isTileOccupied(ev.target.getAttribute("id"))) {
      return; // Tile already has an image in its place
    }

    if (fillTiles(startTile.data("horizontal"), ev.target, num)) {
      // Reset the original tiles to water
      tilesToWater(startTile, num, startTile.data("horizontal")[0]);
    }
  } else {
    num = ev.dataTransfer.getData("text"); // Boat number (1, 2, 3, ..)
    var counter = $("#boat-num-" + num); // The span element that contains the number of boats left
    var counterNum = parseInt(counter.text().charAt(1)); // The value of boats remaining as an integer
    if (counterNum == 0) return; // No boats left, should not reach this point

    if (Board.isTileOccupied(ev.target.getAttribute("id"))) {
      return; // Tile already has an image in its place
    }

    /* If you use DOM manipulation functions, their default behaviour it not to
     copy but to alter and move elements. By appending a ".cloneNode(true)",
     you will not move the original element, but create a copy. */
    // If all tiles were correctly filled, lessen number of boats available by 1
    if (fillTiles(horizontal, ev.target, num)) counter.text("x" + (counterNum - 1));
  }
}
// Function that will fill the dropped onto tile and all remaining tiles right (horizontal == true) or down
// (horizontal == false)
// Parameters are horizontal, the event tile and the size of the boat
var fillTiles = function (h, originTile, n) {
  //var originTile = ev.target; // Tile dragged on to
  var originTileId = originTile.getAttribute("id"); // Id of the tile dragged on to

  var originTileXLetter = originTileId.charAt(4); // Letter coordinate
  var originTileYLetter = originTileId.charAt(5); // Number coordinate
  var originTileX = Board.getNumberForLetter(originTileXLetter); // Letter coordinate turned into a number
  var originTileY = parseInt(originTileYLetter); // Number coordinate parsed
  // Check if all tiles are available
  var coordinates;
  for (var i = 0; i < n; i++) {
    if (h[n - 1]) {
      coordinates = "cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + i);
      var topNeighbour = "cell" + Board.getLetterForNumber(originTileX + 1) + "" + (originTileY + i);
      var bottomNeighbour = "cell" + Board.getLetterForNumber(originTileX - 1) + "" + (originTileY + i);
      var leftNeighbour = "cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + i + 1);
      var rightNeighbour = "cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + i - 1);
      if (Board.isTileOccupied(coordinates)
        || ($('#' + topNeighbour)[0] && Board.isTileOccupied(topNeighbour))
        || ($('#' + bottomNeighbour)[0] && Board.isTileOccupied(bottomNeighbour))
        || ($('#' + leftNeighbour)[0] && Board.isTileOccupied(leftNeighbour))
        || ($('#' + rightNeighbour)[0] && Board.isTileOccupied(rightNeighbour)))
        return false;
    } else {
      coordinates = "cell" + Board.getLetterForNumber(originTileX + i) + "" + originTileY;
      var topNeighbour = "cell" + Board.getLetterForNumber(originTileX + i + 1) + "" + (originTileY);
      var bottomNeighbour = "cell" + Board.getLetterForNumber(originTileX + i - 1) + "" + (originTileY);
      var leftNeighbour = "cell" + Board.getLetterForNumber(originTileX + i) + "" + (originTileY + 1);
      var rightNeighbour = "cell" + Board.getLetterForNumber(originTileX + i) + "" + (originTileY - 1);
      if (Board.isTileOccupied(coordinates)
        || ($('#' + topNeighbour)[0] && Board.isTileOccupied(topNeighbour))
        || ($('#' + bottomNeighbour)[0] && Board.isTileOccupied(bottomNeighbour))
        || ($('#' + leftNeighbour)[0] && Board.isTileOccupied(leftNeighbour))
        || ($('#' + rightNeighbour)[0] && Board.isTileOccupied(rightNeighbour)))
        return false;
    }
  }


  var tileId = originTileId;
  var boatCoordinates = [];
  var tile;
  var startTile;
  for (var j = 0; j < n; j++) {

    if (h[n - 1]) {
      tileId = "cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + j);
      tile = $("#" + tileId);
      if (j == 0) {
        startTile = tile;
      }
      tile.css('background-color', 'yellow');
      Board.changeTile(originTileX, originTileY + j, 'boat');
      boatCoordinates.push([originTileX, originTileY + j]);
    } else {
      tileId = "cell" + Board.getLetterForNumber(originTileX + j) + "" + originTileY;
      tile = $("#" + tileId);
      if (j == 0) {
        startTile = tile;
      }
      tile.css("background-color", "yellow");
      Board.changeTile(originTileX + j, originTileY, 'boat');
      boatCoordinates.push([originTileX + j, originTileY]);
    }
  }
  startTile.data("start", true);
  startTile.data("coordinates", boatCoordinates);
  startTile.data("horizontal", [h[n - 1], h[n - 1], h[n - 1], h[n - 1]]);
  startTile.attr("draggable", "true");
  startTile.attr("ondragstart", "redrag(event)");
  Board.addBoat(boatCoordinates);
  // Board.boatCoordinates.push(boatCoordinates);
  Board.checkToEnableReadyButton();
  return true;
};

var autoPlaceBoats = function () {
  var boats = [parseInt($("#boat-num-1").text().substring(1)),
    parseInt($("#boat-num-2").text().substring(1)),
    parseInt($("#boat-num-3").text().substring(1)),
    parseInt($("#boat-num-4").text().substring(1))];
  console.log(boats);
  for (var i = 1; i < 5; i++) {
    while (boats[i - 1] > 0) {
      var x = parseInt(Math.random() * 10);
      var y = parseInt(Math.random() * 10);
      horizontal = [parseInt(Math.random() * 2), parseInt(Math.random() * 2), parseInt(Math.random() * 2), parseInt(Math.random() * 2)];
      var cellID = "cell" + Board.getLetterForNumber(x) + "" + y;
      if (fillTiles(horizontal, document.getElementById(cellID), i)) {
        boats[i - 1]--;
        $("#boat-num-" + i).text("x0");
      }
    }
  }
};

var tilesToWater = function (startTile, n, h) {
  // Remove the coordinates from the board
  Board.removeCoordinates(startTile.data("coordinates"));
  // Set the tiles to blue and water
  var tileId = startTile.attr("id");
  var originTileX = startTile.data("coordinates")[0][0];
  var originTileY = startTile.data("coordinates")[0][1];
  var tile;
  for (var j = 0; j < n; j++) {
    if (h) {
      tileId = "cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + j);
      tile = $("#" + tileId);
      tile.css('background-color', '#5D71FF');
      tile.attr("draggable", "false");
      Board.changeTile(originTileX, originTileY + j, 'water');
    } else {
      tileId = "cell" + Board.getLetterForNumber(originTileX + j) + "" + originTileY;
      tile = $("#" + tileId);
      tile.css("background-color", "#5D71FF");
      tile.attr("draggable", "false");
      Board.changeTile(originTileX + j, originTileY, 'water');
    }
  }
};