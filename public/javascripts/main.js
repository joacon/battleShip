$(function () {
    Facebook.load(function () {
            var userWelcome = document.getElementById("user-welcome");
            if (userWelcome) {
                userWelcome.innerHTML = "Hello, " + Facebook.firstName + "!";
            }
            Facebook.setProfilePic("large");
            Load.stop();
        }
    );
});
