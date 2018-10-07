// FACEBOOK LOGIN 

window.fbAsyncInit = function() {
    FB.init({
        appId: '617759631919753',
        cookie: true,
        xfbml: true,
        version: 'v3.0'
    });

    FB.AppEvents.logPageView();


    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {

    if (response.status === 'connected') {
        console.log("logged in and authenticated");
        // setElements(true);
        // testAPI();
    } else {
        console.log("Not authenticated")
            // setElements(false);
    }
}


function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

// function setElements(isFBLoggedIn) {
//     if (isFBLoggedIn) {
//         document.getElementById('logout').style.display = 'block';
//         document.getElementById('profile').style.display = 'block';
//         document.getElementById('feed').style.display = 'block';
//         document.getElementById('fb-btn').style.display = 'none';
//         //   document.getElementById('heading').style.display = 'none';
//     } else {
//         document.getElementById('logout').style.display = 'none';
//         document.getElementById('profile').style.display = 'none';
//         document.getElementById('feed').style.display = 'none';
//         document.getElementById('fb-btn').style.display = 'block';
//         //   document.getElementById('heading').style.display = 'block';
//     }
// }

function logoutFB() {
    FB.logout(function(response) {
        setElements(false);
    });
    console.log('Logged out of Facebook');
}


function testAPI() {
    FB.api('/me?fields=name,email,birthday,location', function(response) {
        if (response && !response.error) {
            console.log(response);
            // window.localStorage.setItem("FBprofile", JSON.stringify(response));
            buildProfile(response);
        }
        // FB.api('/me/feed', function(response) {
        //     if (response && !response.error) {
        //         // window.localStorage.setItem("FBprofile.feed", response);
        //         buildFeed(response);
        //     }
        // });
    })
}

function testAPI2() {
    FB.api('/me/feed', function(response) {
        if (response && !response.error) {
            // window.localStorage.setItem("FBprofile.feed", response);
            buildFeed(response);
        }
    });
}


function buildProfile(user) {
    console.log(user);
    let profile = `
      <h3>${user.name} </h3> 
      <ul class="list-group">
        <li class="list-group-item">User ID: ${user.id}</li>
        <li class="list-group-item">Email: ${user.email}</li>
      </ul>
    `;
    // let name = user.name;
    // console.log(name);
    // let profile = JSON.parse(window.localStorage.getItem('FBprofile'));
    // console.log(profile);
    // document.getElementById('profileFB').innerHTML = user.name;
    // window.onload = function what() {
    //     document.getElementById('profileFB').innerHTML = profile;
    // }
    document.getElementById('profileFB').innerHTML = profile;
}
/* <li class="list-group-item">User ID: ${user.location.name}</li> */
/* <li class="list-group-item">Birthday: ${user.birthday}</li> */

function buildFeed(feed) {
    console.log(feed);
    let output = '<h3>Latest Posts</h3>';
    for (let i in feed.data) {
        if (feed.data[i].message) {
            output += `
          <div class="well">
            ${feed.data[i].message} <span>${feed.data[i].created_time}</span>
          </div>
        `;
        }
    }
    window.onload = function what2() {
        document.getElementById('feed').innerHTML = output;
    }

}