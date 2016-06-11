/**
 * Created by yankee on 11/06/16.
 */
$(function () {
    Facebook.load(function () {
            var userWelcome = $("#user-welcome");
            if (userWelcome) {
                userWelcome.innerHTML = "Hello, " + Facebook.firstName + "!";
            }
            Facebook.setProfilePic("normal");
            Load.stop();
            setTimeout(function () {
                Load.start();
            }, 1500);
            setTimeout(function () {
                window.location.replace("/main");
            }, 3000);
        }
    );
});