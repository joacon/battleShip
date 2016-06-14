var Facebook = {
    id: '',
    firstName: '',
    lastName: '',
    load: function (callback) {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
            window.fbAsyncInit = function () {
                FB.init({
                    appId: '827843860655568',
                    cookie: true,
                    xfbml: true,
                    version: 'v2.5'
                });
                FB.getLoginStatus(function (response) {
                    Load.start();
                    console.log(response);
                    Facebook.id = response.authResponse.userID;
                    Facebook.setInfo(callback);

                });
            };
        }(document, 'script', 'facebook-jssdk'));
    },
    setInfo: function (callback) {
        console.log(this.id);
        console.log("Callback: " + callback);
        if (this.id) {
            FB.api(
                "/" + this.id, {fields: "first_name,last_name"},
                function (response) {
                    if (response && !response.error) {
                        console.log(response);
                        Facebook.firstName = response.first_name;
                        Facebook.lastName = response.last_name;
                        var data = {
                            id : Facebook.id,
                            firstname : Facebook.firstName,
                            lastname : Facebook.lastName
                        };
                        $.post( "/login?id=" +data.id + "&firstname=" + data.firstname + "&lastname=" + data.lastname, function() {
                            
                        });
                    }
                    callback();
                }
            )
        }
    },
    setProfilePic: function (size) {
        if (size != "small" && size != "normal" && size != "album" && size != "large" && size != "square") return;
        if (this.id) {
            var elem = document.getElementById("profile-picture");
            FB.api("/" + this.id + "/picture", {type: size}, function (response) {
                console.log(response);
                if (response && !response.error) {
                    elem.src = response.data.url;
                    //elem.src = url;
                }
            });
        }
    }
};

// Load SDK asynchronously
/*
 $(function (d, s, id) {
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) return;
 js = d.createElement(s);
 js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
 window.fbAsyncInit = function () {
 FB.init({
 appId: '827843860655568',
 cookie: true,
 xfbml: true,
 version: 'v2.5'
 });
 FB.getLoginStatus(function (response) {
 Load.start();
 console.log(response);
 Facebook.id = response.authResponse.userID;
 Facebook.setInfo();
 });
 };
 }(document, 'script', 'facebook-jssdk'));*/
