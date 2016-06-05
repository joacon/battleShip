var Load = {
    start: function () {
        console.log("Started loading.");
        if (status) {
            document.getElementById('status').innerHTML = '';
        }
        document.getElementById('loading').style.visibility = 'visible';
    },
    stop: function () {
        console.log("Stopped loading.");
        document.getElementById('loading').style.visibility = 'hidden';
    }
};