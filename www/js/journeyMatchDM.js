// This is a JavaScript file
onmessage = function(e) {
  var jj = e.data[2];
  var server = e.data[0];
  var token = e.data[1];
  var intervalRate = e.data[3];
  var radius = e.data[4];
  var user = e.data[5];
  var url = 'http://' + server + '/getJourneys';
  var data = { access_token: token, clientTime: Math.floor(Date.now() / 1000), object: jj, radius: radius, user: user };
  var JSONdata = JSON.stringify(data);

  function load(url, callback) {
    var xhr;

    if (typeof XMLHttpRequest !== 'undefined') {
      xhr = new XMLHttpRequest();
    } else {
      var versions = [
        'MSXML2.XmlHttp.5.0',
        'MSXML2.XmlHttp.4.0',
        'MSXML2.XmlHttp.3.0',
        'MSXML2.XmlHttp.2.0',
        'Microsoft.XmlHttp'
      ];

      for (var i = 0, len = versions.length; i < len; i++) {
        try {
          xhr = new ActiveXObject(versions[i]);
          break;
        } catch (e) {}
      } // end for
    }

    xhr.onreadystatechange = ensureReadiness;

    function ensureReadiness() {
      if (xhr.readyState < 4) {
        return;
      }

      if (xhr.status !== 200) {
        postMessage(xhr.status);
        return;
      }

      // all is well
      if (xhr.readyState === 4) {
        callback(xhr);
      }
    }

    xhr.open('POST', url, true);
    xhr.send(JSONdata);
  }

  //and here is how you use it to load a json file with ajax
  var now = Math.floor(Date.now() / 1000);
  var schedule = jj.schedule;

  if (schedule > now) {
    var interval = setInterval(function() {
      load(url, function(xhr) {
        result = xhr.responseText;
        if (result) {
          postMessage(result);
        }
        if (schedule < now) {
          clearInterval(interval);
        }
      });
    }, intervalRate);
  }
};
