/**
 * Created by yankee on 01/06/16.
 */
($(function () {
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
}));

var Board = {
    letters: "ABCDEFGHIJ",
    tiles: [],
    getLetterForNumber: function (i) {
        return this.letters[i];
    },
    generateTiles: function () {
        for (var i = 0; i < 10; i++) {
            var row = [];
            for (var j = 0; j < 10; j++) {
                row.push(new Tile(i, j));
            }
            this.tiles.push(row);
        }
    }
};