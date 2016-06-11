var Load = {
    node: null,
    start: function () {

        if (!this.node) this.node = $('#loading');
        console.log(this.node);
        console.log("Started loading.");
        if (status) {
            document.getElementById('status').innerHTML = '';
        }
        this.node.innerHTML = '<img id="loading-img" src="@routes.Assets.versioned("img/loading-wheel.gif")"/>';
    },
    stop: function () {
        console.log("Stopped loading.");
        $('#loading-img').remove();
    }
};