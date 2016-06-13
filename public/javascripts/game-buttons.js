/**
 * Created by yankee on 11/06/16.
 */

var readyButton = "<div><button class='btn-success' id='ready-btn'>Ready</button></div>";
var unreadyButton = "<div><button class='btn-danger' id='unready-btn'>Unready</button></div>";
($(function () {
    var buttonPanel = $("#button-panel");
    var boatsPanel = $("#boats");
    /*buttonPanel.append("<button class='btn-success' id='ready-btn'>Ready</button>");
     buttonPanel.append("<button class='btn-danger' id='unready-btn'>Unready</button>");*/
    /*    for (var i = 0; i < 4; i++) {
     boatsPanel.append("<button class='btn-default boat-btn' id='boat-selector-'" + i + "></button>");
     }*/

    $("#ready-btn").click(function () {
        ready();
        console.log("Ready!");
    });
    $("#unready-btn").click(function () {
        unready();
    });
}));

var ready = function () {
    //$("#ready-btn").css("visibility", "hidden");
    //$("#unready-btn").css("visibility", "visible");
    $("#ready-btn").remove();
    $("#button-panel").prepend(unreadyButton);
    $("#unready-btn").click(function () {
        unready();
    });
};

var unready = function () {
    //$("#ready-btn").css("visibility", "visible");
    //$("#unready-btn").css("visibility", "hidden");
    $("#unready-btn").remove();
    $("#button-panel").prepend(readyButton);
    $("#ready-btn").click(function () {
        ready();
    });
};