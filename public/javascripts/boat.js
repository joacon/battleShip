/**
 * Created by yankee on 13/06/16.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("img", ev.target.id);
    var id = ev.target.getAttribute("id"); // Boat id (boat-img-1, boat-img-2, ..)
    var num = id.charAt(id.length - 1); // Boat number (1, 2, 3, ..)
    ev.dataTransfer.setData("text", num);
}

function drop(ev) {
    ev.preventDefault();
    var num = ev.dataTransfer.getData("text"); // Boat number (1, 2, 3, ..)
    var counter = $("#boat-num-" + num); // The span element that contains the number of boats left
    var counterNum = parseInt(counter.text().charAt(1)); // The value of boats remaining as an integer
    if (counterNum == 0) return; // No boats left, should not reach this point

    if (Board.tileOccupied(ev.target.getAttribute("id"))) {
        return; // Tile already has an image in its place
    }

    /* If you use DOM manipulation functions, their default behaviour it not to
     copy but to alter and move elements. By appending a ".cloneNode(true)",
     you will not move the original element, but create a copy. */
    // If all tiles were correctly filled, lessen number of boats available by 1
    if (fillTiles(horizontal, ev.target, num)) counter.text("x" + (counterNum - 1));

}
// Function that will fill the dropped onto tile and all remaining tiles right (horizontal == true) or down
// (horizontal == false)
// Parameters are horizontal, the event tile and the size of the boat
var fillTiles = function (h, originTile, n) {
    //var originTile = ev.target; // Tile dragged on to
    var originTileId = originTile.getAttribute("id"); // Id of the tile dragged on to
    /*    var data = ev.dataTransfer.getData("img"); // The data bound to the event AKA the image id
     var nodeCopy;*/

    var originTileXLetter = originTileId.charAt(4); // Letter coordinate
    var originTileYLetter = originTileId.charAt(5); // Number coordinate
    var originTileX = Board.getNumberForLetter(originTileXLetter); // Letter coordinate turned into a number
    var originTileY = parseInt(originTileYLetter); // Number coordinate parsed
    // Check if all tiles are available
    var coordinates;
    for (var i = 0; i < n; i++) {
        if (horizontal[n - 1]) {
            coordinates = "cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + i);
            if (Board.tileOccupied(coordinates))
                return false;
        } else {
            coordinates = "cell" + Board.getLetterForNumber(originTileX + i) + "" + originTileY;
            if (Board.tileOccupied(coordinates))
                return false;
        }
    }


    var tileId = originTileId;
    var boatCoordinates = [];
    for (var j = 0; j < n; j++) {
        /*        nodeCopy = document.getElementById(data).cloneNode(true);
         nodeCopy.style.width = "50px;";
         nodeCopy.style.height = "50px;";
         nodeCopy.classList.remove("boat-img");
         nodeCopy.classList.add("boat-img-grid");*/
        if (horizontal[n - 1]) {
            tileId = "cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + j)/* + "-img"*/;
            //nodeCopy.id = tileId;
            //$("#cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + j)).append(nodeCopy);
            $("#cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + j))
                .css('background-color', 'yellow');
            Board.changeTile(originTileX, originTileY + j, 'boat');
            boatCoordinates.push([originTileX, originTileY + j]);
        } else {
            tileId = "cell" + Board.getLetterForNumber(originTileX + j) + "" + originTileY/* + "-img"*/;
            //nodeCopy.id = tileId;
            //$("#cell" + Board.getLetterForNumber(originTileX + j) + "" + originTileY).append(nodeCopy);
            $("#cell" + Board.getLetterForNumber(originTileX + j) + "" + originTileY).css("background-color", "yellow");
            Board.changeTile(originTileX + j, originTileY, 'boat');
            boatCoordinates.push([originTileX + j, originTileY]);
        }
    }
    Board.boatCoordinates.push(boatCoordinates);
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
            var cellID = "cell" + Board.getLetterForNumber(x) + "" + y;
            if (fillTiles(horizontal, document.getElementById(cellID), i)) {
                boats[i - 1]--;
                $("#boat-num-" + i).text("x0");
            }
        }
    }
};