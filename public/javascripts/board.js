var Board = {
  boatsSet: 0,
  letters: "ABCDEFGHIJ",
  tiles: [],
  getLetterForNumber: function (i) {
    return this.letters[i];
  },
  getNumberForLetter: function (l) {
    return this.letters.indexOf(l);
  },
  generateTiles: function () {
    for (var i = 0; i < 10; i++) {
      var row = [];
      for (var j = 0; j < 10; j++) {
        row.push(new Tile(i, j));
      }
      this.tiles.push(row);
    }
  },
  startBoard: function () {
    var board = $("#main-grid");
    for (var i = 0; i < 10; i++) {
      var row = board.append("<tr></tr>").children()[i];
      for (var j = 0; j < 10; j++) {
        var cell = row.insertCell(-1);
        cell.className += "tile";
        cell.setAttribute("ondrop", "drop(event)");
        cell.setAttribute("ondragover", "allowDrop(event)");
        cell.style.backgroundColor = "#5d71ff";
        cell.id = "cell" + Board.getLetterForNumber(i) + '' + j;
        cell.innerText = Board.getLetterForNumber(i) + "" + j;
        $("#" + cell.id).append('<span class="glyphicon glyphicon-screenshot"></span>');
        cell.addEventListener('click', function (e) {
          var id;
          if ($(e.target).parent()[0].id != "") {
            id = $(e.target).parent()[0].id;
          } else {
            id = e.target.id;
          }
          var x = Board.getNumberForLetter(id.charAt(id.length - 2));
          var y = id.charAt(id.length - 1);
          console.log(x);
          console.log(y);
          $("#" + id).off();
          console.log("Game started: ", gameStarted);
          if (gameStarted) {
            fire(x, y, false, id);
          } else {
            rotateBoat(x, y);
          }
        });
      }
    }
    Board.generateTiles();
  },
  changeTile: function (x, y, status) {
    var tile = this.tiles[x][y];
    tile.own = status;
  },
  isTileOccupied: function (cellID) {
    var coordinates = cellID.substring(4);
    var x = this.getNumberForLetter(coordinates.charAt(0));
    var y = parseInt(coordinates.substring(1));
    if (x < 0 || y < 0 || x > 9 || y > 9) return true;
    var tile = this.tiles[x][y];
    return tile.own == 'boat';
  },
  boatCoordinates: [],
  displayOwnBoard: function () {
    $(".title").html("Your board");
    if (!gameStarted) return false;
    for (var i = 0; i < 10; i++) {
      var x = Board.getLetterForNumber(i);
      for (var j = 0; j < 10; j++) {
        var y = j;
        var cell = $("#cell" + x + "" + y);
        this.setOwnTileImage(cell, Board.tiles[i][j])
      }
    }
  },
  displayEnemyBoard: function () {
    if (!gameStarted) return false;
    $(".title").html("Your enemy's board");
    for (var i = 0; i < 10; i++) {
      var x = Board.getLetterForNumber(i);
      for (var j = 0; j < 10; j++) {
        var y = j;
        var cell = $("#cell" + x + "" + y);
        this.setEnemyTileImage(cell, Board.tiles[i][j])
      }
    }
  },
  setOwnTileImage: function (cell, tile) {
    var backgroundColor;
    cell.css("background", "");
    cell.css("background-color", "");
    switch (tile.own) {
      case 'water':
        backgroundColor = '#5d71ff';
        break;
      case 'boat':
        backgroundColor = 'yellow';
        break;
    }
    switch (tile.ownHit) {
      case 'hit':
        cell.css("background", "repeating-linear-gradient(45deg," + backgroundColor + "," + backgroundColor +
          " 10px,red 5px,#ccc 12px)");
        break;
      case 'none':
        cell.css("background-color", backgroundColor);
        break;
      case 'miss':
        cell.css("background", "repeating-linear-gradient(45deg, #5d71ff," +
          " #5d71ff 10px, red 5px, #ccc 12px)");
        break;
      case 'sunk':
        cell.css("background", "repeating-linear-gradient(45deg, yellow," +
          " yellow 10px, darkred 5px, #ccc 12px)");
        break;
    }

  },
  setEnemyTileImage: function (cell, tile) {
    cell.css("background", "");
    cell.css("background-color", "");
    switch (tile.enemy) {
      case 'unknown':
        cell.css("background-color", '#5d71ff');
        break;
      case 'miss':
        cell.css("background", "repeating-linear-gradient(45deg, #5d71ff," +
          " #5d71ff 10px, red 5px, #ccc 12px)");
        break;
      case 'hit':
        cell.css("background", "repeating-linear-gradient(45deg, yellow," +
          " yellow 10px, red 5px, #ccc 12px)");
        break;
      case 'sunk':
        cell.css("background", "repeating-linear-gradient(45deg, yellow," +
          " yellow 10px, darkred 5px, #ccc 12px)");
        break;
    }
  },
  sinkOwnShip: function (ship) {
    for (var i = 0; i < ship.length; i++) {
      var coords = ship[i];
      Board.tiles[coords[0]][coords[1]].ownHit = 'sunk';
    }
  },
  sinkEnemyShip: function (ship) {
    for (var i = 0; i < ship.length; i++) {
      var coords = ship[i];
      Board.tiles[coords[0]][coords[1]].enemy = 'sunk';
    }
  },
  removeCoordinates: function (coords) {
    for (var i = 0; i < Board.boatCoordinates.length; i++) {
      var boatCoords = Board.boatCoordinates[i];
      if (coords.length === boatCoords.length) {
        for (var j = 0; j < coords.length; j++) {
          if (coords[j] !== boatCoords[j]) break; // *waves hand* These are not the coordinates you're looking for
          if (j + 1 === coords.length) {
            // We can remove boatCoords from boatCoordinates
            Board.boatCoordinates.splice(i, 1);
            return true;
          }
        }
      }
    }
  },
  setEnemyHit: function (x, y) {
    Board.tiles[x][y].ownHit = 'hit';
  },
  setMyHit: function (x, y) {
    Board.tiles[x][y].enemy = 'hit';
  },
  setMyMiss: function (x, y) {
    Board.tiles[x][y].enemy = 'miss';
  },
  setEnemyMiss: function (x, y) {
    Board.tiles[x][y].ownHit = 'miss';
  },
  setEnemySunk: function (x, y) {
    Board.tiles[x][y].ownHit = 'sunk';
  },
  setMySunk: function (x, y) {
    Board.tiles[x][y].enemy = 'sunk';
  },
  checkToEnableReadyButton: function () {
    if (Board.boatsSet === 8) {
      $('#ready-btn').attr('disabled', false);
    }
  },
  addBoat: function (boatCoordinates) {
    Board.boatCoordinates.push(boatCoordinates);
    Board.boatsSet++;
  },
  removeBoat: function (boatCoordinates) {
    Board.boatCoordinates = Board.boatCoordinates.filter(function (coordinates) {
      if (coordinates.length !== boatCoordinates) {
        return true;
      } else {
        for (var i = 0; i < boatCoordinates.length; i++) {
          const boatCoordinate = boatCoordinates[i];
          if (boatCoordinate[0] === coordinates [0] && boatCoordinate[1] === coordinates[1]) {
            return false;
          }
        }
        return true;
      }
    })
  },
  clear: function () {
    Board.boatCoordinates = [];
    Board.boatsSet = 0;
    const tiles = Board.tiles;
    for (var i = 0; i < tiles.length; i++) {
      const row = tiles[i];
      for (var j = 0; j < row.length; j++) {
        row[j] = new Tile(i, j);
      }
    }
  }
};