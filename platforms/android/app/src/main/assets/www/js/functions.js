// This is a JavaScript file

function onSendMesage() {
    var m = JSON.parse(window.localStorage.getItem('messagesSent'));

    if (m) {
        messagesSent = m;
    }

    var from = window.localStorage.getItem('email');
    var to = user;
    var text = document.getElementById('messageInput').value;
    var read = 'false';

    var message1 = new message('', from, to, text, '', read);

    var data = {
        access_token: window.localStorage.getItem('token'),
        message: {
            from: from,
            to: to,
            text: text,
            read: read
        }
    };

    if (text != '') {
        //If message body is not empty
        sendMessage(data, function(d) {
            if (debug) {
                console.log(d);
            }

            var dd = JSON.parse(d);

            if (dd) {
                var oid = dd['oid']['$id'];
                var time = dd['time'];
                message1.setOid(oid);
                message1.setTime(time);
                messagesSent[oid] = message1;

                window.localStorage.setItem('messagesSent', JSON.stringify(messagesSent));

                ons.notification.alert({
                    message: 'Message sent!',
                    // or messageHTML: '<div>Message in HTML</div>',
                    title: 'Success',
                    buttonLabel: 'OK',
                    animation: 'default', // or 'none'
                    // modifier: 'optional-modifier'
                    callback: function() {
                        document.getElementById('messageInput').value = '';
                        loadMessageVal();
                    }
                });
            }
        });
    } else {
        ons.notification.alert({
            message: "Message body can't be empty!",
            // or messageHTML: '<div>Message in HTML</div>',
            title: 'Warning',
            buttonLabel: 'OK',
            animation: 'default', // or 'none'
            // modifier: 'optional-modifier'
            callback: function() {}
        });
    }
}

/**
 * @return - simple JSON result, eg {"result":"success","oid":"dsadada...das.dsa"} or error http code
 */
function sendMessage(data, callback) {
    var url_sendMessage = 'http://' + server + '/sendMessage';
    var JSONdata = JSON.stringify(data);
    var ajaxWorker_sendMessage = new Worker('js/ajax.js');
    ajaxWorker_sendMessage.postMessage([url_sendMessage, JSONdata]);

    ajaxWorker_sendMessage.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            callback(JSON.stringify(data));
        }

        ajaxWorker_sendMessage.terminate();
    };
}

function onGetMessages() {
    var m = JSON.parse(window.localStorage.getItem('messagesReceived'));
    var u = JSON.parse(window.localStorage.getItem('unreadMessages'));

    if (m) {
        messagesReceived = m;
    }

    if (u) {
        unreadMessages = u;
    }

    var data = {
        access_token: window.localStorage.getItem('token'),
        user: window.localStorage.getItem('email')
    };

    getMessages(data, function(d) {
        if (debug) {
            //console.log(d);
        }

        var dd = JSON.parse(d);

        if (dd) {
            var m = dd['data'];

            var count = 0;

            for (var i in m) {
                if (m.hasOwnProperty(i)) {
                    if (!messagesReceived[m[i]['_id']['$id']]) {
                        count = count + 1;

                        var oid = m[i]['_id']['$id'];
                        var from = m[i].from;
                        var to = m[i].to;
                        var text = m[i].text;
                        var time = m[i].time;
                        var read = m[i].read;

                        var message1 = new message(oid, from, to, text, time, read);
                        messagesReceived[oid] = message1;

                        unreadMessages = unreadMessages + 1;
                        document.getElementById('messageNotification').innerHTML = unreadMessages;
                    }
                }
            }

            window.localStorage.setItem('messagesReceived', JSON.stringify(messagesReceived));
            window.localStorage.setItem('unreadMessages', JSON.stringify(unreadMessages));

            if (count > 0) {
                if (myNavigator.getCurrentPage().name == 'message.html') {
                    ons.notification.alert({
                        message: 'You have ' + count + ' new message/s!',
                        // or messageHTML: '<div>Message in HTML</div>',
                        title: 'New Message',
                        buttonLabel: 'OK',
                        animation: 'default', // or 'none'
                        // modifier: 'optional-modifier'
                        callback: function() {
                            loadMessageVal();
                        }
                    });
                } else {
                    ons.notification.confirm({
                        messageHTML: '<div>You have ' + count + ' new message/s! Open inbox?</div>',
                        // or messageHTML: '<div>Message in HTML</div>',
                        title: 'New Message',
                        animation: 'default', // or 'none'
                        // modifier: 'optional-modifier'
                        primaryButtonIndex: 1,
                        buttonLabels: ['Cancel', 'Ok'],
                        cancelable: true,

                        callback: function(index) {
                            // -1: Cancel
                            // 0-: Button index from the left
                            switch (index) {
                                case 0:
                                    break;
                                case 1:
                                    app.slidingMenu.setMainPage('my_messages.html');
                                    break;
                            }
                        }
                    });
                }
            }
        }
    });
}

/**
 * @return an array of messsage if returned {"data":[{"_id":{"$id":"55b0d1ac70c64ebb23d207f0"},"from":"dmixalo@gmail.com","to":"tsoukj@iti.gr","text":"this is a test message","time":"1437662400","read":"false"}],"result":"success"}
 */
function getMessages(data, callback) {
    var url_getMessages = 'http://' + server + '/getMessages';
    var JSONdata = JSON.stringify(data);
    var ajaxWorker_getMessages = new Worker('js/ajax.js');
    ajaxWorker_getMessages.postMessage([url_getMessages, JSONdata]);

    ajaxWorker_getMessages.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            callback(JSON.stringify(data));
        }

        ajaxWorker_getMessages.terminate();
    };
}

function onGetSentMessages() {
    //var s=JSON.parse(window.localStorage.getItem("messagesSent"));

    //if(s){
    //    messagesSent=s;
    //}

    var data = {
        access_token: window.localStorage.getItem('token'),
        user: window.localStorage.getItem('email')
    };

    getSentMessages(data, function(d) {
        if (debug) {
            //console.log(d);
        }

        var dd = JSON.parse(d);

        if (dd) {
            var s = dd['data'];

            for (var i in s) {
                if (s.hasOwnProperty(i)) {
                    var oid = s[i]['_id']['$id'];
                    var from = s[i].from;
                    var to = s[i].to;
                    var text = s[i].text;
                    var time = s[i].time;
                    var read = s[i].read;

                    var message1 = new message(oid, from, to, text, time, read);
                    messagesSent[oid] = message1;
                }
            }

            window.localStorage.setItem('messagesSent', JSON.stringify(messagesSent));
            //console.log("Sent messages loaded");
        }
    });
}

/**
 * @return an array of messsage if returned {"data":[{"_id":{"$id":"55b0d1ac70c64ebb23d207f0"},"from":"dmixalo@gmail.com","to":"tsoukj@iti.gr","text":"this is a test message","time":"1437662400","read":"false"}],"result":"success"}
 */
function getSentMessages(data, callback) {
    var url_getSentMessages = 'http://' + server + '/getSentMessages';
    var JSONdata = JSON.stringify(data);
    var ajaxWorker_getSentMessages = new Worker('js/ajax.js');
    ajaxWorker_getSentMessages.postMessage([url_getSentMessages, JSONdata]);

    ajaxWorker_getSentMessages.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            callback(JSON.stringify(data));
        }

        ajaxWorker_getSentMessages.terminate();
    };
}

function loadMessagesList() {
    var mr = JSON.parse(window.localStorage.getItem('messagesReceived'));
    var ms = JSON.parse(window.localStorage.getItem('messagesSent'));
    var senders = [];

    if (mr) {
        for (var i in mr) {
            if (mr.hasOwnProperty(i)) {
                if (mr[i]) {
                    if (!(senders.indexOf(mr[i].from) > -1)) {
                        senders.push(mr[i].from);
                    }
                }
            }
        }
    }

    if (ms) {
        for (var i in ms) {
            if (ms.hasOwnProperty(i)) {
                if (ms[i]) {
                    if (!(senders.indexOf(ms[i].to) > -1)) {
                        senders.push(ms[i].to);
                    }
                }
            }
        }
    }

    for (var j in senders) {
        getUser({ email: senders[j], access_token: localStorage.getItem('token') }, function(d) {
            var unread = 0;
            var unreadHTML = '';

            var dd = JSON.parse(d);
            var driv = dd['data'][0];

            if (mr) {
                for (var k in mr) {
                    if (mr.hasOwnProperty(k)) {
                        if (mr[k]) {
                            if (mr[k].from == driv['username']) {
                                if (mr[k].read == 'false') {
                                    unread = unread + 1;
                                }
                            }
                        }
                    }
                }
            }

            if (unread > 0) {
                unreadHTML = '<span class="list-item-note"><span class="notification">new:' + unread + '</span></span>';
            }

            var list_element =
                '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;message.html&#39;, { animation : &#39;slide&#39; } ); setUser(' +
                "'" +
                driv['username'] +
                "'" +
                ')">' +
                '<ons-row>' +
                '<ons-col width="40px">' +
                '<img src="' +
                driv['imagePath'] +
                '" class="person-image">' +
                '</ons-col>' +
                '<ons-col class="person-name">' +
                driv['name'] +
                ' ' +
                driv['surname'] +
                unreadHTML +
                '<ons-col>' +
                '</ons-row>' +
                '</ons-list-item>';
            //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
            var elm = $(list_element);
            elm.appendTo($('#messages_list')); // Insert to the DOM first
            ons.compile(elm[0]); // The argument must be a HTMLElement object
        });
    }
}

function loadMessageVal() {
    var conversation = [];
    var mr = JSON.parse(window.localStorage.getItem('messagesReceived'));
    var ms = JSON.parse(window.localStorage.getItem('messagesSent'));

    unreadMessages = 0;
    document.getElementById('messageNotification').innerHTML = '';
    window.localStorage.setItem('unreadMessages', JSON.stringify(unreadMessages));

    var imagePath = window.localStorage.getItem('person.imagePath');

    if (mr) {
        for (var i in mr) {
            if (mr.hasOwnProperty(i)) {
                if (mr[i]) {
                    if (mr[i].from == user) {
                        conversation.push(mr[i]);

                        if (mr[i].read == 'false') {
                            mr[i].read = 'true';

                            var data = {
                                access_token: window.localStorage.getItem('token'),
                                collection: 'messages',
                                id: mr[i].oid,
                                object: mr[i]
                            };

                            updateCollection(data, function(results) {
                                console.log(results);
                            });
                        }
                    }
                }
            }
        }
        window.localStorage.setItem('messagesReceived', JSON.stringify(mr));
    }

    if (ms) {
        for (var i in ms) {
            if (ms.hasOwnProperty(i)) {
                if (ms[i]) {
                    if (ms[i].to == user) {
                        conversation.push(ms[i]);
                    }
                }
            }
        }
    }

    conversation.sort(function(a, b) {
        return a.time - b.time;
    });

    getUser({ email: user, access_token: window.localStorage.getItem('token') }, function(d) {
        var dd = JSON.parse(d);
        var driv = dd['data'][0];

        $('#messages').empty();
        for (var i in conversation) {
            if (conversation[i].from == user) {
                var date = new Date(conversation[i].time * 1000);

                var list_element =
                    '<ons-list-item modifier="inset" onClick="myNavigator.pushPage(&#39;other_personal_inf_message.html&#39;, { animation : &#39;slide&#39; } );">' + //onClick="myNavigator.pushPage(&#39;other_personal_inf.html&#39;, { animation : &#39;slide&#39; } );"
                    '<ons-row align="center">' +
                    '<ons-col width="60px">' +
                    '<img src="' +
                    driv['imagePath'] +
                    '" class="to-image-chat">' +
                    '</ons-col>' +
                    '<ons-col>' +
                    '<div class="chat-name">' +
                    driv['name'] +
                    ' ' +
                    driv['surname'] +
                    '</div>' +
                    '<div class="chat-text">' +
                    conversation[i].text +
                    '</div>' +
                    '<div class="chat-time">On: ' +
                    (date.getMonth() + 1) +
                    '/' +
                    date.getDate() +
                    '/' +
                    date.getFullYear() +
                    ' ' +
                    date.getHours() +
                    ':' +
                    date.getMinutes() +
                    '</div>' +
                    '</ons-col>' +
                    '</ons-row>' +
                    '</ons-list-item>';
                //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
                var elm = $(list_element);
                elm.appendTo($('#messages')); // Insert to the DOM first
                ons.compile(elm[0]); // The argument must be a HTMLElement object
            } else {
                var date = new Date(conversation[i].time * 1000);
                var readHTML = '';

                if (conversation[i].read == 'true') {
                    readHTML = '<span style="color: green; font-size: 14px;"></i> read<i class="fa fa-check"></span>';
                }

                var list_element =
                    '<ons-list-item modifier="inset" style="background-color: #E8E8E8;">' +
                    '<ons-row align="center">' +
                    '<ons-col width="60px">' +
                    '<img src="' +
                    imagePath +
                    '" class="to-image-chat">' +
                    '</ons-col>' +
                    '<ons-col>' +
                    '<div class="chat-name">You</div>' +
                    '<div class="chat-text">' +
                    conversation[i].text +
                    '</div>' +
                    '<div class="chat-time">On: ' +
                    (date.getMonth() + 1) +
                    '/' +
                    date.getDate() +
                    '/' +
                    date.getFullYear() +
                    ' ' +
                    date.getHours() +
                    ':' +
                    date.getMinutes() +
                    readHTML +
                    '</div>' +
                    '</ons-col>' +
                    '</ons-row>' +
                    '</ons-list-item>';
                //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
                var elm = $(list_element);
                elm.appendTo($('#messages')); // Insert to the DOM first
                ons.compile(elm[0]); // The argument must be a HTMLElement object
            }
        }

        setTimeout(function() {
            document.getElementById('scrollDown').click();
        }, 1500);
    });
}

/** UPDATE MESSAGE*/
/*var data3={"access_token":"5cN9dxPUT7Cy7N8caGWborL1kIW1HFuNRiW5PLZI","collection":"messages","id":"55b0d1ac70c64ebb23d207f0","object":{"from":"dmixalo@gmail.com","to":"tsoukj@iti.gr","text":"this is a test message",
"time":"1437662400","read":"false"}}

//εδώ καλείς την updateCollection σε περίπτωση που θες να κάνεις update κάποιο message
updateCollection(data3,function(results){
    console.log(results);
});*/

//================================================================================================//
function onCloseApp() {
    ons.setDefaultDeviceBackButtonListener(function() {
        ons.notification.confirm({
            message: 'Are you sure to exit the app?',
            buttonLabels: ['Cancel', 'Exit'],
            animation: 'default',
            primaryButtonIndex: 1,
            cancelable: true,

            callback: function(index) {
                // -1: Cancel
                // 0-: Button index from the left
                switch (index) {
                    case 0:
                        break;
                    case 1:
                        navigator.app.exitApp();
                        break;
                }
            }
        });
    });
}

Object.size = function(obj) {
    var size = 0,
        i,
        j;
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            for (var j in obj[i]) {
                if (obj[i].hasOwnProperty(j)) {
                    size++;
                }
            }
        }
    }
    return size;
};

function onRejected(obj) {
    var ret = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            for (var j in obj[i]) {
                if (obj[i].hasOwnProperty(j)) {
                    if (obj[i][j].rejectedPassengers) {
                        for (var k in obj[i][j].rejectedPassengers) {
                            if (obj[i][j].rejectedPassengers[k] == window.localStorage.getItem('Email Session')) {
                                // ret.push([i, j, obj[i][j]['_id']['$id']]);
                                ret.push([i, j, obj[i][j]['_id']['$id']]);
                            }
                        }
                    }
                }
            }
        }
    }

    if (ret.length > 0) {
        return ret;
    }
    return -1;
}

function onAccepted(obj) {
    var ret = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            for (var j in obj[i]) {
                if (obj[i].hasOwnProperty(j)) {
                    if (obj[i][j].acceptedPassengers) {
                        for (var k in obj[i][j].acceptedPassengers) {
                            if (obj[i][j].acceptedPassengers[k] == window.localStorage.getItem('Email Session')) {
                                ret.push([i, j, obj[i][j]['_id']['$id']]);
                            }
                        }
                    }
                }
            }
        }
    }

    if (ret.length > 0) {
        return ret;
    }
    return -1;
}

function onAccepted2(obj) {
    var j = JSON.parse(window.localStorage.getItem('journeysAccepted'));
    if (j) {
        journeysAccepted = j;
    }

    var ret = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            for (var j in obj[i]) {
                if (obj[i].hasOwnProperty(j)) {
                    if (journeysAccepted[obj[i][j]['_id']['$id']]) {
                        for (var k in journeysAccepted[obj[i][j]['_id']['$id']].acceptedPassengers) {
                            if (
                                journeysAccepted[obj[i][j]['_id']['$id']].acceptedPassengers[k] == window.localStorage.getItem('Email Session')
                            ) {
                                ret.push([i, j, obj[i][j]['_id']['$id']]);
                            }
                        }
                    }
                }
            }
        }
    }

    if (ret.length > 0) {
        return ret;
    }
    return -1;
}

function userProfileOk() {
    if (
        // window.localStorage.getItem('person.name') &&
        // window.localStorage.getItem('person.surname') &&
        // window.localStorage.getItem('person.birthDate') &&
        // window.localStorage.getItem('person.occupation') &&
        // window.localStorage.getItem('person.interests') &&
        // window.localStorage.getItem('person.music')
        window.localStorage.getItem('person')
    ) {
        return true;
    } else {
        return false;
    }
}

function userVehicleOk() {
    if (window.localStorage.getItem('vehicles')) {
        return true;
    } else {
        return false;
    }
}

function loadNewVehicleInf() {
    document.getElementById('vehicle_email').innerHTML = window.localStorage.getItem('email');
    document.getElementById('vehicle_picture').src = 'images/vehicle.png';
}

function saveJourneyInf() {
    //get the journeys from localStorage
    var j = JSON.parse(window.localStorage.getItem('journeys'));
    if (j) {
        journeys = j;
    }
    requester = window.localStorage.getItem('Email Session');
    departureAddress = homeAddress;
    departureLat = marker.getLatLng().lat;
    departureLng = marker.getLatLng().lng;
    destinationAddress = destAddress;
    destinationLat = destMarker.getLatLng().lat;
    destinationLng = destMarker.getLatLng().lng;
    schedule = schedule.getTime() / 1000;
    distance = totalDist;
    waypoints = journeyWaypoints;
    journeyDuration = totalTime;

    /*********** RECONSIDER!!!! ****************************/
    acceptedPassengers = [];
    pendingPassengers = [];
    rejectedPassengers = [];
    notes = '';
    /*********** RECONSIDER!!!! ****************************/

    ons.notification.alert({
        message: 'Journey Submited! Please wait for a match.',
        // or messageHTML: '<div>Message in HTML</div>',
        title: 'Success',
        buttonLabel: 'OK',
        animation: 'default', // or 'none'
        // modifier: 'optional-modifier'
        callback: function() {
            // Alert button is closed!
        }
    });
    //Avoid some potential errors *
    /*************Think how to handle this!!!!!!!********************************/
    if (typeof departureAddress == 'undefined') {
        departureAddress = '-';
    }

    if (typeof destinationAddress == 'undefined') {
        destinationAddress = '-';
    }

    /*Be careful, the object name and the class should not be the same*/
    var journey1 = new journey(
        requester,
        '',
        '',
        '',
        mode,
        departureAddress,
        departureLat,
        departureLng,
        destinationAddress,
        destinationLat,
        destinationLng,
        schedule,
        distance,
        journeyDuration,
        acceptedPassengers,
        pendingPassengers,
        rejectedPassengers,
        waypoints,
        '',
        notes
    );

    if (mode == 'driver') {
        var oid = guid();
        console.log(oid);

        //set it to the object
        journey1.setOid(oid);
        journey1.vehicle = journeyVehicle,
            journey1.driver = window.localStorage.getItem('Email Session'),
            journey1.seatsAvailable = seatsAvailable,
            journey1.notes = notes

        journeys[oid] = journey1;
        window.localStorage.setItem('journeys', JSON.stringify(journeys));

        console.log(journey1);

        axios.post('/CreateJourney', journey1)
            .then(function(response) {
                console.log(response.data.message)
                console.log(response.status),
                    console.log('created successfully')
            });
        //findMatchingJourney(oid);
        // startIntervalJourneyUpdates(oid);

    } else {
        mode = "passenger"
            //get a unique id
        var oid = guid();
        console.log(oid);
        //set it to the object
        journey1.setOid(oid);

        axios.post('/CreateJourney', journey1)
            .then(function(response) {
                console.log(response.data.message)
                console.log(response.status),
                    console.log('created successfully')
            });

        //and push it to locastorage as associative array
        journeys[oid] = journey1;
        window.localStorage.setItem('journeys', JSON.stringify(journeys));

        //Start interval for journey matching
        //findMatchingJourney(oid);

        //Start interval for journey updates
        // startIntervalJourneyUpdates(oid);
    }

    // if (mode == 'driver') {
    //     var data = {
    //         access_token: window.localStorage.getItem('token'),
    //         collection: 'journeys',
    //         object: {
    //             vehicle: journeyVehicle,
    //             driver: window.localStorage.getItem('email'),
    //             mode: journey1.mode,
    //             departureAddress: journey1.departureAddress,
    //             departureLat: journey1.departureLat,
    //             departureLng: journey1.departureLng,
    //             destinationAddress: journey1.destinationAddress,
    //             destinationLat: journey1.destinationLat,
    //             destinationLng: journey1.destinationLng,
    //             schedule: journey1.schedule,
    //             distance: journey1.distance,
    //             journeyDuration: journey1.journeyDuration,
    //             acceptedPassengers: journey1.acceptedPassengers,
    //             pendingPassengers: journey1.pendingPassengers,
    //             rejectedPassengers: journey1.rejectedPassengers,
    //             waypoints: journey1.waypoints,
    //             seatsAvailable: seatsAvailable,
    //             notes: notes
    //         }
    //     };
    //     //updateCollection(data);
    //     createCollection(data, function(r) {
    //         console.log(r);
    //         var rr = JSON.parse(r);
    //         //Get the oid as inserted in database
    //         var oid = rr['oid']['$id'];
    //         //Set the oid,vehicle,driver,seats to the object
    //         journey1.setOid(oid);
    //         journey1.setVehicle(journeyVehicle);
    //         journey1.setDriver(window.localStorage.getItem('email'));
    //         journey1.setSeatsAvailable(seatsAvailable);
    //         //and push it to locastorage as associative array
    //         journeys[oid] = journey1;
    //         window.localStorage.setItem('journeys', JSON.stringify(journeys));

    //         //Start interval for journey matching
    //         //findMatchingJourney(oid);

    //         //Start interval for journey updates
    //         startIntervalJourneyUpdates(oid);
    //     });
    // } else {
    //     //mode="passenger"
    //     //get a unique id
    //     var oid = guid();
    //     //set it to the object
    //     journey1.setOid(oid);
    //     //and push it to locastorage as associative array
    //     journeys[oid] = journey1;
    //     window.localStorage.setItem('journeys', JSON.stringify(journeys));

    //     //Start interval for journey matching
    //     //findMatchingJourney(oid);

    //     //Start interval for journey updates
    //     startIntervalJourneyUpdates(oid);
    // }
}


function updateJourneyInf(oid, acceptedPassengers, pendingPassengers, rejectedPassengers, notes) {
    //get the journeys from localStorage
    var journ = JSON.parse(window.localStorage.getItem('journeys'));

    if (journ) {
        var vehicle = journ[oid].vehicle;
        var driver = journ[oid].driver;
        var mode = journ[oid].mode;
        var departureAddress = journ[oid].departureAddress;
        var departureLat = journ[oid].departureLat;
        var departureLng = journ[oid].departureLng;
        var destinationAddress = journ[oid].destinationAddress;
        var destinationLat = journ[oid].destinationLat;
        var destinationLng = journ[oid].destinationLng;
        var schedule = journ[oid].schedule;
        var distance = journ[oid].distance;
        var journeyDuration = journ[oid].journeyDuration;
        var waypoints = journ[oid].waypoints;
        var seatsAvailable = journ[oid].seatsAvailable;

        var journey1 = new journey(
            oid,
            vehicle,
            driver,
            mode,
            departureAddress,
            departureLat,
            departureLng,
            destinationAddress,
            destinationLat,
            destinationLng,
            schedule,
            distance,
            journeyDuration,
            acceptedPassengers,
            pendingPassengers,
            rejectedPassengers,
            waypoints,
            seatsAvailable,
            notes
        );

        /*var data={"access_token":window.localStorage.getItem("token"),
                        "collection":"journeys",
                        "id":oid,
                        "object":journey1
                    };

            //updateCollection(data);
            updateCollection(data,function(r){
                if(debug){
                    console.log(r);
                }
            });*/

        journeys[oid] = journey1;
        window.localStorage.setItem('journeys', JSON.stringify(journeys));
    }
}

function updateAcceptedJourneyInf(oid, acceptedPassengers, pendingPassengers, rejectedPassengers, notes) {
    //get the journeys from localStorage
    var journ = JSON.parse(window.localStorage.getItem('journeysAccepted'));

    if (journ) {
        var vehicle = journ[oid].vehicle;
        var driver = journ[oid].driver;
        var mode = journ[oid].mode;
        var departureAddress = journ[oid].departureAddress;
        var departureLat = journ[oid].departureLat;
        var departureLng = journ[oid].departureLng;
        var destinationAddress = journ[oid].destinationAddress;
        var destinationLat = journ[oid].destinationLat;
        var destinationLng = journ[oid].destinationLng;
        var schedule = journ[oid].schedule;
        var distance = journ[oid].distance;
        var journeyDuration = journ[oid].journeyDuration;
        var waypoints = journ[oid].waypoints;
        var seatsAvailable = journ[oid].seatsAvailable;

        var journey1 = new journey(
            oid,
            vehicle,
            driver,
            mode,
            departureAddress,
            departureLat,
            departureLng,
            destinationAddress,
            destinationLat,
            destinationLng,
            schedule,
            distance,
            journeyDuration,
            acceptedPassengers,
            pendingPassengers,
            rejectedPassengers,
            waypoints,
            seatsAvailable,
            notes
        );

        /*var data={"access_token":window.localStorage.getItem("token"),
                        "collection":"journeys",
                        "id":oid,
                        "object":journey1
                    };

            //updateCollection(data);
            updateCollection(data,function(r){
                if(debug){
                    console.log(r);
                }
            });*/

        journeysAccepted[oid] = journey1;
        window.localStorage.setItem('journeysAccepted', JSON.stringify(journeysAccepted));
    }
}

async function loadPersonalInf() {
    //document.getElementById("userVehicle").innerHTML = window.localStorage.getItem("vehicle.brand")+" "+window.localStorage.getItem("vehicle.model");
    var EmailSession = window.localStorage.getItem("Email Session");
    console.log(EmailSession);

    // axios.get('/GetUser', {
    //         params: {
    //             Iden: EmailSession
    //         },

    //     })
    //     .then(function(response) {
    //         var Adios = response.data;
    //         console.log(Adios);
    //         console.log(response);
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //     });

    // axios.get('/GetUser' + EmailSession)
    //     .then(function(response) {
    //         var Adios = response.data;
    //         console.log(Adios);
    //         console.log(response);
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //     });
    let user = {}
    try {
        console.log({ params: { email: EmailSession } })
        res = await axios.get('/GetUser', {
            params: {
                email: EmailSession
            }
        })
        console.log(res);
        user = res.data
        console.log(user);
    } catch (e) {
        console.log(e)
    }

    document.getElementById('user_picture').src = "images/user.png";

    // document.getElementById("name").innerHTML = window.localStorage.getItem("person.name");

    document.getElementById("name").innerHTML = user.local.name;

    // document.getElementById("surname").innerHTML = window.localStorage.getItem("person.surname");

    document.getElementById("surname").innerHTML = user.local.surname;

    // document.getElementById("user_email").innerHTML = window.localStorage.getItem("email");

    document.getElementById("email4").innerHTML = user.local.email;

    // document.getElementById("birthDate").innerHTML = window.localStorage.getItem("person.birthDate");

    document.getElementById("birthDate").innerHTML = user.local.birthDate;

    // document.getElementById("occupation").innerHTML = window.localStorage.getItem("person.occupation");

    document.getElementById("occupation").innerHTML = user.local.occupation;

    // document.getElementById("interests").value = window.localStorage.getItem("person.interests");

    document.getElementById("interests").innerHTML = user.local.interests;

    // document.getElementById("music").innerHTML = window.localStorage.getItem("person.music");

    document.getElementById("music").innerHTML = user.local.music;

    // document.getElementById("smoker").innerHTML = window.localStorage.getItem("person.smoker");

    document.getElementById("smoker").innerHTML = user.local.smoker === "on" ? "Yes" : "No";


    // document.getElementById('rating').innerHTML = html;
}

function loadPendingPersonalInf() {
    //document.getElementById("userVehicle").innerHTML = window.localStorage.getItem("vehicle.brand")+" "+window.localStorage.getItem("vehicle.model");

    if (user) {
        getUser({ email: user, access_token: localStorage.getItem('token') }, function(u) {
            var uu = JSON.parse(u);
            var usr = uu['data'][0];

            document.getElementById('name3').innerHTML = usr['name'];
            document.getElementById('surname3').innerHTML = usr['surname'];
            document.getElementById('user_email3').innerHTML = usr['username'];
            document.getElementById('birthDate3').innerHTML = usr['birthDate'];
            document.getElementById('occupation3').innerHTML = usr['occupation'];
            document.getElementById('interests3').value = usr['interests'];
            document.getElementById('music3').innerHTML = usr['music'];
            document.getElementById('smoker3').innerHTML = usr['smoker'];

            if (usr['imagePath']) {
                document.getElementById('user_picture3').src = usr['imagePath'];
            } else {
                document.getElementById('user_picture3').src = 'images/user.png';
            }

            var html = '';
            var rate = usr['TrustLevel'] * 5;

            if (rate) {
                for (var i = 1; i <= 5; i++) {
                    if (i <= rate) {
                        html = html + '<ons-icon icon="fa-star" fixed-width="false" class="ons-icon fa-star fa fa-lg"></ons-icon>';
                    } else {
                        html =
                            html + '<ons-icon icon="fa-star-o" fixed-width="false" class="ons-icon fa-star-o fa fa-lg"></ons-icon>';
                    }
                }
                html = html + '&nbsp;' + rate + '/5';
            } else {
                html = 'User has no ratings yet';
            }

            document.getElementById('rating3').innerHTML = html;
        });
    }
}

function loadOthersPersonalInf() {
    //document.getElementById("userVehicle").innerHTML = window.localStorage.getItem("vehicle.brand")+" "+window.localStorage.getItem("vehicle.model");

    if (user) {
        if (user == window.localStorage.getItem('email')) {
            list_element = '<ons-button modifier="large" id="messageBtn" disabled="true">Send Message</ons-button>';

            var elm = $(list_element);
            elm.replaceAll($('#messageBtn')); // Insert to the DOM first
            ons.compile(elm[0]);
        }

        getUser({ email: user, access_token: localStorage.getItem('token') }, function(u) {
            var uu = JSON.parse(u);
            var usr = uu['data'][0];

            document.getElementById('name').innerHTML = usr['name'];
            document.getElementById('surname').innerHTML = usr['surname'];
            document.getElementById('user_email').innerHTML = usr['username'];
            document.getElementById('birthDate').innerHTML = usr['birthDate'];
            document.getElementById('occupation').innerHTML = usr['occupation'];
            document.getElementById('interests').value = usr['interests'];
            document.getElementById('music').innerHTML = usr['music'];
            document.getElementById('smoker').innerHTML = usr['smoker'];

            if (usr['imagePath']) {
                document.getElementById('user_picture').src = usr['imagePath'];
            } else {
                document.getElementById('user_picture').src = 'images/user.png';
            }

            var html = '';
            var rate = usr['TrustLevel'] * 5;

            if (rate) {
                for (var i = 1; i <= 5; i++) {
                    if (i <= rate) {
                        html = html + '<ons-icon icon="fa-star" fixed-width="false" class="ons-icon fa-star fa fa-lg"></ons-icon>';
                    } else {
                        html =
                            html + '<ons-icon icon="fa-star-o" fixed-width="false" class="ons-icon fa-star-o fa fa-lg"></ons-icon>';
                    }
                }
                html = html + '&nbsp;' + rate + '/5';
            } else {
                html = 'User has no ratings yet';
            }

            document.getElementById('rating').innerHTML = html;
        });
    }
}

function loadOtherVehicleInf() {
    //document.getElementById("userVehicle").innerHTML = window.localStorage.getItem("vehicle.brand")+" "+window.localStorage.getItem("vehicle.model");

    if (uVehicle) {
        var data = { access_token: localStorage.getItem('token'), collection: 'vehicles', id: uVehicle };

        getCollection(data, function(v) {
            var vv = JSON.parse(v);
            var vehicle = vv['data'][0];

            document.getElementById('vehicle_email').innerHTML = vehicle['owner'];
            document.getElementById('brand').innerHTML = vehicle['brand'];
            document.getElementById('model').innerHTML = vehicle['model'];
            document.getElementById('seats').innerHTML = vehicle['seats'];
            document.getElementById('color').innerHTML = vehicle['color'];
            document.getElementById('licencePlate').innerHTML = vehicle['licencePlate'];
            document.getElementById('year').innerHTML = vehicle['year'];
            document.getElementById('cc').innerHTML = vehicle['cc'];
            document.getElementById('aircondition').innerHTML = vehicle['aircondition'];
            document.getElementById('petsAllowed').innerHTML = vehicle['petsAllowed'];

            if (vehicle['imagePath']) {
                document.getElementById('vehicle_picture').src = vehicle['imagePath'];
            } else {
                document.getElementById('vehicle_picture').src = 'images/vehicle.png';
            }
        });
    }
}

function loadPersonalInfVal() {
    document.getElementById('name2').value = window.localStorage.getItem('person.name');
    document.getElementById('surname2').value = window.localStorage.getItem('person.surname');
    document.getElementById('user_email2').innerHTML = window.localStorage.getItem('email');
    document.getElementById('birthDate2').value = window.localStorage.getItem('person.birthDate');
    document.getElementById('occupation2').value = window.localStorage.getItem('person.occupation');
    document.getElementById('interests2').value = window.localStorage.getItem('person.interests');
    document.getElementById('music2').value = window.localStorage.getItem('person.music');
    //document.getElementById("smoker2").value = window.localStorage.getItem("person.smoker");

    if (window.localStorage.getItem('person.smoker') == 'Yes') {
        document.getElementById('smoker2').checked = true;
    } else {
        document.getElementById('smoker2').checked = false;
    }

    if (window.localStorage.getItem('person.imagePath')) {
        document.getElementById('user_picture2').src = window.localStorage.getItem('person.imagePath');
    } else {
        document.getElementById('user_picture2').src = 'images/user.png';
    }
}

// function loadVehiclesList() {
//     // var veh = JSON.parse(window.localStorage.getItem("vehicles"));
//     var veh = JSON.parse(window.localStorage.getItem("vehicles"));

//     console.log("Veh variable is" + veh);
//     console.log("Veh Brand is" + veh.brand);

//     if (veh) {
//         // Clear vehicles_list
//         var elm = $("#vehicles_list");
//         elm.empty();
//         ons.compile(elm[0]);

//         for (var i in veh) {
//             if (veh.hasOwnProperty(i)) {
//                 if (veh[i]) {
//                     //vehicle_picture
//                     var pic = null;
//                     if (veh[i].imagePath) {
//                         pic = veh[i].imagePath;
//                     } else {
//                         pic = "images/vehicle.png";
//                     }

//                     var brand = veh[i].brand;
//                     var model = veh[i].model;
//                     var licencePlate = veh[i].licencePlate;

//                     var list_element = '<ons-list-item modifier="chevron" class="vehicles_list" onClick="myNavigator.pushPage(&#39;vehicle_inf.html&#39;, { animation : &#39;slide&#39; } );vehicleSelected(' + "'" + i + "'" + ');">' +
//                         '<ons-row>' +
//                         '<ons-col width="95px"><img src="' + pic + '" class="thumbnail"></ons-col>' +
//                         '<ons-col><div class="brand">' + brand + '&nbsp;' + model + '</div><div class="lisence_plate">' + licencePlate + '</div></ons-col>' +
//                         '<ons-col width="40px"></ons-col>' +
//                         '</ons-row>' +
//                         '</ons-list-item>';
//                     var elm = $(list_element);
//                     elm.appendTo($("#vehicles_list")); // Insert to the DOM first
//                     ons.compile(elm[0]); // The argument must be a HTMLElement object
//                 }
//             }
//         }
//     }
// }

async function loadVehiclesList() {

    var EmailSession = window.localStorage.getItem("Email Session");
    console.log(EmailSession);

    let car = {}
    try {
        console.log({ params: { email: EmailSession } })
        res = await axios.get('/GetVehicle', {
            params: {
                email: EmailSession
            }
        })
        console.log(res);
        car = res.data
        console.log(car);
    } catch (e) {
        console.log(e)
    }

    if (car.local.brand != undefined) {
        var pic = "images/vehicle.png";
        var brand = car.local.brand;
        var model = car.local.model;
        var licencePlate = car.local.licencePlate;
        var i = 0;

        var list_element = '<ons-list-item modifier="chevron" class="vehicles_list" onClick="myNavigator.pushPage(&#39;vehicle_inf.html&#39;, { animation : &#39;slide&#39; } );vehicleSelected(' + "'" + i + "'" + ');">' +
            '<ons-row>' +
            '<ons-col width="95px"><img src="' + pic + '" class="thumbnail"></ons-col>' +
            '<ons-col><div class="brand">' + brand + '&nbsp;' + model + '</div><div class="lisence_plate">' + licencePlate + '</div></ons-col>' +
            '<ons-col width="40px"></ons-col>' +
            '</ons-row>' +
            '</ons-list-item>';
        var elm = $(list_element);
        elm.appendTo($("#vehicles_list")); // Insert to the DOM first
        ons.compile(elm[0]); // The argument must be a HTMLElement object
        //             }
        //         }
        //     }
        // }
    }
}

function loadJourneysDriver() {
    var journ = JSON.parse(window.localStorage.getItem('journeys'));

    if (journ) {
        $('#journeys_list_driver').empty();
        for (var i in journ) {
            // if (journ.hasOwnProperty(i)) {
            if (journ[i]) {
                if (journ[i].mode == 'driver') {
                    var dep = journ[i].departureAddress;
                    var dest = journ[i].destinationAddress;
                    var timestamp = journ[i].schedule;
                    var date = new Date(timestamp * 1000);
                    var seconds_left = timestamp - Math.floor(Date.now() / 1000);
                    var hours_left = parseInt(seconds_left / 3600, 10);
                    var time_left = '';
                    var notif = 0;
                    var jm = journeysMatching;
                    var notifHTML = '';
                    var drivHTML = '';
                    var passHTML = '';
                    var pendingPassHTML = '';
                    var acceptedPass = journ[i].acceptedPassengers.length;
                    var pendingPass = journ[i].pendingPassengers.length;
                    var seatsAv = journ[i].seatsAvailable;
                    var notes = journ[i].notes;
                    var driv;

                    if (journ[i].driver) {
                        driv = 1;
                        drivHTML = '<i class="fa fa-check"></i>';
                    } else {
                        driv = 0;
                        drivHTML = '<i class="fa fa-refresh fa-spin"></i>';
                    }

                    if (acceptedPass >= seatsAv) {
                        passHTML = '<i class="fa fa-check"></i>';
                    } else {
                        passHTML = '<i class="fa fa-refresh fa-spin"></i>';
                    }

                    if (jm) {
                        for (var j in jm) {
                            if (j == i) {
                                for (var k in jm[j]) {
                                    if (jm[j][k].acceptedPassengers.length < jm[j][k].seatsAvailable) {
                                        notif = notif + 1;
                                    }
                                }
                            }
                        }
                    }

                    if (notif > 0) {
                        notifHTML = '<span class="list-item-note"><span class="notification">matches:' + notif + '</span></span>';
                    }

                    if (pendingPass > 0) {
                        pendingPassHTML = '<span class="notification">pending:' + pendingPass + '</span>';
                    }

                    if (hours_left < 1) {
                        time_left = parseInt(seconds_left / 60, 10) + 'min';
                    } else if (hours_left <= 24) {
                        time_left = hours_left + 'h';
                    } else {
                        time_left = parseInt(hours_left / 24, 10) + 'd ' + (hours_left % 24) + 'h';
                    }

                    var list_element =
                        '<ons-list-item modifier="chevron" class="journey" onClick="myNavigator.pushPage(&#39;journey.html&#39;, { animation : &#39;slide&#39;} );journeySelected(' +
                        "'" +
                        i +
                        "'" +
                        ');">' +
                        '<ons-row>' +
                        '<ons-col width="80px" class="journey-left"><div class="journey-date">' +
                        (date.getMonth() + 1) +
                        '/' +
                        date.getDate() +
                        '/' +
                        date.getFullYear() +
                        '</div><div class="journey-date"><ons-icon icon="fa-clock-o"></ons-icon>' +
                        date.getHours() +
                        ':' +
                        date.getMinutes() +
                        '</div>' +
                        '<div class="journey-time_left">' +
                        time_left +
                        '</div><div class="journey-seats"><i class="fa fa-users"></i>&nbsp;' +
                        acceptedPass +
                        '/' +
                        seatsAv +
                        '&nbsp;' +
                        passHTML +
                        '</div><div class="journey-seats"><i class="fa fa-car"></i>&nbsp;' +
                        driv +
                        '/1&nbsp;' +
                        drivHTML +
                        '</div></ons-col>' +
                        '<ons-col width="6px" class="journey-center" ng-style="{backgroundColor: &#39;#3399ff&#39;}"></ons-col>' +
                        '<ons-col class="journey-right"><div class="journey-name">Journey' +
                        notifHTML +
                        '</div><div class="journey-info"><div><ons-icon icon="fa-home"></ons-icon>' +
                        dep +
                        '</div><div><ons-icon icon="fa-crosshairs"></ons-icon>' +
                        dest +
                        '</div></div>' +
                        pendingPassHTML +
                        '</ons-col>' +
                        '</ons-row>' +
                        '</ons-list-item>';
                    var elm = $(list_element);
                    elm.appendTo($('#journeys_list_driver')); // Insert to the DOM first
                    ons.compile(elm[0]); // The argument must be a HTMLElement object
                }
            }
            // }
        }
    }
}

function loadJourneysPassenger() {
    var journ = JSON.parse(window.localStorage.getItem('journeys'));
    var journAcc = JSON.parse(window.localStorage.getItem('journeysAccepted'));

    if (journ) {
        for (var i in journ) {
            // if (journ.hasOwnProperty(i)) {
            if (journ[i]) {
                if (journ[i].mode == 'passenger') {
                    var dep = journ[i].departureAddress;
                    var dest = journ[i].destinationAddress;
                    var timestamp = journ[i].schedule;
                    var date = new Date(timestamp * 1000);
                    var seconds_left = timestamp - Math.floor(Date.now() / 1000);
                    var hours_left = parseInt(seconds_left / 3600, 10);
                    var time_left = '';
                    var notif = 0;
                    var jm = journeysMatching;
                    var notifHTML = '';
                    var drivHTML = '';
                    var passHTML = '';
                    var acceptedPass = journ[i].acceptedPassengers.length;
                    var pendingPass = journ[i].pendingPassengers.length;
                    var driv;

                    if (journ[i].driver) {
                        driv = 1;
                        drivHTML = '<i class="fa fa-check"></i>';
                    } else {
                        driv = 0;
                        drivHTML = '<i class="fa fa-refresh fa-spin"></i>';
                    }

                    if (acceptedPass >= 4) {
                        passHTML = '<i class="fa fa-check"></i>';
                    } else {
                        passHTML = '<i class="fa fa-refresh fa-spin"></i>';
                    }

                    if (jm) {
                        for (var j in jm) {
                            if (j == i) {
                                for (var k in jm[j]) {
                                    if (jm[j][k].acceptedPassengers.length < jm[j][k].seatsAvailable) {
                                        notif = notif + 1;
                                    }
                                }
                            }
                        }
                    }

                    if (notif > 0) {
                        notifHTML = '<span class="list-item-note"><span class="notification">matches:' + notif + '</span></span>';
                    }

                    if (hours_left < 1) {
                        time_left = parseInt(seconds_left / 60, 10) + 'min';
                    } else if (hours_left <= 24) {
                        time_left = hours_left + 'h';
                    } else {
                        time_left = parseInt(hours_left / 24, 10) + 'd ' + (hours_left % 24) + 'h';
                    }

                    var i = 0;
                    var list_element =
                        '<ons-list-item modifier="chevron" class="journey" onClick="myNavigator.pushPage(&#39;journey.html&#39;, { animation : &#39;slide&#39; } );journeySelected(' +
                        "'" +
                        i +
                        "'" +
                        ');">' +
                        '<ons-row>' +
                        '<ons-col width="80px" class="journey-left"><div class="journey-date">' +
                        (date.getMonth() + 1) +
                        '/' +
                        date.getDate() +
                        '/' +
                        date.getFullYear() +
                        '</div><div class="journey-date"><ons-icon icon="fa-clock-o"></ons-icon>' +
                        date.getHours() +
                        ':' +
                        date.getMinutes() +
                        '</div>' +
                        '<div class="journey-time_left">' +
                        time_left +
                        '</div><div class="journey-seats"><i class="fa fa-users"></i>&nbsp;' +
                        acceptedPass +
                        '/4&nbsp;' +
                        passHTML +
                        '</div><div class="journey-seats"><i class="fa fa-car"></i>&nbsp;' +
                        driv +
                        '/1&nbsp;' +
                        drivHTML +
                        '</div></ons-col>' +
                        '<ons-col width="6px" class="journey-center" ng-style="{backgroundColor: &#39;#3399ff&#39;}"></ons-col>' +
                        '<ons-col class="journey-right"><div class="journey-name">Journey' +
                        notifHTML +
                        '</div><div class="journey-info"><div><ons-icon icon="fa-home"></ons-icon>' +
                        dep +
                        '</div><div><ons-icon icon="fa-crosshairs"></ons-icon>' +
                        dest +
                        '</div></div></ons-col>' +
                        '</ons-row>' +
                        '</ons-list-item>';
                    var elm = $(list_element);
                    elm.appendTo($('#journeys_list_passenger')); // Insert to the DOM first
                    ons.compile(elm[0]); // The argument must be a HTMLElement object
                }
                // }
            }
        }
    }

    if (journAcc) {
        for (var i in journAcc) {
            if (journAcc.hasOwnProperty(i)) {
                if (journAcc[i]) {
                    var dep = journAcc[i].departureAddress;
                    var dest = journAcc[i].destinationAddress;
                    var timestamp = journAcc[i].schedule;
                    var date = new Date(timestamp * 1000);
                    var seconds_left = timestamp - Math.floor(Date.now() / 1000);
                    var hours_left = parseInt(seconds_left / 3600, 10);
                    var time_left = '';
                    var drivHTML = '';
                    var passHTML = '';
                    var seatsAv = journAcc[i].seatsAvailable;
                    var acceptedPass = journAcc[i].acceptedPassengers.length;
                    var pendingPass = journAcc[i].pendingPassengers.length;
                    var driv;

                    if (journAcc[i].driver) {
                        driv = 1;
                        drivHTML = '<i class="fa fa-check"></i>';
                    } else {
                        driv = 0;
                        drivHTML = '<i class="fa fa-refresh fa-spin"></i>';
                    }

                    if (acceptedPass >= seatsAv) {
                        passHTML = '<i class="fa fa-check"></i>';
                    } else {
                        passHTML = '<i class="fa fa-refresh fa-spin"></i>';
                    }

                    if (hours_left < 1) {
                        time_left = parseInt(seconds_left / 60, 10) + 'min';
                    } else if (hours_left <= 24) {
                        time_left = hours_left + 'h';
                    } else {
                        time_left = parseInt(hours_left / 24, 10) + 'd ' + (hours_left % 24) + 'h';
                    }

                    var list_element =
                        '<ons-list-item modifier="chevron" class="journey" onClick="myNavigator.pushPage(&#39;journey_accepted.html&#39;, { animation : &#39;slide&#39; } );acceptedJourneySelected(' +
                        "'" +
                        i +
                        "'" +
                        ');">' +
                        '<ons-row>' +
                        '<ons-col width="80px" class="journey-left"><div class="journey-date">' +
                        (date.getMonth() + 1) +
                        '/' +
                        date.getDate() +
                        '/' +
                        date.getFullYear() +
                        '</div><div class="journey-date"><ons-icon icon="fa-clock-o"></ons-icon>' +
                        date.getHours() +
                        ':' +
                        date.getMinutes() +
                        '</div>' +
                        '<div class="journey-time_left">' +
                        time_left +
                        '</div><div class="journey-seats"><i class="fa fa-users"></i>&nbsp;' +
                        acceptedPass +
                        '/' +
                        seatsAv +
                        '&nbsp;' +
                        passHTML +
                        '</div><div class="journey-seats"><i class="fa fa-car"></i>&nbsp;' +
                        driv +
                        '/1&nbsp;' +
                        drivHTML +
                        '</div></ons-col>' +
                        '<ons-col width="6px" class="journey-center" ng-style="{backgroundColor: &#39;#ff0000&#39;}"></ons-col>' +
                        '<ons-col class="journey-right"><div class="journey-name">Journey<span class="list-item-note"><span class="notification">accepted&nbsp;<i class="fa fa-check"></i></span></span></div><div class="journey-info"><div><ons-icon icon="fa-home"></ons-icon>' +
                        dep +
                        '</div><div><ons-icon icon="fa-crosshairs"></ons-icon>' +
                        dest +
                        '</div></div></ons-col>' +
                        '</ons-row>' +
                        '</ons-list-item>';
                    var elm = $(list_element);
                    elm.appendTo($('#journeys_list_passenger')); // Insert to the DOM first
                    ons.compile(elm[0]); // The argument must be a HTMLElement object
                }
            }
        }
    }
}

function loadJourneysMatching() {
    var journ = journeysMatching;

    if (journ) {
        $('#journeys_list_matching').empty();
        for (var i in journ) {
            if (journ.hasOwnProperty(i)) {
                if (journ[i]) {
                    for (var j in journ[i]) {
                        if (journ[i].hasOwnProperty(j)) {
                            if (journ[i][j]) {
                                if (journ[i][j].acceptedPassengers.length < journ[i][j].seatsAvailable) {
                                    var dep = journ[i][j].departureAddress;
                                    var dest = journ[i][j].destinationAddress;
                                    var timestamp = journ[i][j].schedule;
                                    var date = new Date(timestamp * 1000);
                                    var seconds_left = timestamp - Math.floor(Date.now() / 1000);
                                    var hours_left = parseInt(seconds_left / 3600, 10);
                                    var time_left = '';
                                    var drivHTML = '';
                                    var passHTML = '';
                                    var seatsAv = journ[i][j].seatsAvailable;
                                    var acceptedPass = journ[i][j].acceptedPassengers.length;
                                    var pendingPass = journ[i][j].pendingPassengers.length;
                                    var driv;
                                    var notifHTML = '';

                                    var o = journ[i][j]['_id']['$id'];
                                    var p = JSON.parse(window.localStorage.getItem('journeysPending'));

                                    if (p) {
                                        journeysPending = p;
                                        if (journeysPending[o]) {
                                            notifHTML =
                                                '<span class="list-item-note"><span class="notification">pending <i class="fa fa-spinner fa-spin"></i></span></span>';
                                        }
                                    }

                                    if (journ[i][j].driver) {
                                        driv = 1;
                                        drivHTML = '<i class="fa fa-check"></i>';
                                    } else {
                                        driv = 0;
                                        drivHTML = '<i class="fa fa-refresh fa-spin"></i>';
                                    }

                                    if (acceptedPass >= seatsAv) {
                                        passHTML = '<i class="fa fa-check"></i>';
                                    } else {
                                        passHTML = '<i class="fa fa-refresh fa-spin"></i>';
                                    }

                                    if (hours_left < 1) {
                                        time_left = parseInt(seconds_left / 60, 10) + 'min';
                                    } else if (hours_left <= 24) {
                                        time_left = hours_left + 'h';
                                    } else {
                                        time_left = parseInt(hours_left / 24, 10) + 'd ' + (hours_left % 24) + 'h';
                                    }

                                    var list_element =
                                        '<ons-list-item modifier="chevron" class="journey" onClick="myNavigator.pushPage(&#39;journey_matching.html&#39;, { animation : &#39;slide&#39; } );matchingJourneySelected(' +
                                        "'" +
                                        i +
                                        "'" +
                                        ',' +
                                        "'" +
                                        j +
                                        "'" +
                                        ');">' +
                                        '<ons-row>' +
                                        '<ons-col width="80px" class="journey-left"><div class="journey-date">' +
                                        (date.getMonth() + 1) +
                                        '/' +
                                        date.getDate() +
                                        '/' +
                                        date.getFullYear() +
                                        '</div><div class="journey-date"><ons-icon icon="fa-clock-o"></ons-icon>' +
                                        date.getHours() +
                                        ':' +
                                        date.getMinutes() +
                                        '</div>' +
                                        '<div class="journey-time_left">' +
                                        time_left +
                                        '</div><div class="journey-seats"><i class="fa fa-users"></i>&nbsp;' +
                                        acceptedPass +
                                        '/' +
                                        seatsAv +
                                        '&nbsp;' +
                                        passHTML +
                                        '</div><div class="journey-seats"><i class="fa fa-car"></i>&nbsp;' +
                                        driv +
                                        '/1&nbsp;' +
                                        drivHTML +
                                        '</div></ons-col>' +
                                        '<ons-col width="6px" class="journey-center" ng-style="{backgroundColor: &#39;#ff0000&#39;}"></ons-col>' +
                                        '<ons-col class="journey-right"><div class="journey-name">Journey' +
                                        notifHTML +
                                        '</div><div class="journey-info"><div><ons-icon icon="fa-home"></ons-icon>' +
                                        dep +
                                        '</div><div><ons-icon icon="fa-crosshairs"></ons-icon>' +
                                        dest +
                                        '</div></div></ons-col>' +
                                        '</ons-row>' +
                                        '</ons-list-item>';
                                    var elm = $(list_element);
                                    elm.appendTo($('#journeys_list_matching')); // Insert to the DOM first
                                    ons.compile(elm[0]); // The argument must be a HTMLElement object
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function loadAcceptedJourneyVal() {
    var journ = JSON.parse(window.localStorage.getItem('journeysAccepted'));

    var dep2 = journ[selectedJourney].departureAddress;
    var dest2 = journ[selectedJourney].destinationAddress;
    var depLat2 = journ[selectedJourney].departureLat;
    var depLng2 = journ[selectedJourney].departureLng;
    var destLat2 = journ[selectedJourney].destinationLat;
    var destLng2 = journ[selectedJourney].destinationLng;
    var timestamp2 = journ[selectedJourney].schedule;
    var dist2 = journ[selectedJourney].distance;
    var dur2 = journ[selectedJourney].journeyDuration;
    var veh2 = journ[selectedJourney].vehicle;
    var date2 = new Date(timestamp2 * 1000);
    var seconds_left2 = timestamp2 - Math.floor(Date.now() / 1000);
    var hours_left2 = parseInt(seconds_left2 / 3600, 10);
    var time_left2 = '';
    var drivEmail2 = journ[selectedJourney].driver;
    var acceptedPass2 = journ[selectedJourney].acceptedPassengers;
    var notes2 = journ[selectedJourney].notes;

    var seatsAv2 = null;
    var drivHTML2 = '';
    var passHTML2 = '';
    var acceptedPassNo2 = journ[selectedJourney].acceptedPassengers.length;
    var pendingPassNo2 = journ[selectedJourney].pendingPassengers.length;
    var driv2;

    if (journ[selectedJourney].mode == 'driver') {
        seatsAv2 = journ[selectedJourney].seatsAvailable;
    } else {
        seatsAv2 = 4;
    }

    if (hours_left2 < 1) {
        time_left2 = parseInt(seconds_left2 / 60, 10) + 'min';
    } else if (hours_left2 <= 24) {
        time_left2 = hours_left2 + 'h';
    } else {
        time_left2 = parseInt(hours_left2 / 24, 10) + 'd ' + (hours_left2 % 24) + 'h';
    }

    if (dur2 < 3600) {
        dur2 = parseInt(dur2 / 60, 10) + 'min';
    } else {
        dur2 = parseInt(dur2 / 3600, 10) + 'h ' + parseInt(dur2 % 3600, 10) + 'm';
    }

    if (drivEmail2) {
        driv2 = 1;
        drivHTML2 = '<i class="fa fa-check"></i>';
    } else {
        driv2 = 0;
        drivHTML2 = '<i class="fa fa-refresh fa-spin"></i>';
    }

    if (acceptedPassNo2 >= seatsAv2) {
        passHTML2 = '<i class="fa fa-check"></i>';
    } else {
        passHTML2 = '<i class="fa fa-refresh fa-spin"></i>';
    }

    matching_journey_map = new L.Map('matching_journey_map', {
        minZoom: 5,
        maxZoom: 18,
        unloadInvisibleTiles: true,
        updateWhenIdle: true,
        reuseTiles: true,
        zoomControl: false
    });
    var currTileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        attributionControl: false
    });

    matching_journey_map.addLayer(currTileLayer);
    matching_journey_map.attributionControl.setPrefix('');
    //journey_map.setView([51.505, -0.09], 13);

    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

    var markerAtr = L.AwesomeMarkers.icon({
        icon: 'home',
        markerColor: 'blue'
    });

    var destMarkerAtr = L.AwesomeMarkers.icon({
        icon: 'crosshairs',
        markerColor: 'red'
    });

    matching_journey_control = L.Routing.control({
        plan: L.Routing.plan([L.latLng(depLat2, depLng2), L.latLng(destLat2, destLng2)], {
            createMarker: function(i, wp) {
                if (i == 0) {
                    return L.marker(wp.latLng, { icon: markerAtr });
                } else {
                    return L.marker(wp.latLng, { icon: destMarkerAtr });
                }
            }
        }),
        routeWhileDragging: false,
        fitSelectedRoutes: true
    }).addTo(matching_journey_map);

    document.getElementById('departureAddress').innerHTML = dep2;
    document.getElementById('destinationAddress').innerHTML = dest2;
    document.getElementById('date').innerHTML = date2.getMonth() + 1 + '/' + date2.getDate() + '/' + date2.getFullYear();
    document.getElementById('time').innerHTML = date2.getHours() + ':' + date2.getMinutes();
    document.getElementById('timeLeft').innerHTML = time_left2;
    document.getElementById('distance').innerHTML = 'Distance: ' + (dist2 / 1000).toFixed(1) + 'km';
    document.getElementById('journeyDuration').innerHTML = 'Duration: ' + dur2;
    document.getElementById('passengersNo').innerHTML = acceptedPassNo2 + '/' + seatsAv2 + '&nbsp;' + passHTML2;
    document.getElementById('driverNo').innerHTML = driv2 + '/1&nbsp;' + drivHTML2;
    document.getElementById('notes').value = notes2;

    if (drivEmail2) {
        getUser({ email: drivEmail2, access_token: localStorage.getItem('token') }, function(d) {
            var dd = JSON.parse(d);
            var driv2 = dd['data'][0];

            var list_element =
                '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;other_personal_inf.html&#39;, { animation : &#39;slide&#39; } ); setUser(' +
                "'" +
                drivEmail2 +
                "'" +
                ')">' +
                '<ons-row>' +
                '<ons-col width="40px">' +
                '<img src="' +
                driv2['imagePath'] +
                '" class="person-image">' +
                '</ons-col>' +
                '<ons-col class="person-name">' +
                driv2['name'] +
                ' ' +
                driv2['surname'] +
                '<ons-col>' +
                '</ons-row>' +
                '</ons-list-item>';
            //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
            var elm = $(list_element);
            elm.appendTo($('#journeys_list_driver')); // Insert to the DOM first
            ons.compile(elm[0]); // The argument must be a HTMLElement object

            loadOtherVehicle();
        });
    } else {
        loadOtherVehicle();
    }

    function loadOtherVehicle() {
        if (veh2) {
            var data = { access_token: localStorage.getItem('token'), collection: 'vehicles', id: veh2 };

            getCollection(data, function(v) {
                var vv = JSON.parse(v);
                var vehicle2 = vv['data'][0];

                var list_element =
                    '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;other_vehicle_inf.html&#39;, { animation : &#39;slide&#39; } ); setVehicle(' +
                    "'" +
                    veh2 +
                    "'" +
                    ')">' +
                    '<ons-row>' +
                    '<ons-col width="40px">' +
                    '<img src="' +
                    vehicle2['imagePath'] +
                    '" class="person-image">' +
                    '</ons-col>' +
                    '<ons-col class="person-name">' +
                    vehicle2['brand'] +
                    ' ' +
                    vehicle2['model'] +
                    '<ons-col>' +
                    '</ons-row>' +
                    '</ons-list-item>';
                //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
                var elm = $(list_element);
                elm.appendTo($('#journeys_list_vehicle')); // Insert to the DOM first
                ons.compile(elm[0]); // The argument must be a HTMLElement object

                loadAcceptedPassengers();
            });
        } else {
            loadAcceptedPassengers();
        }
    }

    function loadAcceptedPassengers() {
        getUser({ email: acceptedPass2, access_token: localStorage.getItem('token') }, function(p) {
            var pp = JSON.parse(p);
            var pass = pp['data'];

            for (var i in pass) {
                if (pass.hasOwnProperty(i)) {
                    if (pass[i]) {
                        var list_element =
                            '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;other_personal_inf.html&#39;, { animation : &#39;slide&#39; } ); setUser(' +
                            "'" +
                            pass[i].username +
                            "'" +
                            ')">' +
                            '<ons-row>' +
                            '<ons-col width="40px">' +
                            '<img src="' +
                            pass[i]['imagePath'] +
                            '" class="person-image">' +
                            '</ons-col>' +
                            '<ons-col class="person-name">' +
                            pass[i]['name'] +
                            ' ' +
                            pass[i]['surname'] +
                            '<ons-col>' +
                            '</ons-row>' +
                            '</ons-list-item>';
                        //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
                        var elm = $(list_element);
                        elm.appendTo($('#journeys_list_accepted')); // Insert to the DOM first
                        ons.compile(elm[0]); // The argument must be a HTMLElement object
                    }
                }
            }
        });
    }
}

function loadMatchingJourneyVal() {
    var journ = journeysMatching;

    var dep2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].departureAddress;
    var dest2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].destinationAddress;
    var depLat2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].departureLat;
    var depLng2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].departureLng;
    var destLat2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].destinationLat;
    var destLng2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].destinationLng;
    var timestamp2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].schedule;
    var dist2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].distance;
    var dur2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].journeyDuration;
    var veh2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].vehicle;
    var date2 = new Date(timestamp2 * 1000);
    var seconds_left2 = timestamp2 - Math.floor(Date.now() / 1000);
    var hours_left2 = parseInt(seconds_left2 / 3600, 10);
    var time_left2 = '';
    var drivEmail2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].driver;
    var acceptedPass2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].acceptedPassengers;
    var seatsAv2 = null;
    var drivHTML2 = '';
    var passHTML2 = '';
    var acceptedPassNo2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].acceptedPassengers.length;
    var pendingPassNo2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].pendingPassengers.length;
    var notes2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].notes;
    var driv2;

    var o = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ]['_id']['$id'];
    var j = JSON.parse(window.localStorage.getItem('journeysPending'));

    if (j) {
        journeysPending = j;
        if (journeysPending[o]) {
            list_element =
                '<ons-button modifier="large--cta" id = "joinButton" disabled="true">Request Sent. Response pending <i class="fa fa-spinner fa-spin"></i></ons-button>';

            var elm = $(list_element);
            elm.replaceAll($('#joinButton')); // Insert to the DOM first
            ons.compile(elm[0]);
        } else {
            list_element =
                '<ons-button modifier="large--cta" onClick="sendJourneyRequest()" id = "joinButton">Request Join</ons-button>';

            var elm = $(list_element);
            elm.replaceAll($('#joinButton')); // Insert to the DOM first
            ons.compile(elm[0]);
        }
    }

    if (journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].mode == 'driver') {
        seatsAv2 = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].seatsAvailable;
    } else {
        seatsAv2 = 4;
    }

    if (hours_left2 < 1) {
        time_left2 = parseInt(seconds_left2 / 60, 10) + 'min';
    } else if (hours_left2 <= 24) {
        time_left2 = hours_left2 + 'h';
    } else {
        time_left2 = parseInt(hours_left2 / 24, 10) + 'd ' + (hours_left2 % 24) + 'h';
    }

    if (dur2 < 3600) {
        dur2 = parseInt(dur2 / 60, 10) + 'min';
    } else {
        dur2 = parseInt(dur2 / 3600, 10) + 'h ' + parseInt(dur2 % 3600, 10) + 'm';
    }

    if (drivEmail2) {
        driv2 = 1;
        drivHTML2 = '<i class="fa fa-check"></i>';
    } else {
        driv2 = 0;
        drivHTML2 = '<i class="fa fa-refresh fa-spin"></i>';
    }

    if (acceptedPassNo2 >= seatsAv2) {
        passHTML2 = '<i class="fa fa-check"></i>';
    } else {
        passHTML2 = '<i class="fa fa-refresh fa-spin"></i>';
    }

    matching_journey_map = new L.Map('matching_journey_map', {
        minZoom: 5,
        maxZoom: 18,
        unloadInvisibleTiles: true,
        updateWhenIdle: true,
        reuseTiles: true,
        zoomControl: false
    });
    var currTileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        attributionControl: false
    });

    matching_journey_map.addLayer(currTileLayer);
    matching_journey_map.attributionControl.setPrefix('');
    //journey_map.setView([51.505, -0.09], 13);

    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

    var markerAtr = L.AwesomeMarkers.icon({
        icon: 'home',
        markerColor: 'blue'
    });

    var destMarkerAtr = L.AwesomeMarkers.icon({
        icon: 'crosshairs',
        markerColor: 'red'
    });

    matching_journey_control = L.Routing.control({
        plan: L.Routing.plan([L.latLng(depLat2, depLng2), L.latLng(destLat2, destLng2)], {
            createMarker: function(i, wp) {
                if (i == 0) {
                    return L.marker(wp.latLng, { icon: markerAtr });
                } else {
                    return L.marker(wp.latLng, { icon: destMarkerAtr });
                }
            }
        }),
        routeWhileDragging: false,
        fitSelectedRoutes: true
    }).addTo(matching_journey_map);

    document.getElementById('departureAddressM').innerHTML = dep2;
    document.getElementById('destinationAddressM').innerHTML = dest2;
    document.getElementById('dateM').innerHTML = date2.getMonth() + 1 + '/' + date2.getDate() + '/' + date2.getFullYear();
    document.getElementById('timeM').innerHTML = date2.getHours() + ':' + date2.getMinutes();
    document.getElementById('timeLeftM').innerHTML = time_left2;
    document.getElementById('distanceM').innerHTML = 'Distance: ' + (dist2 / 1000).toFixed(1) + 'km';
    document.getElementById('journeyDurationM').innerHTML = 'Duration: ' + dur2;
    document.getElementById('passengersNoM').innerHTML = acceptedPassNo2 + '/' + seatsAv2 + '&nbsp;' + passHTML2;
    document.getElementById('driverNoM').innerHTML = driv2 + '/1&nbsp;' + drivHTML2;
    document.getElementById('notesM').value = notes2;

    if (drivEmail2) {
        getUser({ email: drivEmail2, access_token: localStorage.getItem('token') }, function(d) {
            var dd = JSON.parse(d);
            var driv2 = dd['data'][0];

            var list_element =
                '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;other_personal_inf.html&#39;, { animation : &#39;slide&#39; } ); setUser(' +
                "'" +
                drivEmail2 +
                "'" +
                ')">' +
                '<ons-row>' +
                '<ons-col width="40px">' +
                '<img src="' +
                driv2['imagePath'] +
                '" class="person-image">' +
                '</ons-col>' +
                '<ons-col class="person-name">' +
                driv2['name'] +
                ' ' +
                driv2['surname'] +
                '<ons-col>' +
                '</ons-row>' +
                '</ons-list-item>';
            //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
            var elm = $(list_element);
            elm.appendTo($('#journeys_list_driver_m')); // Insert to the DOM first
            ons.compile(elm[0]); // The argument must be a HTMLElement object

            loadOtherVehicle();
        });
    } else {
        loadOtherVehicle();
    }

    function loadOtherVehicle() {
        if (veh2) {
            var data = { access_token: localStorage.getItem('token'), collection: 'vehicles', id: veh2 };

            getCollection(data, function(v) {
                var vv = JSON.parse(v);
                var vehicle2 = vv['data'][0];

                var list_element =
                    '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;other_vehicle_inf.html&#39;, { animation : &#39;slide&#39; } ); setVehicle(' +
                    "'" +
                    veh2 +
                    "'" +
                    ')">' +
                    '<ons-row>' +
                    '<ons-col width="40px">' +
                    '<img src="' +
                    vehicle2['imagePath'] +
                    '" class="person-image">' +
                    '</ons-col>' +
                    '<ons-col class="person-name">' +
                    vehicle2['brand'] +
                    ' ' +
                    vehicle2['model'] +
                    '<ons-col>' +
                    '</ons-row>' +
                    '</ons-list-item>';
                //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
                var elm = $(list_element);
                elm.appendTo($('#journeys_list_vehicle_m')); // Insert to the DOM first
                ons.compile(elm[0]); // The argument must be a HTMLElement object

                loadAcceptedPassengers();
            });
        } else {
            loadAcceptedPassengers();
        }
    }

    function loadAcceptedPassengers() {
        if (acceptedPass2) {
            getUser({ email: acceptedPass2, access_token: localStorage.getItem('token') }, function(p) {
                var pp = JSON.parse(p);
                var pass = pp['data'];

                for (var i in pass) {
                    if (pass.hasOwnProperty(i)) {
                        if (pass[i]) {
                            var list_element =
                                '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;other_personal_inf.html&#39;, { animation : &#39;slide&#39; } ); setUser(' +
                                "'" +
                                pass[i].username +
                                "'" +
                                ')">' +
                                '<ons-row>' +
                                '<ons-col width="40px">' +
                                '<img src="' +
                                pass[i]['imagePath'] +
                                '" class="person-image">' +
                                '</ons-col>' +
                                '<ons-col class="person-name">' +
                                pass[i]['name'] +
                                ' ' +
                                pass[i]['surname'] +
                                '<ons-col>' +
                                '</ons-row>' +
                                '</ons-list-item>';
                            //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
                            var elm = $(list_element);
                            elm.appendTo($('#journeys_list_accepted_m')); // Insert to the DOM first
                            ons.compile(elm[0]); // The argument must be a HTMLElement object
                        }
                    }
                }
            });
        }
    }
}

function checkIfAccepted(obj, key, i) {
    var a = JSON.parse(window.localStorage.getItem('journeysAccepted'));

    if (a) {
        journeysAccepted = a;
    }

    if (!journeysAccepted[key]) {
        var driv = obj.driver;

        getUser({ email: driv, access_token: localStorage.getItem('token') }, function(d) {
            var dd = JSON.parse(d);
            var dr = dd['data'][0];

            var vehicle = obj.vehicle;
            var driver = driv;
            var mode = 'passenger';
            var departureAddress = obj.departureAddress;
            var departureLat = obj.departureLat;
            var departureLng = obj.departureLng;
            var destinationAddress = obj.destinationAddress;
            var destinationLat = obj.destinationLat;
            var destinationLng = obj.destinationLng;
            var schedule = obj.schedule;
            var distance = obj.distance;
            var journeyDuration = obj.journeyDuration;
            var acceptedPassengers = obj.acceptedPassengers;
            var pendingPassengers = obj.pendingPassengers;
            var rejectedPassengers = obj.rejectedPassengers;
            var waypoints = obj.waypoints;
            var seatsAvailable = obj.seatsAvailable;
            var notes = obj.notes;

            var journey1 = new journey(
                key,
                vehicle,
                driver,
                mode,
                departureAddress,
                departureLat,
                departureLng,
                destinationAddress,
                destinationLat,
                destinationLng,
                schedule,
                distance,
                journeyDuration,
                acceptedPassengers,
                pendingPassengers,
                rejectedPassengers,
                waypoints,
                seatsAvailable,
                notes
            );

            /*var data={"access_token":window.localStorage.getItem("token"),
                              "collection":"journeys",
                              "id":i,
                              "object":journey1
                          };

                  //updateCollection(data);
                  updateCollection(data,function(r){
                      if(debug){
                          console.log(r);
                      }
                  });*/
            //journeys[i]=null;
            var p = JSON.parse(window.localStorage.getItem('journeysPending'));

            if (p) {
                journeysPending = p;
            }
            delete journeysPending[key];
            if (debug) {
                console.log('pending journey:' + key + ' has been deleted');
            }
            window.localStorage.setItem('journeysPending', JSON.stringify(journeysPending));

            journeysAccepted[key] = journey1;
            window.localStorage.setItem('journeysAccepted', JSON.stringify(journeysAccepted));

            delete journeysMatching[i];
            if (debug) {
                console.log('matching journey:' + i + ' has been deleted');
            }

            //================================================================================//
            //journeys[o]=journey1;

            var j = JSON.parse(window.localStorage.getItem('journeys'));

            if (j) {
                journeys = j;
            }

            if (journeys[i].mode == 'driver') {
                var data = {
                    access_token: localStorage.getItem('token'),
                    id: i,
                    collection: 'journeys'
                };
                deleteCollection(data, function(d) {
                    console.log(d);
                });
            }

            delete journeys[i];
            if (debug) {
                console.log('journey:' + i + ' has been deleted');
            }
            window.localStorage.setItem('journeys', JSON.stringify(journeys));

            startIntervalAcceptedJourneyUpdates(key);
            //================================================================================//

            ons.notification.confirm({
                messageHTML: '<ons-list-item class="person" modifier="inset">' +
                    '<ons-row>' +
                    '<ons-col width="40px">' +
                    '<img src="' +
                    dr['imagePath'] +
                    '" class="person-image">' +
                    '</ons-col>' +
                    '<ons-col class="person-name">' +
                    dr['name'] +
                    ' ' +
                    dr['surname'] +
                    '<ons-col>' +
                    '</ons-row>' +
                    '</ons-list-item>',
                // or messageHTML: '<div>Message in HTML</div>',
                title: 'Driver Accepted You!',
                buttonLabels: ['Not now', 'View Journey'],
                animation: 'default', // or 'none'
                // modifier: 'optional-modifier'
                callback: function(index) {
                    // Alert button is closed!
                    switch (index) {
                        case 0:
                            break;
                        case 1:
                            myNavigator.pushPage('journey_accepted.html', { animation: 'slide' });
                            acceptedJourneySelected(key);
                            break;
                    }
                }
            });
        });
    }
}

function checkIfRejected(obj, key) {
    var p = JSON.parse(window.localStorage.getItem('journeysPending'));

    if (p) {
        journeysPending = p;
    }

    if (journeysPending[key]) {
        var driv = obj.driver;

        getUser({ email: driv, access_token: localStorage.getItem('token') }, function(d) {
            var dd = JSON.parse(d);
            var dr = dd['data'][0];

            delete journeysPending[key];
            if (debug) {
                console.log('pending journey:' + key + ' has been deleted');
            }
            window.localStorage.setItem('journeysPending', JSON.stringify(journeysPending));

            ons.notification.alert({
                messageHTML: '<ons-list-item class="inset" modifier="inset">' +
                    '<ons-row>' +
                    '<ons-col width="40px">' +
                    '<img src="' +
                    dr['imagePath'] +
                    '" class="person-image">' +
                    '</ons-col>' +
                    '<ons-col class="person-name">' +
                    dr['name'] +
                    ' ' +
                    dr['surname'] +
                    '<ons-col>' +
                    '</ons-row>' +
                    '</ons-list-item>',
                // or messageHTML: '<div>Message in HTML</div>',
                title: 'Driver Rejected You!',
                buttonLabel: 'OK',
                animation: 'default', // or 'none'
                // modifier: 'optional-modifier'
                callback: function() {
                    // Alert button is closed!
                }
            });
        });
    }
}

function clearAllJourneys() {
    window.localStorage.removeItem('journeys');
    window.localStorage.removeItem('journeysAccepted');
    window.localStorage.removeItem('journeysPending');
}

function startIntervalForCheckIfAccepted() {
    setInterval(function() {
        checkIfAccepted();
    }, checkIfAcceptedInterval);
}

function startIntervalForCheckIfRejected() {
    setInterval(function() {
        checkIfRejected();
    }, checkIfRejectedInterval);
}

function reloadMatchingJourneyVal() {
    var journ = journeysMatching;

    if (journ) {
        $('#journeys_list_matching').empty();
        var list_element2 = '<ons-list-header class="person-list-header">Journeys Matching</ons-list-header>';
        var elm = $(list_element2);
        elm.appendTo($('#journeys_list_matching')); // Insert to the DOM first
        ons.compile(elm[0]);

        for (var i in journ) {
            if (i == selectedJourney) {
                if (journ.hasOwnProperty(i)) {
                    if (journ[i]) {
                        for (var j in journ[i]) {
                            if (journ[i].hasOwnProperty(j)) {
                                if (journ[i][j]) {
                                    if (journ[i][j].acceptedPassengers.length < journ[i][j].seatsAvailable) {
                                        var dep2 = journ[i][j].departureAddress;
                                        var dest2 = journ[i][j].destinationAddress;
                                        var timestamp2 = journ[i][j].schedule;
                                        var date2 = new Date(timestamp2 * 1000);
                                        var seconds_left2 = timestamp2 - Math.floor(Date.now() / 1000);
                                        var hours_left2 = parseInt(seconds_left2 / 3600, 10);
                                        var time_left2 = '';
                                        var drivHTML2 = '';
                                        var passHTML2 = '';
                                        var seatsAv2 = journ[i][j].seatsAvailable;
                                        var acceptedPassNo2 = journ[i][j].acceptedPassengers.length;
                                        var pendingPassNo2 = journ[i][j].pendingPassengers.length;
                                        var driv2;
                                        var notifHTML = '';

                                        var o = journ[i][j]['_id']['$id'];
                                        var p = JSON.parse(window.localStorage.getItem('journeysPending'));

                                        if (p) {
                                            journeysPending = p;
                                            if (journeysPending[o]) {
                                                notifHTML =
                                                    '<span class="list-item-note"><span class="notification">pending <i class="fa fa-spinner fa-spin"></i></span></span>';
                                            }
                                        }

                                        if (journ[i][j].driver) {
                                            driv2 = 1;
                                            drivHTML2 = '<i class="fa fa-check"></i>';
                                        } else {
                                            driv2 = 0;
                                            drivHTML2 = '<i class="fa fa-refresh fa-spin"></i>';
                                        }

                                        if (acceptedPassNo2 >= seatsAv2) {
                                            passHTML2 = '<i class="fa fa-check"></i>';
                                        } else {
                                            passHTML2 = '<i class="fa fa-refresh fa-spin"></i>';
                                        }

                                        if (hours_left2 < 1) {
                                            time_left2 = parseInt(seconds_left2 / 60, 10) + 'min';
                                        } else if (hours_left2 <= 24) {
                                            time_left2 = hours_left2 + 'h';
                                        } else {
                                            time_left2 = parseInt(hours_left2 / 24, 10) + 'd ' + (hours_left2 % 24) + 'h';
                                        }

                                        var list_element2 =
                                            '<ons-list-item modifier="chevron" class="journey" onClick="myNavigator.pushPage(&#39;journey_matching.html&#39;, { animation : &#39;slide&#39; } );matchingJourneySelected(' +
                                            "'" +
                                            i +
                                            "'" +
                                            ',' +
                                            "'" +
                                            j +
                                            "'" +
                                            ');">' +
                                            '<ons-row>' +
                                            '<ons-col width="80px" class="journey-left"><div class="journey-date">' +
                                            (date2.getMonth() + 1) +
                                            '/' +
                                            date2.getDate() +
                                            '/' +
                                            date2.getFullYear() +
                                            '</div><div class="journey-date"><ons-icon icon="fa-clock-o"></ons-icon>' +
                                            date2.getHours() +
                                            ':' +
                                            date2.getMinutes() +
                                            '</div>' +
                                            '<div class="journey-time_left">' +
                                            time_left2 +
                                            '</div><div class="journey-seats"><i class="fa fa-users"></i>&nbsp;' +
                                            acceptedPassNo2 +
                                            '/' +
                                            seatsAv2 +
                                            '&nbsp;' +
                                            passHTML2 +
                                            '</div><div class="journey-seats"><i class="fa fa-car"></i>&nbsp;' +
                                            driv2 +
                                            '/1&nbsp;' +
                                            drivHTML2 +
                                            '</div></ons-col>' +
                                            '<ons-col width="6px" class="journey-center" ng-style="{backgroundColor: &#39;#ff0000&#39;}"></ons-col>' +
                                            '<ons-col class="journey-right"><div class="journey-name">Journey' +
                                            notifHTML +
                                            '</div><div class="journey-info"><div><ons-icon icon="fa-home"></ons-icon>&nbsp' +
                                            dep2 +
                                            '</div><div><ons-icon icon="fa-crosshairs"></ons-icon>&nbsp' +
                                            dest2 +
                                            '</div></div></ons-col>' +
                                            '</ons-row>' +
                                            '</ons-list-item>';
                                        var elm = $(list_element2);
                                        elm.appendTo($('#journeys_list_matching')); // Insert to the DOM first
                                        ons.compile(elm[0]); // The argument must be a HTMLElement object
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

async function loadJourneyVal() {
    // var journ = JSON.parse(window.localStorage.getItem('journeys'));

    var EmailSession = window.localStorage.getItem("Email Session");
    let journ_load = {}
    try {
        console.log({ params: { email: EmailSession } })
        res = await axios.get('/GetJourney', {
            params: {
                email: EmailSession
            }
        })
        console.log(res);
        journ_load = res.data
        console.log(journ_load);
    } catch (e) {
        console.log(e)
    }

    // console.log("Selected journey departureAddress is:" + journ_load.local.departureAddress);

    // var dep = journ[selectedJourney].departureAddress;
    // var depLat = journ[selectedJourney].departureLat;
    // var depLng = journ[selectedJourney].departureLng;
    // var dest = journ[selectedJourney].destinationAddress;
    // var destLat = journ[selectedJourney].destinationLat;
    // var destLng = journ[selectedJourney].destinationLng;
    // var dist = journ[selectedJourney].distance;
    // var dur = journ[selectedJourney].journeyDuration;
    // var timestamp = journ[selectedJourney].schedule;
    // var veh = journ[selectedJourney].vehicle;

    var dep = journ_load.local.departureAddress;
    var depLat = journ_load.local.departureLat;
    var depLng = journ_load.local.departureLng;
    var dest = journ_load.local.destinationAddress;
    var destLat = journ_load.local.destinationLat;
    var destLng = journ_load.local.destinationLng;
    var dist = journ_load.local.distance;
    var dur = journ_load.local.journeyDuration;
    var timestamp = journ_load.local.schedule;
    var veh = journ_load.local.vehicle;
    var date = new Date(timestamp * 1000);
    var seconds_left = timestamp - Math.floor(Date.now() / 1000);
    var hours_left = parseInt(seconds_left / 3600, 10);
    var time_left = '';
    var drivEmail = journ_load.local.driver;
    var seatsAv = null;
    var acceptedPass = journ_load.local.acceptedPassengers;
    var pendingPass = journ_load.local.pendingPassengers;
    var notes = journ_load.local.notes;

    var drivHTML = '';
    var passHTML = '';
    var acceptedPassNo = journ_load.local.acceptedPassengers.length;
    var pendingPassNo = journ_load.local.pendingPassengers.length;
    var driv;

    if (journ_load.local.mode == 'driver') {
        seatsAv = journ_load.local.seatsAvailable;
        document.getElementById('notes').value = notes;
    } else {
        seatsAv = 4;
        document.getElementById('notes').value = 'Only the driver can add notes';
        document.getElementById('notes').readOnly = true;
        document.getElementById('SaveBtn').style.display = 'none';
    }

    if (drivEmail) {
        driv = 1;
        drivHTML = '<i class="fa fa-check"></i>';
    } else {
        driv = 0;
        drivHTML = '<i class="fa fa-refresh fa-spin"></i>';
    }

    if (acceptedPassNo >= seatsAv) {
        passHTML = '<i class="fa fa-check"></i>';
    } else {
        passHTML = '<i class="fa fa-refresh fa-spin"></i>';
    }

    if (hours_left < 1) {
        time_left = parseInt(seconds_left / 60, 10) + 'min';
    } else if (hours_left <= 24) {
        time_left = hours_left + 'h';
    } else {
        time_left = parseInt(hours_left / 24, 10) + 'd ' + (hours_left % 24) + 'h';
    }

    if (dur < 3600) {
        dur = parseInt(dur / 60, 10) + 'min';
    } else {
        dur = parseInt(dur / 3600, 10) + 'h ' + parseInt(dur % 3600, 10) + 'm';
    }

    if (journey_map) {
        journey_map.remove();
    }

    journey_map = new L.Map('journey_map', {
        minZoom: 5,
        maxZoom: 18,
        unloadInvisibleTiles: true,
        updateWhenIdle: true,
        reuseTiles: true,
        zoomControl: false
    });
    var currTileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        attributionControl: false
    });

    journey_map.addLayer(currTileLayer);
    journey_map.attributionControl.setPrefix('');
    //journey_map.setView([51.505, -0.09], 13);

    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

    var markerAtr = L.AwesomeMarkers.icon({
        icon: 'home',
        markerColor: 'blue'
    });

    var destMarkerAtr = L.AwesomeMarkers.icon({
        icon: 'crosshairs',
        markerColor: 'red'
    });

    journey_control = L.Routing.control({
        plan: L.Routing.plan([L.latLng(depLat, depLng), L.latLng(destLat, destLng)], {
            createMarker: function(i, wp) {
                if (i == 0) {
                    return L.marker(wp.latLng, { icon: markerAtr });
                } else {
                    return L.marker(wp.latLng, { icon: destMarkerAtr });
                }
            }
        }),
        routeWhileDragging: false,
        fitSelectedRoutes: true
    }).addTo(journey_map);

    var journ = journeysMatching;

    if (journ) {
        $('#journeys_list_matching').empty();
        var list_element2 = '<ons-list-header class="person-list-header">Journeys Matching</ons-list-header>';
        var elm = $(list_element2);
        elm.appendTo($('#journeys_list_matching')); // Insert to the DOM first
        ons.compile(elm[0]);

        for (var i in journ) {
            if (i == selectedJourney) {
                if (journ.hasOwnProperty(i)) {
                    if (journ[i]) {
                        for (var j in journ[i]) {
                            if (journ[i].hasOwnProperty(j)) {
                                if (journ[i][j]) {
                                    if (journ[i][j].acceptedPassengers.length < journ[i][j].seatsAvailable) {
                                        var dep2 = journ[i][j].departureAddress;
                                        var dest2 = journ[i][j].destinationAddress;
                                        var timestamp2 = journ[i][j].schedule;
                                        var date2 = new Date(timestamp2 * 1000);
                                        var seconds_left2 = timestamp2 - Math.floor(Date.now() / 1000);
                                        var hours_left2 = parseInt(seconds_left2 / 3600, 10);
                                        var time_left2 = '';
                                        var drivHTML2 = '';
                                        var passHTML2 = '';
                                        var seatsAv2 = journ[i][j].seatsAvailable;
                                        var acceptedPassNo2 = journ[i][j].acceptedPassengers.length;
                                        var pendingPassNo2 = journ[i][j].pendingPassengers.length;
                                        var driv2;
                                        var notifHTML = '';

                                        var o = journ[i][j]['_id']['$id'];
                                        var p = JSON.parse(window.localStorage.getItem('journeysPending'));

                                        if (p) {
                                            journeysPending = p;
                                            if (journeysPending[o]) {
                                                notifHTML =
                                                    '<span class="list-item-note"><span class="notification">pending <i class="fa fa-spinner fa-spin"></i></span></span>';
                                            }
                                        }

                                        if (journ[i][j].driver) {
                                            driv2 = 1;
                                            drivHTML2 = '<i class="fa fa-check"></i>';
                                        } else {
                                            driv2 = 0;
                                            drivHTML2 = '<i class="fa fa-refresh fa-spin"></i>';
                                        }

                                        if (acceptedPassNo2 >= seatsAv2) {
                                            passHTML2 = '<i class="fa fa-check"></i>';
                                        } else {
                                            passHTML2 = '<i class="fa fa-refresh fa-spin"></i>';
                                        }

                                        if (hours_left2 < 1) {
                                            time_left2 = parseInt(seconds_left2 / 60, 10) + 'min';
                                        } else if (hours_left2 <= 24) {
                                            time_left2 = hours_left2 + 'h';
                                        } else {
                                            time_left2 = parseInt(hours_left2 / 24, 10) + 'd ' + (hours_left2 % 24) + 'h';
                                        }

                                        var list_element2 =
                                            '<ons-list-item modifier="chevron" class="journey" onClick="myNavigator.pushPage(&#39;journey_matching.html&#39;, { animation : &#39;slide&#39; } );matchingJourneySelected(' +
                                            "'" +
                                            i +
                                            "'" +
                                            ',' +
                                            "'" +
                                            j +
                                            "'" +
                                            ');">' +
                                            '<ons-row>' +
                                            '<ons-col width="80px" class="journey-left"><div class="journey-date">' +
                                            (date2.getMonth() + 1) +
                                            '/' +
                                            date2.getDate() +
                                            '/' +
                                            date2.getFullYear() +
                                            '</div><div class="journey-date"><ons-icon icon="fa-clock-o"></ons-icon>' +
                                            date2.getHours() +
                                            ':' +
                                            date2.getMinutes() +
                                            '</div>' +
                                            '<div class="journey-time_left">' +
                                            time_left2 +
                                            '</div><div class="journey-seats"><i class="fa fa-users"></i>&nbsp;' +
                                            acceptedPassNo2 +
                                            '/' +
                                            seatsAv2 +
                                            '&nbsp;' +
                                            passHTML2 +
                                            '</div><div class="journey-seats"><i class="fa fa-car"></i>&nbsp;' +
                                            driv2 +
                                            '/1&nbsp;' +
                                            drivHTML2 +
                                            '</div></ons-col>' +
                                            '<ons-col width="6px" class="journey-center" ng-style="{backgroundColor: &#39;#ff0000&#39;}"></ons-col>' +
                                            '<ons-col class="journey-right"><div class="journey-name">Journey' +
                                            notifHTML +
                                            '</div><div class="journey-info"><div><ons-icon icon="fa-home"></ons-icon>&nbsp' +
                                            dep2 +
                                            '</div><div><ons-icon icon="fa-crosshairs"></ons-icon>&nbsp' +
                                            dest2 +
                                            '</div></div></ons-col>' +
                                            '</ons-row>' +
                                            '</ons-list-item>';
                                        var elm = $(list_element2);
                                        elm.appendTo($('#journeys_list_matching')); // Insert to the DOM first
                                        ons.compile(elm[0]); // The argument must be a HTMLElement object
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    document.getElementById('departureAddress').innerHTML = dep;
    document.getElementById('destinationAddress').innerHTML = dest;
    document.getElementById('date').innerHTML = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    document.getElementById('time').innerHTML = date.getHours() + ':' + date.getMinutes();
    document.getElementById('timeLeft').innerHTML = time_left;
    document.getElementById('passengersNo').innerHTML = acceptedPassNo + '/' + seatsAv + '&nbsp;' + passHTML;
    document.getElementById('driverNo').innerHTML = driv + '/1&nbsp;' + drivHTML;
    document.getElementById('distance').innerHTML = 'Distance: ' + (dist / 1000).toFixed(1) + 'km';
    document.getElementById('journeyDuration').innerHTML = 'Duration: ' + dur;

    $('#driver_list').empty();
    var list_element2 = '<ons-list-header class="person-list-header">Driver</ons-list-header>';
    var elm = $(list_element2);
    elm.appendTo($('#driver_list')); // Insert to the DOM first
    ons.compile(elm[0]);

    if (drivEmail) {

        // var EmailSession = window.localStorage.getItem("Email Session");
        let driv = {}
        try {
            console.log({ params: { email: EmailSession } })
            res = await axios.get('/GetUser', {
                    params: {
                        email: EmailSession
                    }
                })
                // console.log(res);
            driv = res.data
            console.log("driv is" + driv);
        } catch (e) {
            console.log(e)
        }

        // getUser({ email: drivEmail, access_token: localStorage.getItem('token') }, function(d) {
        // var dd = JSON.parse(d);
        // var driv = dd['data'][0];
        // var driv = user.local.driver;
        console.log(driv.local.name);
        console.log(drivEmail);


        var list_element =
            '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;other_personal_inf.html&#39;, { animation : &#39;slide&#39; } ); setUser(' +
            "'" +
            drivEmail +
            "'" +
            ')">' +
            '<ons-row>' +
            //    '<ons-col width="40px">' +
            //     '<img src= images/user.png"' +
            //     // driv['imagePath'] +
            //     '"class="person-image">' +
            //     '</ons-col>'  +
            '<ons-col class="person-name">' +
            driv['local.name'] +
            ' ' +
            driv['local.surname'] +
            '<ons-col>' +
            '</ons-row>' +
            '</ons-list-item>';
        //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
        var elm = $(list_element);
        elm.appendTo($('#driver_list')); // Insert to the DOM first
        ons.compile(elm[0]); // The argument must be a HTMLElement object

        loadOtherVehicle();
        // });
    } else {
        var list_element =
            '<ons-list-item class="person" modifier="chevron">' +
            '<ons-row>' +
            '<ons-col width="40px">' +
            '<img src="images/user.png" class="person-image">' +
            '</ons-col>' +
            '<ons-col class="person-name">Pending' +
            '<ons-col>' +
            '</ons-row>' +
            '</ons-list-item>';
        //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
        var elm = $(list_element);
        elm.appendTo($('#driver_list')); // Insert to the DOM first
        ons.compile(elm[0]); // The argument must be a HTMLElement object

        loadOtherVehicle();
    }

    async function loadOtherVehicle() {
        $('#journeys_list_vehicle').empty();
        var list_element2 = '<ons-list-header class="person-list-header">Vehicle</ons-list-header>';
        var elm = $(list_element2);
        elm.appendTo($('#journeys_list_vehicle')); // Insert to the DOM first
        ons.compile(elm[0]);

        if (veh) {
            // var data = { access_token: localStorage.getItem('token'), collection: 'vehicles', id: veh };

            // getCollection(data, function(v) {
            //     var vv = JSON.parse(v);
            //     var vehicle = vv['data'][0];

            let vehicle = {}
            try {
                console.log({ params: { email: EmailSession } })
                res = await axios.get('/GetVehicle', {
                        params: {
                            email: EmailSession
                        }
                    })
                    // console.log(res);
                vehicle = res.data
                    // console.log(user);
            } catch (e) {
                console.log(e)
            }
            // var vehicle = vv['data'][0];

            var list_element =
                '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;other_vehicle_inf.html&#39;, { animation : &#39;slide&#39; } ); setVehicle(' +
                "'" +
                veh +
                "'" +
                ')">' +
                '<ons-row>' +
                '<ons-col width="40px">' +
                '<img src="' +
                vehicle['imagePath'] +
                '" class="person-image">' +
                '</ons-col>' +
                '<ons-col class="person-name">' +
                vehicle['brand'] +
                ' ' +
                vehicle['model'] +
                '<ons-col>' +
                '</ons-row>' +
                '</ons-list-item>';
            //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
            var elm = $(list_element);
            elm.appendTo($('#journeys_list_vehicle')); // Insert to the DOM first
            ons.compile(elm[0]); // The argument must be a HTMLElement object

            loadAcceptedPassengers();
            // });
        } else {
            var list_element =
                '<ons-list-item class="person" modifier="chevron">' +
                '<ons-row>' +
                '<ons-col width="40px">' +
                '<img src="images/vehicle.png" class="person-image">' +
                '</ons-col>' +
                '<ons-col class="person-name">Pending' +
                '<ons-col>' +
                '</ons-row>' +
                '</ons-list-item>';
            //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
            var elm = $(list_element);
            elm.appendTo($('#journeys_list_vehicle')); // Insert to the DOM first
            ons.compile(elm[0]); // The argument must be a HTMLElement object

            loadAcceptedPassengers();
        }
    }

    function loadAcceptedPassengers() {
        if (acceptedPass) {
            $('#journeys_list_accepted').empty();
            var list_element2 = '<ons-list-header class="person-list-header">Accepted Passengers</ons-list-header>';
            var elm = $(list_element2);
            elm.appendTo($('#journeys_list_accepted')); // Insert to the DOM first
            ons.compile(elm[0]);

            getUser({ email: acceptedPass, access_token: localStorage.getItem('token') }, function(p) {
                var pp = JSON.parse(p);
                var pass = pp['data'];

                for (var i in pass) {
                    if (pass.hasOwnProperty(i)) {
                        if (pass[i]) {
                            var list_element =
                                '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;other_personal_inf.html&#39;, { animation : &#39;slide&#39; } ); setUser(' +
                                "'" +
                                pass[i].username +
                                "'" +
                                ')">' +
                                '<ons-row>' +
                                '<ons-col width="40px">' +
                                '<img src="' +
                                pass[i]['imagePath'] +
                                '" class="person-image">' +
                                '</ons-col>' +
                                '<ons-col class="person-name">' +
                                pass[i]['name'] +
                                ' ' +
                                pass[i]['surname'] +
                                '<ons-col>' +
                                '</ons-row>' +
                                '</ons-list-item>';
                            //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
                            var elm = $(list_element);
                            elm.appendTo($('#journeys_list_accepted')); // Insert to the DOM first
                            ons.compile(elm[0]); // The argument must be a HTMLElement object
                        }
                    }
                }

                if (acceptedPassNo < seatsAv) {
                    loadPendingPassengers();
                }
            });
        } else {
            if (acceptedPassNo < seatsAv) {
                loadPendingPassengers();
            }
        }
    }

    function loadPendingPassengers() {
        $('#journeys_list_pending').empty();
        var list_element2 = '<ons-list-header class="person-list-header">Pending Passengers</ons-list-header>';
        var elm = $(list_element2);
        elm.appendTo($('#journeys_list_pending')); // Insert to the DOM first
        ons.compile(elm[0]);

        getUser({ email: pendingPass, access_token: localStorage.getItem('token') }, function(p) {
            var pp = JSON.parse(p);
            var pass = pp['data'];

            for (var i in pass) {
                if (pass.hasOwnProperty(i)) {
                    if (pass[i]) {
                        var list_element =
                            '<ons-list-item class="person" modifier="chevron" onClick="myNavigator.pushPage(&#39;pending_personal_inf.html&#39;, { animation : &#39;slide&#39; } ); setUser(' +
                            "'" +
                            pass[i].username +
                            "'" +
                            ')">' +
                            '<ons-row>' +
                            '<ons-col width="40px">' +
                            '<img src="' +
                            pass[i]['imagePath'] +
                            '" class="person-image">' +
                            '</ons-col>' +
                            '<ons-col class="person-name">' +
                            pass[i]['name'] +
                            ' ' +
                            pass[i]['surname'] +
                            '<ons-col>' +
                            '</ons-row>' +
                            '</ons-list-item>';
                        //document.getElementById("journeys_list_accepted").insertAdjacentHTML('beforeend',list_element);
                        var elm = $(list_element);
                        elm.appendTo($('#journeys_list_pending')); // Insert to the DOM first
                        ons.compile(elm[0]); // The argument must be a HTMLElement object
                    }
                }
            }
        });
    }
}

function setUser(usr) {
    user = usr;
}

function setVehicle(veh) {
    uVehicle = veh;
}

function getPhotoUser() {
    //Specify the source to get the photos.
    ons.notification.confirm({
        message: 'Add a new picture from:',
        title: 'Change Picture',
        buttonLabels: ['Album', 'Camera'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,

        callback: function(index) {
            // -1: Cancel
            // 0-: Button index from the left
            switch (index) {
                case 0:
                    navigator.camera.getPicture(onSuccessUser, onFailUser, {
                        quality: 75,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 200,
                        targetHeight: 200
                    });
                    break;
                case 1:
                    navigator.camera.getPicture(onSuccessUser, onFailUser, {
                        quality: 75,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 200,
                        targetHeight: 200
                    });
                    break;
            }
        }
    });
}

function onSuccessUser(imageURI) {
    imageBase64 = 'data:image/jpeg;base64,' + imageURI;
    document.getElementById('user_picture2').src = imageBase64;
}

function onFailUser(message) {
    alert('An error occured: ' + message);
}

function getPhotoVehicle() {
    //Specify the source to get the photos.
    ons.notification.confirm({
        message: 'Add a new picture from:',
        title: 'Change Picture',
        buttonLabels: ['Album', 'Camera'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,

        callback: function(index) {
            // -1: Cancel
            // 0-: Button index from the left
            switch (index) {
                case 0:
                    navigator.camera.getPicture(onSuccessVehicle, onFailVehicle, {
                        quality: 75,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 200,
                        targetHeight: 200
                    });
                    break;
                case 1:
                    navigator.camera.getPicture(onSuccessVehicle, onFailVehicle, {
                        quality: 75,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 200,
                        targetHeight: 200
                    });
                    break;
            }
        }
    });
}

function sendJourneyRequest() {
    list_element =
        '<ons-button modifier="large--cta" id = "joinButton" disabled="true">Request Sent. Response pending <i class="fa fa-spinner fa-spin"></i></ons-button>';

    var elm = $(list_element);
    elm.replaceAll($('#joinButton')); // Insert to the DOM first
    ons.compile(elm[0]);

    var journ = journeysMatching;

    var o = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ]['_id']['$id'];
    var j = JSON.parse(window.localStorage.getItem('journeysPending'));

    if (j) {
        journeysPending = j;
    }

    journeysPending[o] = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ];
    window.localStorage.setItem('journeysPending', JSON.stringify(journeysPending));

    var vehicle = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].vehicle;
    var driver = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].driver;
    var mode = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].mode;
    var departureAddress = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].departureAddress;
    var departureLat = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].departureLat;
    var departureLng = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].departureLng;
    var destinationAddress = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].destinationAddress;
    var destinationLat = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].destinationLat;
    var destinationLng = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].destinationLng;
    var schedule = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].schedule;
    var distance = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].distance;
    var journeyDuration = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].journeyDuration;
    var acceptedPassengers = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].acceptedPassengers;
    var pendingPassengers = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].pendingPassengers;
    var rejectedPassengers = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].rejectedPassengers;
    var waypoints = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].waypoints;
    var seatsAvailable = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].seatsAvailable;
    var notes = journ[selectedMatchingJourneyI][selectedMatchingJourneyJ].notes;

    pendingPassengers.push(window.localStorage.getItem('email'));

    var journey1 = new journey(
        o,
        vehicle,
        driver,
        mode,
        departureAddress,
        departureLat,
        departureLng,
        destinationAddress,
        destinationLat,
        destinationLng,
        schedule,
        distance,
        journeyDuration,
        acceptedPassengers,
        pendingPassengers,
        rejectedPassengers,
        waypoints,
        seatsAvailable,
        notes
    );

    var data = {
        access_token: window.localStorage.getItem('token'),
        collection: 'journeys',
        id: o,
        object: journey1
    };

    //updateCollection(data);
    updateCollection(data, function(r) {
        if (debug) {
            console.log(r);
        }
    });

    journeysMatching[selectedMatchingJourneyI][selectedMatchingJourneyJ].pendingPassengers.push(
        window.localStorage.getItem('email')
    );

    ons.notification.alert({
        message: 'Request Submited! Please wait for the driver to accept you.',
        // or messageHTML: '<div>Message in HTML</div>',
        title: 'Success',
        buttonLabel: 'OK',
        animation: 'default', // or 'none'
        // modifier: 'optional-modifier'
        callback: function() {
            var pages = myNavigator.getPages();

            if (pages[pages.length - 2].name == 'journey.html') {
                myNavigator.popPage('journey_matching.html', { onTransitionEnd: reloadMatchingJourneyVal() });
            } else {
                myNavigator.popPage('journey_matching.html', { onTransitionEnd: loadJourneysMatching() });
            }
        }
    });
}

function acceptPendingPassenger() {
    ons.notification.confirm({
        messageHTML: 'Are you sure you want to accept this passenger?',
        title: 'Accept Pending Passenger',
        buttonLabels: ['Cancel', 'Accept'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,

        callback: function(index) {
            switch (index) {
                case 0:
                    break;
                case 1:
                    var journ = JSON.parse(window.localStorage.getItem('journeys'));

                    var vehicle = journ[selectedJourney].vehicle;
                    var driver = journ[selectedJourney].driver;
                    var mode = journ[selectedJourney].mode;
                    var departureAddress = journ[selectedJourney].departureAddress;
                    var departureLat = journ[selectedJourney].departureLat;
                    var departureLng = journ[selectedJourney].departureLng;
                    var destinationAddress = journ[selectedJourney].destinationAddress;
                    var destinationLat = journ[selectedJourney].destinationLat;
                    var destinationLng = journ[selectedJourney].destinationLng;
                    var schedule = journ[selectedJourney].schedule;
                    var distance = journ[selectedJourney].distance;
                    var journeyDuration = journ[selectedJourney].journeyDuration;
                    var acceptedPassengers = journ[selectedJourney].acceptedPassengers;
                    var pendingPassengers = journ[selectedJourney].pendingPassengers;
                    var rejectedPassengers = journ[selectedJourney].rejectedPassengers;
                    var waypoints = journ[selectedJourney].waypoints;
                    var seatsAvailable = journ[selectedJourney].seatsAvailable;
                    var notes = journ[selectedJourney].notes;

                    acceptedPassengers.push(user);
                    pendingPassengers.pop(user);

                    if (acceptedPassengers.length >= seatsAvailable) {
                        for (var i in pendingPassengers) {
                            rejectedPassengers.push(pendingPassengers[i]);
                            pendingPassengers.pop(pendingPassengers[i]);
                        }
                    }

                    var journey1 = new journey(
                        selectedJourney,
                        vehicle,
                        driver,
                        mode,
                        departureAddress,
                        departureLat,
                        departureLng,
                        destinationAddress,
                        destinationLat,
                        destinationLng,
                        schedule,
                        distance,
                        journeyDuration,
                        acceptedPassengers,
                        pendingPassengers,
                        rejectedPassengers,
                        waypoints,
                        seatsAvailable,
                        notes
                    );

                    var data = {
                        access_token: window.localStorage.getItem('token'),
                        collection: 'journeys',
                        id: selectedJourney,
                        object: journey1
                    };

                    //updateCollection(data);
                    updateCollection(data, function(r) {
                        if (debug) {
                            console.log(r);
                        }
                    });

                    journeys[selectedJourney] = journey1;
                    window.localStorage.setItem('journeys', JSON.stringify(journeys));

                    ons.notification.alert({
                        message: 'Passenger Accepted!',
                        // or messageHTML: '<div>Message in HTML</div>',
                        title: 'Success',
                        buttonLabel: 'OK',
                        animation: 'default', // or 'none'
                        // modifier: 'optional-modifier'
                        callback: function() {
                            // Alert button is closed!
                            var pages = myNavigator.getPages();

                            if (pages[pages.length - 2].name == 'journey.html') {
                                myNavigator.popPage('pending_personal_inf.html', { onTransitionEnd: loadJourneyVal() });
                            } else {
                                myNavigator.popPage('pending_personal_inf.html');
                            }
                        }
                    });

                    break;
            }
        }
    });
}

function rejectPendingPassenger() {
    ons.notification.confirm({
        messageHTML: 'Are you sure you want to reject this passenger?',
        title: 'Reject Pending Passenger',
        buttonLabels: ['Cancel', 'Reject'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,

        callback: function(index) {
            switch (index) {
                case 0:
                    break;
                case 1:
                    var journ = JSON.parse(window.localStorage.getItem('journeys'));

                    var vehicle = journ[selectedJourney].vehicle;
                    var driver = journ[selectedJourney].driver;
                    var mode = journ[selectedJourney].mode;
                    var departureAddress = journ[selectedJourney].departureAddress;
                    var departureLat = journ[selectedJourney].departureLat;
                    var departureLng = journ[selectedJourney].departureLng;
                    var destinationAddress = journ[selectedJourney].destinationAddress;
                    var destinationLat = journ[selectedJourney].destinationLat;
                    var destinationLng = journ[selectedJourney].destinationLng;
                    var schedule = journ[selectedJourney].schedule;
                    var distance = journ[selectedJourney].distance;
                    var journeyDuration = journ[selectedJourney].journeyDuration;
                    var acceptedPassengers = journ[selectedJourney].acceptedPassengers;
                    var pendingPassengers = journ[selectedJourney].pendingPassengers;
                    var rejectedPassengers = journ[selectedJourney].rejectedPassengers;
                    var waypoints = journ[selectedJourney].waypoints;
                    var seatsAvailable = journ[selectedJourney].seatsAvailable;
                    var notes = journ[selectedJourney].notes;

                    pendingPassengers.pop(user);
                    rejectedPassengers.push(user);

                    var journey1 = new journey(
                        selectedJourney,
                        vehicle,
                        driver,
                        mode,
                        departureAddress,
                        departureLat,
                        departureLng,
                        destinationAddress,
                        destinationLat,
                        destinationLng,
                        schedule,
                        distance,
                        journeyDuration,
                        acceptedPassengers,
                        pendingPassengers,
                        rejectedPassengers,
                        waypoints,
                        seatsAvailable,
                        notes
                    );

                    var data = {
                        access_token: window.localStorage.getItem('token'),
                        collection: 'journeys',
                        id: selectedJourney,
                        object: journey1
                    };

                    //updateCollection(data);
                    updateCollection(data, function(r) {
                        if (debug) {
                            console.log(r);
                        }
                    });

                    journeys[selectedJourney] = journey1;
                    window.localStorage.setItem('journeys', JSON.stringify(journeys));

                    ons.notification.alert({
                        message: 'Passenger Rejected!',
                        // or messageHTML: '<div>Message in HTML</div>',
                        title: 'Success',
                        buttonLabel: 'OK',
                        animation: 'default', // or 'none'
                        // modifier: 'optional-modifier'
                        callback: function() {
                            // Alert button is closed!
                            var pages = myNavigator.getPages();

                            if (pages[pages.length - 2].name == 'journey.html') {
                                myNavigator.popPage('pending_personal_inf.html', { onTransitionEnd: loadJourneyVal() });
                            } else {
                                myNavigator.popPage('pending_personal_inf.html');
                            }
                        }
                    });

                    break;
            }
        }
    });
}

function saveJourneyNotes() {
    ons.notification.confirm({
        messageHTML: 'Are you sure you want to save these notes?',
        title: 'Save Notes',
        buttonLabels: ['Cancel', 'Save'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: true,

        callback: function(index) {
            switch (index) {
                case 0:
                    break;
                case 1:
                    var journ = JSON.parse(window.localStorage.getItem('journeys'));

                    var vehicle = journ[selectedJourney].vehicle;
                    var driver = journ[selectedJourney].driver;
                    var mode = journ[selectedJourney].mode;
                    var departureAddress = journ[selectedJourney].departureAddress;
                    var departureLat = journ[selectedJourney].departureLat;
                    var departureLng = journ[selectedJourney].departureLng;
                    var destinationAddress = journ[selectedJourney].destinationAddress;
                    var destinationLat = journ[selectedJourney].destinationLat;
                    var destinationLng = journ[selectedJourney].destinationLng;
                    var schedule = journ[selectedJourney].schedule;
                    var distance = journ[selectedJourney].distance;
                    var journeyDuration = journ[selectedJourney].journeyDuration;
                    var acceptedPassengers = journ[selectedJourney].acceptedPassengers;
                    var pendingPassengers = journ[selectedJourney].pendingPassengers;
                    var rejectedPassengers = journ[selectedJourney].rejectedPassengers;
                    var waypoints = journ[selectedJourney].waypoints;
                    var seatsAvailable = journ[selectedJourney].seatsAvailable;
                    var notes = document.getElementById('notes').value;

                    var journey1 = new journey(
                        selectedJourney,
                        vehicle,
                        driver,
                        mode,
                        departureAddress,
                        departureLat,
                        departureLng,
                        destinationAddress,
                        destinationLat,
                        destinationLng,
                        schedule,
                        distance,
                        journeyDuration,
                        acceptedPassengers,
                        pendingPassengers,
                        rejectedPassengers,
                        waypoints,
                        seatsAvailable,
                        notes
                    );

                    var data = {
                        access_token: window.localStorage.getItem('token'),
                        collection: 'journeys',
                        id: selectedJourney,
                        object: journey1
                    };

                    //updateCollection(data);
                    updateCollection(data, function(r) {
                        if (debug) {
                            console.log(r);
                        }
                    });

                    journeys[selectedJourney] = journey1;
                    window.localStorage.setItem('journeys', JSON.stringify(journeys));

                    ons.notification.alert({
                        message: 'Notes Saved!',
                        // or messageHTML: '<div>Message in HTML</div>',
                        title: 'Success',
                        buttonLabel: 'OK',
                        animation: 'default', // or 'none'
                        // modifier: 'optional-modifier'
                        callback: function() {
                            // Alert button is closed!
                        }
                    });

                    break;
            }
        }
    });
}

function getVehicle(data, callback) {
    var token = window.localStorage.getItem('token');
    var url_getVehicle = 'http://' + server + '/getVehicle';
    var JSONdata = JSON.stringify(data);
    var ajaxWorker_getVehicle = new Worker('js/ajax.js');
    ajaxWorker_getVehicle.postMessage([url_getVehicle, JSONdata]);

    ajaxWorker_getVehicle.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            callback(JSON.stringify(data));
        }

        ajaxWorker_getVehicle.terminate();
    };
}

function onSuccessVehicle(imageURI) {
    imageBase64 = imageBase64 = 'data:image/jpeg;base64,' + imageURI;
    document.getElementById('vehicle_picture').src = imageBase64;
}

function onFailVehicle(message) {
    alert('An error occured: ' + message);
}

function addNewVehicle(bool) {
    newVehicle = bool;
}

function journeySelected(i) {
    selectedJourney = i;
}

function acceptedJourneySelected(i) {
    selectedJourney = i;
}

function matchingJourneySelected(i, j) {
    selectedMatchingJourneyI = i;
    selectedMatchingJourneyJ = j;
}

function vehicleSelected(i) {
    selectedVehicle = i;
}

//==================MAP MANIPULATION FUNCTIONS==================//
function loadMap() {
    if (control) {
        // control.removeFrom(map);
        control = null;
    }

    map = new L.Map('map', {
        minZoom: 5,
        maxZoom: 18,
        unloadInvisibleTiles: true,
        updateWhenIdle: true,
        reuseTiles: true,
        zoomControl: false
    });
    var currTileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        attributionControl: false
    });

    map.locate({ setView: true, maxZoom: 16, watch: false, timeout: 30000, enableHighAccuracy: true });

    map.addLayer(currTileLayer);
    map.attributionControl.setPrefix('');

    map.on('click', onMapClick);
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
}

function getCurrentPosition() {
    if (locationObject) {
        map.setView([locationObject.userLatitude, locationObject.userLongitude]);

        if (marker) {
            map.removeLayer(marker);
        }

        L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

        var markerAtr = L.AwesomeMarkers.icon({
            icon: 'home',
            markerColor: 'blue'
        });

        marker = L.marker([locationObject.userLatitude, locationObject.userLongitude], {
            icon: markerAtr,
            draggable: true
        }).addTo(map);
        marker.on('dragend', onDragEnd);
    }
}

function onMapClick(e) {
    if (destMarker) {
        map.removeLayer(destMarker);
    }

    if (control) {
        control.removeFrom(map);
        control = null;
    }

    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

    var markerAtr = L.AwesomeMarkers.icon({
        icon: 'crosshairs',
        markerColor: 'red'
    });

    destMarker = L.marker(e.latlng, { icon: markerAtr }).addTo(map);

    destAddress = 'The address has not been retrieved yet.'; //"Error in retrieving address";
    findAddress(
        function(result1, result2, result3) {
            if (result2 && result3) {
                destAddress = result2 + ', ' + result3;
            } else if (result1) {
                destAddress = result1;
            }
            destMarker.bindPopup(destAddress).openPopup();
        },
        destMarker.getLatLng().lat,
        destMarker.getLatLng().lng
    );
}

function onLocationFound(position) {
    modal.hide();

    if (marker) {
        map.removeLayer(marker);
    }

    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

    var markerAtr = L.AwesomeMarkers.icon({
        icon: 'home',
        markerColor: 'blue'
    });

    //marker = L.marker([position.latitude, position.longitude],{draggable:true}).addTo(map);
    marker = L.marker([position.latitude, position.longitude], { icon: markerAtr, draggable: true }).addTo(map);
    marker.on('dragend', onDragEnd);

    locationObject = {
        userLatitude: position.latitude,
        userLongitude: position.longitude,
        accuracy: position.accuracy,
        heading: position.heading,
        speed: position.speed,
        time: Math.floor(Date.now() / 1000)
    };

    //control.setWaypoints(L.latLng([position.latitude, position.longitude]));

    homeAddress = 'The address has not been retrieved yet.'; //"Error in retrieving address";
    findAddress(
        function(result1, result2, result3) {
            if (result2 && result3) {
                homeAddress = result2 + ', ' + result3;
            } else if (result1) {
                homeAddress = result1;
            }
        },
        marker.getLatLng().lat,
        marker.getLatLng().lng
    );
}

function onDragEnd() {
    homeAddress = 'The address has not been retrieved yet.'; //"Error in retrieving address";
    findAddress(
        function(result1, result2, result3) {
            if (result2 && result3) {
                homeAddress = result2 + ', ' + result3;
            } else if (result1) {
                homeAddress = result1;
            }
        },
        marker.getLatLng().lat,
        marker.getLatLng().lng
    );
}

function onLocationError(error) {
    modal.hide();
    var message = '';

    if (error.code == 2) {
        message = 'Location settings disabled.';
    }
    if (error.code == 3) {
        message = 'Location settings do not respond.';
    }
    if (error.code == 1) {
        message = 'Location settings are not accessible.';
    }

    ons.notification.confirm({
        message: message,
        title: 'Location Error!',
        buttonLabels: ['Continue', 'Retry'],
        animation: 'default',
        primaryButtonIndex: 1,
        cancelable: false,
        callback: function(index) {
            switch (index) {
                case 0:
                    break;
                case 1:
                    app.slidingMenu.setMainPage('main_map.html');
                    break;
            }
        }
    });
}

function findAddress(callback, x, y) {
    //x = typeof x !== 'undefined' ? x : destMarker.getLatLng().lat;
    //y = typeof y !== 'undefined' ? y : destMarker.getLatLng().lng;

    var url =
        'https://dev.virtualearth.net/REST/v1/Locations/' +
        x +
        ',' +
        y +
        '?o=json&includeEntityTypes=Address&key=' +
        bingKey;

    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            var j = data.resourceSets;

            if (typeof j[0].resources[0] === 'undefined') {
                //findAddress(callback,x,y)
                result = 'unknown address';
                callback(result);
            }

            if (j[0].resources[0]) {
                result1 = j[0].resources[0].address.formattedAddress;
                result2 = j[0].resources[0].address.addressLine;
                result3 = j[0].resources[0].address.locality;
                callback(result1, result2, result3);
            }
        },
        error: function(data) {
            result = 'Error on getting the address';
            callback(result);
        }
    });
}

function createJourney() {
    if (userProfileOk()) {
        if (destMarker) {
            if (control) {
                // control.removeFrom(map);
                control = null;
            }
            if (!control) {
                /*control = L.Routing.control({
                            waypoints: [
                                marker.getLatLng(),
                                destMarker.getLatLng()
                            ],
                            routeWhileDragging: false,
                            fitSelectedRoutes: true
                        //geocoder: L.Control.Geocoder.nominatim()
                        }).addTo(map);*/

                L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

                var markerAtr = L.AwesomeMarkers.icon({
                    icon: 'home',
                    markerColor: 'blue'
                });

                var destMarkerAtr = L.AwesomeMarkers.icon({
                    icon: 'crosshairs',
                    markerColor: 'red'
                });

                control = L.Routing.control({
                    plan: L.Routing.plan([marker.getLatLng(), destMarker.getLatLng()], {
                        createMarker: function(i, wp) {
                            if (i == 0) {
                                return L.marker(wp.latLng, { icon: markerAtr });
                            } else {
                                return L.marker(wp.latLng, { icon: destMarkerAtr });
                            }
                        }
                    }),
                    routeWhileDragging: false,
                    fitSelectedRoutes: true
                }).addTo(map);

                r = control.getRouter();

                r.route(control.getWaypoints(), function(err, routes) {
                    if (err) {
                        ons.notification.alert({
                            message: 'Total distance and time of your journey could not be retrieved. Please try repositioning your destination marker.',
                            title: 'Journey Controller Warning',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                        map.remove();
                        loadMap();
                    } else if (routes[0].summary.totalDistance < 1000) {
                        ons.notification.alert({
                            message: "Total distance of your journey can't be less than 1000m. Please try repositioning your destination marker.",
                            title: 'Journey Controller Warning',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                        map.remove();
                        loadMap();
                    } else {
                        totalDist = routes[0].summary.totalDistance;
                        totalTime = routes[0].summary.totalTime;
                        journeyWaypoints = [].concat.apply([], routes[0].coordinates);

                        ons.notification.confirm({
                            //messageHTML: 'Please insert date and time<br><input type="datetime-local" id="schedule" required>',
                            messageHTML: "Please insert date <br /> <input type='date' id='scheduleD' required><br />And time<br><input type='time' id='scheduleT' required>", //$(function(){ $('#schedule').appendDtpicker();});
                            title: 'Journey Schedule',
                            buttonLabels: ['Cancel', 'Next'],
                            animation: 'default',
                            primaryButtonIndex: 1,
                            cancelable: true,

                            callback: function(index) {
                                switch (index) {
                                    case 0:
                                        if (control) {
                                            // control.removeFrom(map); //need change here
                                            control = null;
                                        }
                                        break;
                                    case 1:
                                        // IF no date or past dateinserted
                                        var d1 = new Date(
                                            document.getElementById('scheduleD').value +
                                            'T' +
                                            document.getElementById('scheduleT').value +
                                            'Z'
                                        );
                                        d1.setHours(d1.getHours() + d1.getTimezoneOffset() / 60);
                                        var d2 = new Date();

                                        if (!document.getElementById('scheduleD').value) {
                                            ons.notification.alert({
                                                title: 'Warning',
                                                animation: 'default',
                                                message: "Date can't be empty!",

                                                callback: function() {
                                                    // control.removeFrom(map);
                                                    control = null;
                                                    createJourney();
                                                }
                                            });
                                        } else if (!document.getElementById('scheduleT').value) {
                                            ons.notification.alert({
                                                title: 'Warning',
                                                animation: 'default',
                                                message: "Time can't be empty!",

                                                callback: function() {
                                                    // control.removeFrom(map);
                                                    control = null;
                                                    map.remove();
                                                    loadMap();
                                                    createJourney();
                                                }
                                            });
                                        } else if (d1 < d2) {
                                            ons.notification.alert({
                                                title: 'Warning',
                                                animation: 'default',
                                                message: "Date can't be past!",

                                                callback: function() {
                                                    // control.removeFrom(map);
                                                    control = null;
                                                    map.remove();
                                                    loadMap();
                                                    createJourney();
                                                }
                                            });
                                        } else if (
                                            Math.floor(d1.getTime() / (1000 * 60 * 60 * 24) - d2.getTime() / (1000 * 60 * 60 * 24)) >=
                                            scheduleLimitInDays
                                        ) {
                                            ons.notification.alert({
                                                title: 'Warning',
                                                animation: 'default',
                                                message: 'Schedule must be less than ' + scheduleLimitInDays + ' days ahead!',

                                                callback: function() {
                                                    // control.removeFrom(map);
                                                    control = null;
                                                    map.remove();
                                                    loadMap();
                                                    createJourney();
                                                }
                                            });
                                        } else {
                                            schedule = new Date(
                                                document.getElementById('scheduleD').value +
                                                'T' +
                                                document.getElementById('scheduleT').value +
                                                'Z'
                                            );
                                            schedule.setHours(schedule.getHours() + schedule.getTimezoneOffset() / 60);

                                            var dur = totalTime;

                                            if (dur < 3600) {
                                                dur = parseInt(dur / 60, 10) + 'min';
                                            } else {
                                                dur = parseInt(dur / 3600, 10) + 'h ' + parseInt(dur % 3600, 10) + 'm';
                                            }

                                            var journeyHtml =
                                                '<ons-row><ons-col width="80px" class="journey-left"><div class="journey-date">' +
                                                (schedule.getMonth() + 1) +
                                                '/' +
                                                schedule.getDate() +
                                                '/' +
                                                schedule.getFullYear() +
                                                '</div><ons-icon icon="fa-clock-o"></ons-icon>' +
                                                schedule.getHours() +
                                                ':' +
                                                schedule.getMinutes() +
                                                '</div></ons-col><ons-col width="6px" class="journey-center" ng-style="{backgroundColor: &#39;#3399ff&#39;}"></ons-col><ons-col class="journey-right"><div class="journey-info"></div><div class="journey-info"><ons-icon icon="fa-home"></ons-icon>&nbsp;' +
                                                homeAddress +
                                                '</div><div class="journey-info"><ons-icon icon="fa-crosshairs"></ons-icon>&nbsp;' +
                                                destAddress +
                                                '</div><div class="journey-info"><ons-icon icon="fa-arrows-h"></ons-icon>&nbsp;' +
                                                (totalDist / 1000).toFixed(1) +
                                                'km</div><div class="journey-info"><ons-icon icon="fa-clock-o"></ons-icon>&nbsp;' +
                                                dur +
                                                '</div></ons-col></ons-row>';

                                            if (userVehicleOk()) {
                                                ons.notification.confirm({
                                                    messageHTML: journeyHtml,
                                                    //messageHTML: 'From:&nbsp;"'+homeAddress+'"<br>To:&nbsp;"'+destAddress+'"<br>On:&nbsp;'+(schedule.getMonth()+1)+'/'+schedule.getDate()+'/'+schedule.getFullYear()+'&nbsp;'+schedule.getHours()+':'+schedule.getMinutes()+'<br>Total distance:&nbsp;'+(totalDist/1000).toFixed(1)+'km<br>Total time:&nbsp;'+dur,
                                                    title: 'Journey Details',
                                                    buttonLabels: ['Driver', 'Passenger'],
                                                    animation: 'default',
                                                    primaryButtonIndex: 1,
                                                    cancelable: true,

                                                    callback: function(index) {
                                                        // -1: Cancel
                                                        // 0-: Button index from the left
                                                        switch (index) {
                                                            case 0:
                                                                var veh = JSON.parse(window.localStorage.getItem('vehicles'));
                                                                var html = '';
                                                                var i = 0;
                                                                console.log("My car is:");
                                                                console.log(veh);
                                                                // if (veh) {
                                                                //     for (var i in veh) {
                                                                //         if (veh.hasOwnProperty(i)) {
                                                                //             if (veh[i]) {
                                                                //                 //vehicle_picturewp
                                                                //                 //var pic = veh[i].imagePath;
                                                                //                 var brand = veh[i].brand;
                                                                //                 var model = veh[i].model;
                                                                //                 html =
                                                                //                     html +
                                                                //                     '<ons-list-item modifier="tappable">' +
                                                                //                     '<label class="radio-button radio-button--list-item">' +
                                                                //                     '<input type="radio" name="car" id = ' +
                                                                //                     "'" +
                                                                //                     i +
                                                                //                     "'" +
                                                                //                     ' checked="checked">' +
                                                                //                     '<div class="radio-button__checkmark radio-button--list-item__checkmark"></div>' +
                                                                //                     brand +
                                                                //                     ' ' +
                                                                //                     model +
                                                                //                     '</label>' +
                                                                //                     '</ons-list-item>';
                                                                //             }
                                                                //         }
                                                                //     }
                                                                // }
                                                                if (veh) {
                                                                    // for (var i in veh) {
                                                                    // if (veh.hasOwnProperty(i)) {
                                                                    // if (veh[i]) {
                                                                    //vehicle_picturewp
                                                                    //var pic = veh[i].imagePath;
                                                                    var brand = veh.brand;
                                                                    var model = veh.model;
                                                                    html =
                                                                        html +
                                                                        '<ons-list-item modifier="tappable">' +
                                                                        '<label class="radio-button radio-button--list-item">' +
                                                                        '<input type="radio" name="car" id = ' +
                                                                        "'" +
                                                                        i +
                                                                        "'" +
                                                                        ' checked="checked">' +
                                                                        '<div class="radio-button__checkmark radio-button--list-item__checkmark"></div>' +
                                                                        brand +
                                                                        ' ' +
                                                                        model +
                                                                        '</label>' +
                                                                        '</ons-list-item>';
                                                                    // }
                                                                    // }
                                                                    // }
                                                                }

                                                                // ons.notification.alert({
                                                                //     title: 'Car Selection',
                                                                //     messageHTML: '<ons-list>' + html + '</ons-list>',
                                                                //     animation: 'default',
                                                                //     callback: function() {
                                                                //         if (veh) {
                                                                //             for (var i in veh) {
                                                                //                 if (veh.hasOwnProperty(i)) {
                                                                //                     if (veh[i]) {
                                                                //                         if (document.getElementById(i).checked) {
                                                                //                             journeyVehicle = i;
                                                                //                         }
                                                                //                     }
                                                                //                 }
                                                                //             }
                                                                //         }

                                                                ons.notification.alert({
                                                                    title: 'Car Selection',
                                                                    messageHTML: '<ons-list>' + html + '</ons-list>',
                                                                    animation: 'default',
                                                                    callback: function() {
                                                                        if (veh) {
                                                                            // for (var i in veh) {
                                                                            // if (veh.hasOwnProperty(i)) {
                                                                            // if (veh[i]) {
                                                                            if (document.getElementById(i).checked) {
                                                                                journeyVehicle = i;
                                                                            }
                                                                            // }
                                                                            // }
                                                                            // }
                                                                        }

                                                                        // ons.notification.alert({
                                                                        //     title: 'Available Seats Selection',
                                                                        //     messageHTML: '<input type="number" id="seatsAvailable" value="' +
                                                                        //         (veh[i].seats - 1) +
                                                                        //         '" min="1" max="' +
                                                                        //         (veh[i].seats - 1) +
                                                                        //         '"> (Range for this car: 1-' +
                                                                        //         (veh[i].seats - 1) +
                                                                        //         ')',
                                                                        //     animation: 'default',
                                                                        //     callback: function() {
                                                                        //         mode = 'driver';
                                                                        //         seatsAvailable = parseInt(document.getElementById('seatsAvailable').value, 10);
                                                                        //         saveJourneyInf();
                                                                        //         destMarker.closePopup();
                                                                        //         map.removeLayer(destMarker);
                                                                        //         // control.removeFrom(map);
                                                                        //         control = null;
                                                                        //         getCurrentPosition();
                                                                        //     }
                                                                        // });
                                                                        ons.notification.alert({
                                                                            title: 'Available Seats Selection',
                                                                            messageHTML: '<input type="number" id="seatsAvailable" value="' +
                                                                                (veh.seats - 1) +
                                                                                '" min="1" max="' +
                                                                                (veh.seats - 1) +
                                                                                '"> (Range for this car: 1-' +
                                                                                (veh.seats - 1) +
                                                                                ')',
                                                                            animation: 'default',
                                                                            callback: function() {
                                                                                mode = 'driver';
                                                                                seatsAvailable = parseInt(document.getElementById('seatsAvailable').value, 10);
                                                                                saveJourneyInf();
                                                                                destMarker.closePopup();
                                                                                map.removeLayer(destMarker);
                                                                                // control.removeFrom(map);
                                                                                control = null;
                                                                                getCurrentPosition();
                                                                            }
                                                                        });
                                                                    }
                                                                });

                                                                break;
                                                            case 1:
                                                                mode = 'passenger';
                                                                saveJourneyInf();
                                                                destMarker.closePopup();
                                                                map.removeLayer(destMarker);
                                                                // control.removeFrom(map);
                                                                control = null;
                                                                getCurrentPosition();
                                                                break;
                                                        }
                                                    }
                                                });
                                            } else {
                                                ons.notification.confirm({
                                                    messageHTML: journeyHtml,
                                                    //messageHTML: 'From:&nbsp;"'+homeAddress+'"<br>To:&nbsp;"'+destAddress+'"<br>On:&nbsp;'+(schedule.getMonth()+1)+'/'+schedule.getDate()+'/'+schedule.getFullYear()+'&nbsp;'+schedule.getHours()+':'+schedule.getMinutes()+'<br>Total distance:&nbsp;'+(totalDist/1000).toFixed(1)+'km<br>Total time:&nbsp;'+dur,
                                                    title: 'Journey Details',
                                                    buttonLabels: ['Passenger'],
                                                    animation: 'default',
                                                    primaryButtonIndex: 1,
                                                    cancelable: true,

                                                    callback: function(index) {
                                                        // -1: Cancel
                                                        // 0-: Button index from the left
                                                        mode = 'passenger';
                                                        saveJourneyInf();
                                                        destMarker.closePopup();
                                                        map.removeLayer(destMarker);
                                                        // control.removeFrom(map);
                                                        control = null;
                                                        getCurrentPosition();
                                                    }
                                                });
                                            }
                                            break;
                                        }
                                }
                            }
                        });
                    }
                });
            }
        } else {
            ons.notification.alert({
                message: 'Please tap on the map to select a destination before you continue.',
                title: 'No destination selected!',
                buttonLabel: 'OK',
                animation: 'default'
            });
            map.remove();
            loadMap();
        }
    } else {
        ons.notification.alert({
            message: 'Please make sure your personal information are correct before creating a journey.',
            title: 'Personal Information Check!',
            buttonLabel: 'OK',
            animation: 'default'
        });
        map.remove();
        loadMap();
    }
}

function comingSoon() {
    ons.notification.alert({
        message: 'Coming soon.',
        animation: 'default',
        callback: function() {}
    });
}

var trafficLayer;

function drawTraffic(geojsonLines) {
    if (trafficLayer) {
        map.removeLayer(trafficLayer);
    }

    for (i = 0; i < geojsonLines[0].geometry.coordinates.length; i++) {
        var temp = geojsonLines[0].geometry.coordinates[i][0];
        geojsonLines[0].geometry.coordinates[i][0] = geojsonLines[0].geometry.coordinates[i][1];
        geojsonLines[0].geometry.coordinates[i][1] = temp;
    }

    trafficLayer = L.geoJson().addTo(map);

    L.geoJson(geojsonLines, {
        style: function(feature) {
            switch (feature.properties.color) {
                case 'red':
                    return { color: 'red' };
                case 'yellow':
                    return { color: 'yellow' };
                case 'green':
                    return { color: 'green' };
            }
        }
    }).addTo(trafficLayer);

    var l = geojsonLines[0].geometry.coordinates.length;

    var dep = L.latLng(geojsonLines[0].geometry.coordinates[0][1], geojsonLines[0].geometry.coordinates[0][0]);
    var dest = L.latLng(geojsonLines[0].geometry.coordinates[l - 1][1], geojsonLines[0].geometry.coordinates[l - 1][0]);
    var bounds = L.latLngBounds(dep, dest);

    map.fitBounds(bounds);
}

/*var geojsonLines = [{
                    "type": "Feature",
                    "properties": {
                        "color": "red",
                        "totalDist": "20.456",
                        "totalTime": "2400",
                        "echo": "2.25182"
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [22.943879, 40.639345], //lat lng
                            [22.941964, 40.636968]
                        ]
                    }
                }]*/

var geojsonLines = [{
    type: 'Feature',
    properties: {
        color: 'red',
        totalDist: '53.7945',
        totalTime: '3359.92',
        echo: '7.32035'
    },
    geometry: {
        type: 'LineString',
        coordinates: [
            [52.5122, 13.2013],
            [52.5121, 13.2018],
            [52.5119, 13.2027],
            [52.5118, 13.2031],
            [52.5117, 13.2034],
            [52.5117, 13.2036],
            [52.5115, 13.2046],
            [52.5113, 13.2057],
            [52.5111, 13.2066],
            [52.5106, 13.2087],
            [52.5103, 13.2104],
            [52.5094, 13.2146],
            [52.5094, 13.2149],
            [52.5093, 13.2153],
            [52.5092, 13.2156],
            [52.5091, 13.2165],
            [52.5087, 13.2182],
            [52.5085, 13.2193],
            [52.5071, 13.2266],
            [52.5069, 13.2275],
            [52.5068, 13.2284],
            [52.5069, 13.2318],
            [52.5075, 13.2421],
            [52.508, 13.2496],
            [52.5084, 13.2573],
            [52.5085, 13.2582],
            [52.5085, 13.2583],
            [52.5085, 13.2587],
            [52.5086, 13.259],
            [52.5086, 13.2594],
            [52.5086, 13.2598],
            [52.5085, 13.2601],
            [52.5085, 13.2607],
            [52.5083, 13.261],
            [52.5078, 13.2614],
            [52.5074, 13.262],
            [52.5073, 13.2623],
            [52.507, 13.263],
            [52.5034, 13.2655],
            [52.5022, 13.2661],
            [52.5016, 13.2666],
            [52.5005, 13.2675],
            [52.4992, 13.2702],
            [52.4992, 13.2705],
            [52.4991, 13.2712],
            [52.4992, 13.2713],
            [52.4999, 13.2718],
            [52.5005, 13.2723],
            [52.5002, 13.2755],
            [52.5001, 13.2757],
            [52.4998, 13.2759],
            [52.4994, 13.276],
            [52.4991, 13.2763],
            [52.4996, 13.2784],
            [52.5005, 13.2807],
            [52.501, 13.2809],
            [52.5018, 13.2806],
            [52.5022, 13.2807],
            [52.5023, 13.2807],
            [52.5023, 13.2807],
            [52.5023, 13.2807],
            [52.5022, 13.2807],
            [52.5022, 13.2806],
            [52.5022, 13.2806],
            [52.5015, 13.2802],
            [52.5013, 13.2801],
            [52.5004, 13.2803],
            [52.5003, 13.2803],
            [52.5001, 13.2804],
            [52.4998, 13.2807],
            [52.4997, 13.2808],
            [52.4996, 13.2808],
            [52.4995, 13.2809],
            [52.4994, 13.281],
            [52.4991, 13.2812],
            [52.4988, 13.2815],
            [52.4986, 13.2817],
            [52.4975, 13.2829],
            [52.4962, 13.284],
            [52.4946, 13.2861],
            [52.4943, 13.2875],
            [52.494, 13.2903],
            [52.4939, 13.2907],
            [52.4938, 13.2909],
            [52.4936, 13.2914],
            [52.4927, 13.293],
            [52.4917, 13.2947],
            [52.491, 13.2959],
            [52.4879, 13.3002],
            [52.4879, 13.3003],
            [52.4878, 13.3005],
            [52.4877, 13.3005],
            [52.4865, 13.3022],
            [52.4847, 13.3046],
            [52.4841, 13.3053],
            [52.483, 13.3069],
            [52.4829, 13.307],
            [52.4827, 13.3077],
            [52.4826, 13.3079],
            [52.4824, 13.3085],
            [52.4823, 13.3088],
            [52.4819, 13.3101],
            [52.4814, 13.3109],
            [52.4811, 13.3113],
            [52.4804, 13.3124],
            [52.4796, 13.3141],
            [52.4792, 13.315],
            [52.4784, 13.3179],
            [52.4782, 13.3193],
            [52.478, 13.3207],
            [52.478, 13.3214],
            [52.4781, 13.3334],
            [52.4783, 13.3348],
            [52.4785, 13.3365],
            [52.4785, 13.3371],
            [52.4787, 13.3398],
            [52.4787, 13.3403],
            [52.4788, 13.341],
            [52.4788, 13.3416],
            [52.4788, 13.3418],
            [52.4787, 13.3421],
            [52.4787, 13.3422],
            [52.4785, 13.3436],
            [52.4785, 13.3438],
            [52.4784, 13.3442],
            [52.4778, 13.3457],
            [52.4772, 13.3467],
            [52.477, 13.3468],
            [52.4765, 13.3474],
            [52.4757, 13.3484],
            [52.4754, 13.3489],
            [52.4753, 13.3491],
            [52.4752, 13.3493],
            [52.4738, 13.3566],
            [52.4743, 13.3592],
            [52.4743, 13.3595],
            [52.4738, 13.3637],
            [52.4737, 13.3638],
            [52.4736, 13.364],
            [52.4733, 13.3646],
            [52.4727, 13.3659],
            [52.4723, 13.3669],
            [52.4709, 13.3711],
            [52.4703, 13.3754],
            [52.4702, 13.3763],
            [52.4701, 13.378],
            [52.47, 13.3801],
            [52.47, 13.3809],
            [52.4699, 13.3855],
            [52.4699, 13.3857],
            [52.4694, 13.3895],
            [52.469, 13.3908],
            [52.4654, 13.4007],
            [52.4653, 13.4011],
            [52.4636, 13.4036],
            [52.4634, 13.4038],
            [52.4622, 13.4062],
            [52.4616, 13.409],
            [52.4615, 13.4093],
            [52.461, 13.413],
            [52.4609, 13.4152],
            [52.4608, 13.4167],
            [52.4609, 13.4181],
            [52.4615, 13.4227],
            [52.4615, 13.4231],
            [52.4616, 13.4271],
            [52.4619, 13.4287],
            [52.462, 13.4299],
            [52.4621, 13.4317],
            [52.4621, 13.4324],
            [52.4623, 13.4344],
            [52.4623, 13.4348],
            [52.4627, 13.438],
            [52.4628, 13.4403],
            [52.4628, 13.4409],
            [52.4629, 13.4413],
            [52.463, 13.4443],
            [52.463, 13.4446],
            [52.463, 13.4449],
            [52.463, 13.4451],
            [52.4631, 13.4454],
            [52.4635, 13.4479],
            [52.4638, 13.4495],
            [52.464, 13.4524],
            [52.464, 13.4525],
            [52.4639, 13.453],
            [52.4638, 13.4532],
            [52.4633, 13.4543],
            [52.4632, 13.4544],
            [52.4622, 13.4553],
            [52.4616, 13.4558],
            [52.46, 13.4572],
            [52.4598, 13.4574],
            [52.4592, 13.4578],
            [52.458, 13.4588],
            [52.4567, 13.4598],
            [52.4564, 13.46],
            [52.4521, 13.4627],
            [52.452, 13.4628],
            [52.4518, 13.463],
            [52.451, 13.4637],
            [52.45, 13.4651],
            [52.4456, 13.4738],
            [52.4446, 13.4758],
            [52.4445, 13.4762],
            [52.443, 13.4794],
            [52.4429, 13.4795],
            [52.4367, 13.4925],
            [52.4356, 13.4945],
            [52.4324, 13.5009],
            [52.4322, 13.5013],
            [52.4319, 13.5021],
            [52.4317, 13.5025],
            [52.4296, 13.5071],
            [52.429, 13.509],
            [52.4289, 13.5095],
            [52.4288, 13.511],
            [52.4288, 13.5112],
            [52.4287, 13.5118],
            [52.4285, 13.5135],
            [52.4285, 13.5135],
            [52.4285, 13.5136],
            [52.428, 13.5134],
            [52.428, 13.5134],
            [52.4278, 13.5134],
            [52.427, 13.5161],
            [52.4267, 13.5201],
            [52.4266, 13.5227],
            [52.4264, 13.5267],
            [52.4263, 13.5289],
            [52.426, 13.5359],
            [52.426, 13.5365],
            [52.4258, 13.5399],
            [52.4257, 13.5412],
            [52.4257, 13.5451],
            [52.4263, 13.5466],
            [52.4265, 13.5469],
            [52.4275, 13.5485],
            [52.4276, 13.5487],
            [52.4288, 13.5504],
            [52.429, 13.5506],
            [52.4291, 13.5509],
            [52.4306, 13.5528],
            [52.432, 13.5546],
            [52.4327, 13.5549],
            [52.4332, 13.5554],
            [52.4342, 13.557],
            [52.4348, 13.5583],
            [52.4354, 13.5597],
            [52.4359, 13.5609],
            [52.4362, 13.5612],
            [52.4362, 13.5613],
            [52.4364, 13.5614],
            [52.4368, 13.562],
            [52.4372, 13.5621],
            [52.4373, 13.5623],
            [52.4374, 13.5628],
            [52.4376, 13.5632],
            [52.4379, 13.5637],
            [52.4385, 13.5646],
            [52.4395, 13.5661],
            [52.4405, 13.5676],
            [52.4419, 13.5697],
            [52.4427, 13.5694],
            [52.4441, 13.5691],
            [52.4445, 13.5693],
            [52.4446, 13.5693],
            [52.4445, 13.5702],
            [52.4445, 13.5738],
            [52.4442, 13.5778],
            [52.4441, 13.5784],
            [52.4432, 13.5807],
            [52.4426, 13.5822],
            [52.4428, 13.5825],
            [52.4435, 13.5833],
            [52.4438, 13.5838],
            [52.4442, 13.5848],
            [52.4445, 13.5854],
            [52.4446, 13.5856],
            [52.4449, 13.5864],
            [52.4451, 13.5869],
            [52.4453, 13.5875],
            [52.4456, 13.5883],
            [52.4462, 13.5899],
            [52.4465, 13.5904],
            [52.4473, 13.5923],
            [52.4475, 13.5936],
            [52.4481, 13.5936],
            [52.4489, 13.5935],
            [52.4496, 13.5934],
            [52.4517, 13.5931],
            [52.4529, 13.5932],
            [52.4531, 13.5932],
            [52.4532, 13.5934],
            [52.4531, 13.5948],
            [52.4531, 13.5955],
            [52.453, 13.5962],
            [52.4529, 13.5971],
            [52.4522, 13.5998],
            [52.4519, 13.6007],
            [52.4519, 13.6023],
            [52.4524, 13.6044],
            [52.4528, 13.6063],
            [52.453, 13.6074],
            [52.4534, 13.609],
            [52.4542, 13.6125],
            [52.4548, 13.6149],
            [52.4552, 13.6169],
            [52.4553, 13.6171],
            [52.4556, 13.6186],
            [52.457, 13.6254],
            [52.4572, 13.6255],
            [52.4575, 13.6255],
            [52.4576, 13.6256],
            [52.4587, 13.6258],
            [52.4597, 13.6261],
            [52.4602, 13.6262],
            [52.466, 13.6278],
            [52.4683, 13.6284],
            [52.4691, 13.6287],
            [52.4766, 13.6392],
            [52.4792, 13.6433],
            [52.4793, 13.6434],
            [52.4799, 13.6438],
            [52.4809, 13.6443],
            [52.484, 13.6461],
            [52.4841, 13.6467],
            [52.4842, 13.647],
            [52.4853, 13.6518],
            [52.4858, 13.6541],
            [52.4868, 13.6585],
            [52.4873, 13.6608],
            [52.4887, 13.6695],
            [52.4887, 13.6696],
            [52.4887, 13.6699],
            [52.4891, 13.6712],
            [52.4905, 13.6718],
            [52.4907, 13.6719],
            [52.4914, 13.6718],
            [52.492, 13.6719],
            [52.4922, 13.672],
            [52.4923, 13.672],
            [52.4944, 13.6742],
            [52.4948, 13.6744],
            [52.4971, 13.6777],
            [52.4984, 13.679],
            [52.4992, 13.6794],
            [52.5003, 13.6799],
            [52.5007, 13.6801],
            [52.5008, 13.6801],
            [52.5009, 13.6801],
            [52.5009, 13.6853],
            [52.5009, 13.6883],
            [52.5009, 13.6891],
            [52.5008, 13.7021],
            [52.5015, 13.7026],
            [52.5069, 13.7065],
            [52.5075, 13.7064],
            [52.5096, 13.7068],
            [52.5116, 13.7071],
            [52.5132, 13.7074],
            [52.514, 13.7077],
            [52.5143, 13.7085],
            [52.5146, 13.7101],
            [52.5149, 13.712],
            [52.5143, 13.713],
            [52.5149, 13.712],
            [52.5151, 13.7131],
            [52.5152, 13.7136],
            [52.5157, 13.7134],
            [52.5166, 13.7139],
            [52.5186, 13.7151],
            [52.5194, 13.7155],
            [52.5206, 13.714],
            [52.5203, 13.7129],
            [52.5198, 13.711],
            [52.5193, 13.7093],
            [52.5185, 13.708],
            [52.5192, 13.7067],
            [52.5188, 13.7052],
            [52.5183, 13.7037],
            [52.5168, 13.7054],
            [52.5157, 13.7059],
            [52.5155, 13.7083],
            [52.5163, 13.7089],
            [52.5169, 13.7094],
            [52.5174, 13.7097],
            [52.5173, 13.7101],
            [52.5163, 13.712],
            [52.5161, 13.7119],
            [52.5146, 13.7101],
            [52.5143, 13.7085],
            [52.514, 13.7077],
            [52.5148, 13.7052],
            [52.5143, 13.7037],
            [52.5127, 13.7051],
            [52.5128, 13.7057],
            [52.5132, 13.7074],
            [52.5116, 13.7071],
            [52.5096, 13.7068],
            [52.5075, 13.7064],
            [52.5069, 13.7065],
            [52.5015, 13.7026],
            [52.5008, 13.7021],
            [52.5007, 13.702],
            [52.5007, 13.7026],
            [52.5008, 13.7129],
            [52.5007, 13.7188],
            [52.5007, 13.7201],
            [52.5007, 13.7235],
            [52.5007, 13.7268],
            [52.5007, 13.7309],
            [52.5007, 13.7331],
            [52.5007, 13.7338],
            [52.5006, 13.7343],
            [52.5007, 13.7343],
            [52.5008, 13.7343],
            [52.5019, 13.7362],
            [52.502, 13.7367],
            [52.5022, 13.7374]
        ]
    }
}]