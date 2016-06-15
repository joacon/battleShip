/**
 * Created by yankee on 01/06/16.
 */
var Board = {
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
                /*cell.addEventListener('mouseover', function () {
                 this.style.backgroundColor = 'black';
                 });
                 cell.addEventListener('mouseout', function () {
                 this.style.backgroundColor = '#5d71ff';
                 });*/
                cell.addEventListener('click', function (e) {
                    var id = e.target.id;
                    var x = Board.getNumberForLetter(id.charAt(id.length - 2));
                    var y = id.charAt(id.length - 1);
                    console.log(x);
                    console.log(y);
                    fire(x, y);
                })
            }
        }
        Board.generateTiles();
    },
    changeTile: function (x, y, status) {
        var tile = this.tiles[x][y];
        tile.own = status;
        var tileState = tile.own;
        if (tileState == 'hit') {
            tile.style.backgroundColor = 'green';
        } else if (tileState == 'miss') {
            tile.style.backgroundColor = 'red';
        }

    },
    tileOccupied: function (cellID) {
        var coordinates = cellID.substring(4);
        var x = this.getNumberForLetter(coordinates.charAt(0));
        var y = parseInt(coordinates.substring(1));
        if (x < 0 || y < 0 || x > 9 || y > 9) return true;
        var tile = this.tiles[x][y];
        return tile.own == 'boat';
    },
    boatCoordinates: [],
    displayOwnBoard: function () {
        if (!gameStarted) return false;
        var board = $("#main-grid");
        for (var i = 0; i < 10; i++) {
            var x = Board.getLetterForNumber(i);
            for (var j = 0; j < 10; j++) {
                var y = j;
                var cell = $("#cell" + x + "" + y);
                this.setTileImage(cell, Board.tiles[i][j].own)
            }
        }
    },
    displayEnemyBoard: function () {
        if (!gameStarted) return false;
        var board = $("#main-grid");
        for (var i = 0; i < 10; i++) {
            var x = Board.getLetterForNumber(i);
            for (var j = 0; j < 10; j++) {
                var y = j;
                var cell = $("#cell" + x + "" + y);
                this.setTileImage(cell, Board.tiles[i][j].enemy)
            }
        }
    },
    setTileImage: function (cell, tileState) {
        switch (tileState) {
            case 'unknown':
            case 'water':
                cell.css('background-color', '#5d71ff');
                break;
            case 'boat':
                cell.css('background-color', 'yellow');
                break;
            case 'hit':
                cell.css('background-color', 'green');
                break;
            case 'miss':
                cell.css('background-color', 'red');
        }
    }
};