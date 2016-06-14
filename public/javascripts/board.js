/**
 * Created by yankee on 01/06/16.
 */
/*($(function () {
 var board = $("#main-grid");
 for (var i = 0; i < 10; i++) {
 var row = board.append("<tr></tr>").children()[i];
 for (var j = 0; j < 10; j++) {
 var cell = row.insertCell(-1);
 cell.className += "tile";
 cell.id = "cell" + Board.getLetterForNumber(i) + '' + j;
 cell.addEventListener('mouseover', function () {
 this.style.backgroundColor = 'black';
 });
 cell.addEventListener('mouseout', function () {
 this.style.backgroundColor = 'white';
 });
 }
 }
 Board.generateTiles();
 }));*/

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
                //cell.attributes += 'ondrop="drop(event)"' + ' ondragover="allowDrop(event)"';
                cell.id = "cell" + Board.getLetterForNumber(i) + '' + j;
                cell.addEventListener('mouseover', function () {
                    this.style.backgroundColor = 'black';
                });
                cell.addEventListener('mouseout', function () {
                    this.style.backgroundColor = '#5d71ff';
                });
                cell.addEventListener('click', function () {
                    var canFire = fire(this.x, this.y);
                    if (canFire) {
                    } else {
                        // TODO feedback to show that player can't shoot there
                    }
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
    boatCoordinates: []
};