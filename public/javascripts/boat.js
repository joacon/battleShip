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
    if (fillTiles(horizontal, ev, num)) counter.text("x" + (counterNum - 1));

}
// Function that will fill the dropped onto tile and all remaining tiles right (horizontal == true) or down
// (horizontal == false)
// Parameters are horizontal, the drop event
var fillTiles = function (h, ev, n) {
    var originTile = ev.target;
    var originTileId = originTile.getAttribute("id");

    var data = ev.dataTransfer.getData("img");
    var nodeCopy;

    var originTileXLetter = originTileId.charAt(4);
    var originTileYLetter = originTileId.charAt(5);
    var originTileX = Board.getNumberForLetter(originTileXLetter);
    var originTileY = parseInt(originTileYLetter);
    // Check if all tiles are available
    var coordinates;
    console.log("n: " + n);
    for (var i = 0; i < n; i++) {
        console.log("Entered for.");
        if (horizontal[n - 1]) {
            coordinates = "cell" + Board.getLetterForNumber(originTileX) + "" + (originTileY + i);
            console.log("Horizontal: " + horizontal[n - 1]);
            console.log(coordinates);
            if (Board.tileOccupied(coordinates))
                return false;
        } else {
            coordinates = "cell" + Board.getLetterForNumber(originTileX + i) + "" + originTileY;
            console.log("Horizontal: " + horizontal[n - 1]);
            console.log(coordinates);
            console.log(Board.getLetterForNumber(originTileX));
            if (Board.tileOccupied(coordinates))
                return false;
        }
    }

    for (var j = 0; j < n; j++) {
        /*nodeCopy = document.getElementById(data).cloneNode(true);
         nodeCopy.id = "cell-" + originTileId + "-img";
         /!* We cannot use the same ID *!/
         ev.target.appendChild(nodeCopy);
         Board.changeTile(originTileX, originTileY, 'boat');*/
    }
    nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.id = originTileId + "-img";

    nodeCopy.style.width = "50px;";
    nodeCopy.style.height = "50px;";
    /* We cannot use the same ID */
    console.log(nodeCopy.classList);
    nodeCopy.classList.remove("boat-img");
    nodeCopy.classList.add("boat-img-grid");
    console.log(nodeCopy);
    ev.target.appendChild(nodeCopy);
    /*var node = $(originTileId + "-img");
     node.removeClass("boat-img");
     node.addClass("boat-img-grid");
     console.log(node);*/

    Board.changeTile(originTileX, originTileY, 'boat');
    return true;
};