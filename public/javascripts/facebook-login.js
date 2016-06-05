var userID;
var userName;

var status;
var profPic;

/*
 window.fbAsyncInit = function () {
 FB.init({
 appId: '827843860655568',
 xfbml: true,
 version: 'v2.6'
 });
 FB.getLoginStatus(function (response) {
 if (response.status === 'connected') {
 console.log('Logged in.');
 }
 else {
 FB.login();
 }
 });
 };

 (function (d, s, id) {
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) return;
 js = d.createElement(s);
 js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=827843860655568";
 fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));*/

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status == 'connected') {
        var fbBtn = document.getElementById("fb-login-btn");
        fbBtn.parentNode.removeChild(fbBtn);
        var loadImg = document.getElementById("loading-img");
        loadImg.parentNode.removeChild(loadImg);
        // Logged into your app and Facebook.
        FB.api(
            "/" + response.authResponse.userID + "/picture", {type: "normal"},
            function (response) {
                if (response && !response.error) {
                    console.log(response);
                    testAPI(response.data.url);
                }
            }
        )
        ;

    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        Load.stop();
        if (status) {
            status.innerHTML = "<div>You're this close to playing!</div>"
                + '<div class="progress"><div class="progress-bar" style="width: 83%;"></div></div>'
                + "<div>Log in to Facebook to get started!</div>";
        }
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '827843860655568',
        cookie: true,  // enable cookies to allow the server to access
                       // the session
        xfbml: true,  // parse social plugins on this page
        version: 'v2.5' // use graph api version 2.5
    });

    // Now that we've initialized the JavaScript SDK, we call
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.

    FB.getLoginStatus(function (response) {
        Load.start();
        statusChangeCallback(response);
    });

};

// Load the SDK asynchronously
/*(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));*/

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI(fbPicLink) {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {
        console.log('Successful login for: ' + response.name);
        Load.stop();
        status = document.getElementById('status');
        if (status) {
            status.innerHTML =
                "Thanks for logging in, " + response.name + "!"
                + "<div>You're ready to play!</div> "
                + "<div>You will be redirected shortly</div> ";
        }
        profPic = document.getElementById("profile-picture");
        if (profPic) {
            profPic.src = fbPicLink;
        }
        setTimeout(function () {
            window.location.replace("/main")
        }, 3000);
    });
}