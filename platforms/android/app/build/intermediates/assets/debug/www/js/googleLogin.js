var googleapi = {
  authorize: function(options) {
    var deferred = $.Deferred();

    //Build the OAuth consent page URL
    var authUrl =
      'https://accounts.google.com/o/oauth2/auth?' +
      $.param({
        client_id: options.client_id,
        redirect_uri: options.redirect_uri,
        response_type: 'code',
        scope: options.scope
      });

    //Open the OAuth consent page in the InAppBrowser
    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no,clearcache=yes,clearsessioncache=yes');

    //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
    //which sets the authorization code in the browser's title. However, we can't
    //access the title of the InAppBrowser.
    //
    //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
    //authorization code will get set in the url. We can access the url in the
    //loadstart and loadstop events. So if we bind the loadstart event, we can
    //find the authorization code and close the InAppBrowser after the user
    //has granted us access to their data.
    $(authWindow).on('loadstart', function(e) {
      var url = e.originalEvent.url;
      var code = /\?code=(.+)$/.exec(url);
      var error = /\?error=(.+)$/.exec(url);

      if (code || error) {
        //Always close the browser when match is found
        authWindow.close();
      }

      if (code) {
        //Exchange the authorization code for an access token
        $.post('https://accounts.google.com/o/oauth2/token', {
          code: code[1],
          client_id: options.client_id,
          client_secret: options.client_secret,
          redirect_uri: options.redirect_uri,
          grant_type: 'authorization_code'
        })
          .done(function(data) {
            deferred.resolve(data);
          })
          .fail(function(response) {
            deferred.reject(response.responseJSON);
          });
      } else if (error) {
        //The user denied access to the app
        deferred.reject({
          error: error[1]
        });
      }
    });

    return deferred.promise();
  }
};

var googleToken;

function googleLogin() {
  var $loginButton = $('#login');
  var $loginStatus = $('#login p');

  $loginButton.on('click', function() {
    googleapi
      .authorize({
        client_id: '178286284771-p3tncl4pkul7egrussd5lbqegdefijo6.apps.googleusercontent.com',
        client_secret: 'ioYo0eafjoA2WYT1e8RQgk_E',
        //LTR
        //client_id: '1081618989384-pqpqt6lum7dngdmvl40hn3r8i39h2im9.apps.googleusercontent.com',
        //client_secret: 'HhJawWau5LQyLS3VqXGEtVhG',
        redirect_uri: 'http://localhost',
        scope: 'https://www.googleapis.com/auth/userinfo.email' //https://www.googleapis.com/auth/analytics.readonly'
      })
      .done(function(data) {
        //console.log(JSON.stringify(data));
        //$loginStatus.html('Access Token: ' + data.access_token);
        googleToken = data.access_token;
        getGoogleEmail(googleToken);
      })
      .fail(function(data) {
        $loginStatus.html(data.error);
      });
  });
}

function getGoogleEmail(googleToken) {
  var email;
  var url = 'https://www.googleapis.com/plus/v1/people/me?fields=emails&access_token=' + googleToken;
  $.ajax({
    url: url,
    type: 'GET',
    success: function(data) {
      if (data.emails) {
        //The user is authenticated
        email = data.emails[0].value;
        insertGoogleUser(email);
      }
    }
  });
}

function insertGoogleUser(email) {
  $.ajax({
    url: 'http://' + server + '/insertGoogleUser',
    type: 'POST',
    contentType: 'application/json',
    data: '{ "email":"' + email + '"}',
    error: function(data) {
      console.log(JSON.stringify(data));
    },
    success: function(data) {
      var emailHashed = Sha1.hash(email);
      var url = 'http://' + server + '/authentication';
      var JSONdata = '{"username":"' + email + '","password":"movesmart"}';
      ajaxWorker.postMessage([url, JSONdata]);
      ajaxWorker.onmessage = function(e) {
        if (e.data == 401 || e.data == 500) {
          alert('Login failure');
        } else {
          obj = JSON.parse(e.data);
          key = obj.keys.key;
          secret = obj.keys.secret;

          window.localStorage.setItem('email', email);
          window.localStorage.setItem('keyS', key);
          window.localStorage.setItem('secret', secret);
          window.localStorage.setItem('password', Sha1.hash('movesmart'));

          //fix *undefineed* issues
          var vals = [
            'name',
            'birthDate',
            'surname',
            'occupation',
            'interests',
            'music',
            'smoker',
            'imagePath',
            'trustLevel',
            'role',
            'project',
            'credits'
          ];
          for (var i in vals) {
            if (!obj.user[vals[i]]) {
              obj.user[vals[i]] = '';
            }
          }

          var vals2 = ['credits', 'project'];
          for (var i in vals2) {
            if (typeof obj.user[vals2[i]] == 'object') {
              obj.user[vals2[i]] = JSON.stringify(obj.user[vals2[i]]);
            }
          }

          window.localStorage.setItem('person.oid', obj.user['_id']['$id']);
          window.localStorage.setItem('person.firstName', obj.user.firstname);
          window.localStorage.setItem('person.birthDate', obj.user.birthDate);
          window.localStorage.setItem('person.lastName', obj.user.lastname);
          window.localStorage.setItem('person.occupation', obj.user.occupation);
          window.localStorage.setItem('person.interests', obj.user.interests);
          window.localStorage.setItem('person.music', obj.user.music);
          window.localStorage.setItem('person.smoker', obj.user.smoker);
          window.localStorage.setItem('person.imagePath', obj.user.imagePath);

          if (!obj.user.trustLevel) {
            obj.user.trustLevel = 0;
          }

          window.localStorage.setItem('person.trustLevel', obj.user.trustLevel);
          window.localStorage.setItem('person.role', 'worker');
          window.localStorage.setItem('person.project', JSON.stringify({ 0: 'movesmart' }));
          window.localStorage.setItem('person.credits', JSON.stringify({}));

          getToken();
          loadVehicles();
          location.reload();
          document.getElementById('inputEmail').value = '';
          document.getElementById('inputPassword').value = '';
        }
      };
    }
  });
}
