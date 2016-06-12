/**
 * Created by yankee on 11/06/16.
 */
($(function () {
    var buttonPanel = $("#button-panel");
    var boatsPanel = $("#boats");
    buttonPanel.append("<button class='btn-success' id='ready-btn'>Ready</button>");
    buttonPanel.append("<button class='btn-danger' id='unready-btn'>Unready</button>");
    for (var i = 0; i < 4; i++) {
        boatsPanel.append("<button class='btn-default' id='boat-selector-'" + i + "></button>");
    }

}));