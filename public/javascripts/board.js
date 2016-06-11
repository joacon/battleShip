/**
 * Created by yankee on 01/06/16.
 */
($(function () {
    var board = $("#main-grid");
    var rows = [];
    for (var i = 0; i < 10; i++) {
        //for (var j = 0; j < 10; j++) {
        rows.push(i);
        //}
    }

    var tileRows = d3.select("#main-grid").selectAll("tr")
        .data(rows).enter();

    tileRows.append("tr")
        /*.style("margin-top", function (d) {
         return d[0] * 50 + "px";
         })
         .style("margin-left", function (d) {
         return d[1] * 50 + "px";
         })*/;

    var tileCols = d3.select("#main-grid").selectAll("tr").data(rows);

    tileCols.append("td").classed("tile", true);
}));