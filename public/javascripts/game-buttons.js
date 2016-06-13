/**
 * Created by yankee on 11/06/16.
 */
var readyButton = "<div><button class='btn-success' id='ready-btn'>Ready</button></div>";
var unreadyButton = "<div><button class='btn-danger' id='unready-btn'>Unready</button></div>";
($(function () {
    $("#ready-btn").click(function () {
        ready();
        console.log("Ready!");
    });
}));

var ready = function () {
    // TODO what happens when user is ready to play
};