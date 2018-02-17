$(function () {
    Facebook.load(function () {
            Facebook.setProfilePic("large");
            console.log(Facebook.firstName + " " + Facebook.lastName);
            document.getElementById("user-name").innerHTML = Facebook.firstName + " " + Facebook.lastName;
            Load.stop();
        }
    );

    $.get("/userGames", function(data, status){
        var wins = data.wins;
        var loses = data.totalMatches - wins;
        var ctx = document.getElementById("myChart").getContext('2d');
        ctx.canvas.width = 300;
        ctx.canvas.height = 300;
        chartData = {
            labels: ["Wins", "Loses"],
            datasets: [{
                label: '# of Votes',
                data: [wins, loses],
                backgroundColor: [
                    // 'rgba(75, 192, 192, 0.2)',
                    // 'rgba(255, 99, 132, 0.2)'
                    'rgba(75, 192, 192, 1)',
                    'rgba(255,99,132,1)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255,99,132,1)'
                ],
                borderWidth: 1
            }]
        };


        var myPieChart = new Chart(ctx,{
            type: 'doughnut',
            data: chartData,
            options: {}
        });
    });

});
