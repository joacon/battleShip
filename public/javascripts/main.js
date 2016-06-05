$(function () {
    Facebook.load(function () {
            document.getElementById("user-welcome").innerHTML = "Hello, " + Facebook.firstName + "!";
            Facebook.setProfilePic("square")
            Load.stop();
        }
    );
});
