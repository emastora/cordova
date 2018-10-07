//==================DATA MANIPULATION FUNCTIONS==================//

function savePersonalInf() {

    var token = window.localStorage.getItem("token");

    // if (token == "undefined") {
    //     getToken();
    // }

    // oid = window.localStorage.getItem("person.oid");
    // pass = window.localStorage.getItem("password");
    name = document.getElementById('name2').value;
    surname = document.getElementById('surname2').value;
    var EmailSession = window.localStorage.getItem("Email Session");
    email = EmailSession;
    birthDate = document.getElementById('birthDate2').value;
    occupation = document.getElementById('occupation2').value;
    interests = document.getElementById('interests2').value;
    music = document.getElementById('music2').value;
    // userImage = document.getElementById('user_picture2');
    // imagePath = userImage.src;
    // role = window.localStorage.getItem("person.role");
    // trustLevel = window.localStorage.getItem("person.trustLevel");
    // project = window.localStorage.getItem("person.project");
    // credits = window.localStorage.getItem("person.credits");
    console.log('Music2 is ', document.getElementById('music2').value);
    console.log('Smoker2 is ', document.getElementById('smoker2').checked);
    if (document.getElementById('smoker2').checked) {
        smoker = "Yes";
    } else {
        smoker = "No";
    }


    // if (name && surname && birthDate && occupation && interests && music) {
    //     var person1 = new person(oid, name, surname, email, pass, birthDate, occupation, interests, music, smoker, imagePath, trustLevel, role, project, credits);

    //     window.localStorage.setItem("person.name", name);
    //     window.localStorage.setItem("person.surname", surname);
    //     window.localStorage.setItem("person.email", email);
    //     window.localStorage.setItem("person.birthDate", birthDate);
    //     window.localStorage.setItem("person.occupation", occupation);
    //     window.localStorage.setItem("person.interests", interests);
    //     window.localStorage.setItem("person.music", music);
    //     window.localStorage.setItem("person.imagePath", imagePath); //window.localStorage.setItem("person.imagePath", imagePath);
    //     window.localStorage.setItem("person.smoker", smoker);

    //     var data = {
    //         "access_token": window.localStorage.getItem("token"),
    //         "id": window.localStorage.getItem("person.oid"),
    //         "collection": "users",
    //         "object": person1
    //     };


    if (name && surname && birthDate && occupation && interests && music) {
        var person2 = new person(name, surname, email, birthDate, occupation, interests, music, smoker);

        window.localStorage.setItem("person", JSON.stringify(person2));

        console.log('Person2 is ', person2);

        axios.post('/UpdateUser', person2)
            .then(function(response) {
                console.log(response.data.message)
                console.log(response.status),
                    console.log('saved successfully')
            });


        // createCollection(data, function(d) {
        //     if (debug) {
        //         console.log(d);
        //     }
        // });

        ons.notification.alert({
            message: 'Personal Information Saved',
            // or messageHTML: '<div>Message in HTML</div>',
            title: 'Success',
            buttonLabel: 'OK',
            animation: 'default', // or 'none'
            // modifier: 'optional-modifier'
            callback: function() {
                // Alert button is closed!
                myNavigator.popPage("edit_personal.html", { onTransitionEnd: loadPersonalInf() });
            }
        });
    } else {
        ons.notification.alert({
            message: 'Please fill in all fields',
            // or messageHTML: '<div>Message in HTML</div>',
            title: 'Fields Missing',
            buttonLabel: 'OK',
            animation: 'default', // or 'none'
            // modifier: 'optional-modifier'
            callback: function() {
                // Alert button is closed!
            }
        });
    }

};



function saveVehicleInf() {
    var v = JSON.parse(window.localStorage.getItem("vehicles"));
    if (v) {
        vehicles = v;
    }

    var EmailSession = window.localStorage.getItem("Email Session");
    console.log(EmailSession);
    owner = EmailSession;
    brand = document.getElementById('brand').value;
    model = document.getElementById('model').value;
    seats = document.getElementById('seats').value;
    color = document.getElementById('color').value;
    licencePlate = document.getElementById('licencePlate').value;
    year = document.getElementById('year').value;
    cc = document.getElementById('cc').value;
    var vehicleImage = document.getElementById('vehicle_picture');
    // imagePath = vehicleImage.src;
    // vehicleOid = selectedVehicle;


    if (document.getElementById('aircondition').checked) {
        aircondition = "Yes";
    } else {
        aircondition = "No";
    }

    if (document.getElementById('petsAllowed').checked) {
        petsAllowed = "Yes";
    } else {
        petsAllowed = "No";
    }

    // if (brand && model && seats && color && licencePlate && year && cc) {
    //     var vehicle1 = new vehicle(vehicleOid, localStorage.getItem("email"), brand, model, seats, color, licencePlate, year, cc, aircondition, petsAllowed, imagePath);

    //     vehicle1.setImage(imagePath);
    //     var data = {
    //         "access_token": window.localStorage.getItem("token"),
    //         "collection": "vehicles",
    //         "id": vehicleOid,
    //         "object": vehicle1
    //     };

    if (owner && brand && model && seats && color && licencePlate && year && cc) {
        var vehicle2 = new vehicle(owner, brand, model, seats, color, licencePlate, year, cc, aircondition, petsAllowed);


        // //console.log(vehicleOid);    
        // updateCollection(data, function(r) {
        //     //console.log(r);
        //     var rr = JSON.parse(r);
        //     //Get the oid as inserted in database
        //     if (rr['info']['upserted']) {
        //         var oid = rr['info']['upserted']['$id'];
        //         //Set the oid to the object            
        //         vehicle1.setOid(oid);
        //         //and push it to locastorage as associative array
        //         vehicles[oid] = vehicle1;
        //     } else {
        //         vehicles[vehicleOid] = vehicle1;
        //         vehicle1.setOid(vehicleOid);
        //     }

        //     window.localStorage.setItem("vehicles", JSON.stringify(vehicles));
        // });

        window.localStorage.setItem("vehicles", JSON.stringify(vehicle2));
        console.log(vehicle2);

        axios.post('/CreateVehicle', vehicle2)
            .then(function(response) {
                console.log(response.data.message)
                console.log(response.status),
                    console.log('saved successfully')
            });


        ons.notification.alert({
            message: 'Vehicle Information Saved',
            // or messageHTML: '<div>Message in HTML</div>',
            title: 'Success',
            buttonLabel: 'OK',
            animation: 'default', // or 'none'
            // modifier: 'optional-modifier'
            callback: function() {
                // Alert button is closed!
                if (myNavigator.getCurrentPage().name == 'new_vehicle.html') {
                    myNavigator.popPage('new_vehicle.html', { onTransitionEnd: loadVehiclesList() });
                } else if (myNavigator.getCurrentPage().name == 'edit_vehicle.html') {
                    myNavigator.popPage('edit_vehicle.html', { onTransitionEnd: loadVehicleInf() });
                }
            }
        });
    } else {
        ons.notification.alert({
            message: 'Please fill in all fields',
            // or messageHTML: '<div>Message in HTML</div>',
            title: 'Fields Missing',
            buttonLabel: 'OK',
            animation: 'default', // or 'none'
            // modifier: 'optional-modifier'
            callback: function() {
                // Alert button is closed!
            }
        });
    }
}

function saveVehicleInf2() {
    // var v = JSON.parse(window.localStorage.getItem("vehicles"));
    // if (v) {
    //     vehicles = v;
    // }

    var EmailSession = window.localStorage.getItem("Email Session");
    console.log(EmailSession);
    owner = EmailSession;
    brand = document.getElementById('brand').value;
    model = document.getElementById('model').value;
    seats = document.getElementById('seats').value;
    color = document.getElementById('color').value;
    licencePlate = document.getElementById('licencePlate').value;
    year = document.getElementById('year').value;
    cc = document.getElementById('cc').value;
    var vehicleImage = document.getElementById('vehicle_picture');
    // imagePath = vehicleImage.src;
    // vehicleOid = selectedVehicle;


    if (document.getElementById('aircondition').checked) {
        aircondition = "Yes";
    } else {
        aircondition = "No";
    }

    if (document.getElementById('petsAllowed').checked) {
        petsAllowed = "Yes";
    } else {
        petsAllowed = "No";
    }


    if (owner && brand && model && seats && color && licencePlate && year && cc) {
        var vehicle2 = new vehicle(owner, brand, model, seats, color, licencePlate, year, cc, aircondition, petsAllowed);

        window.localStorage.setItem("vehicles", JSON.stringify(vehicle2));
        // console.log(vehicle2);

        axios.post('/UpdateVehicle', vehicle2)
            .then(function(response) {
                console.log(response.data.message)
                console.log(response.status),
                    console.log('saved successfully')
            });


        ons.notification.alert({
            message: 'Vehicle Information Updated',
            // or messageHTML: '<div>Message in HTML</div>',
            title: 'Success',
            buttonLabel: 'OK',
            animation: 'default', // or 'none'
            // modifier: 'optional-modifier'
            callback: function() {
                // Alert button is closed!
                if (myNavigator.getCurrentPage().name == "new_vehicle.html") {
                    myNavigator.popPage("new_vehicle.html", { onTransitionEnd: loadVehiclesList() });
                } else if (myNavigator.getCurrentPage().name == "edit_vehicle.html") {
                    myNavigator.popPage("edit_vehicle.html", { onTransitionEnd: loadVehicleInf() });
                }
            }
        });
    } else {
        ons.notification.alert({
            message: 'Please fill in all fields',
            // or messageHTML: '<div>Message in HTML</div>',
            title: 'Fields Missing',
            buttonLabel: 'OK',
            animation: 'default', // or 'none'
            // modifier: 'optional-modifier'
            callback: function() {
                // Alert button is closed!
            }
        });
    }
}

//called at vechicle_inf.html
async function loadVehicleInf() {

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

    // document.getElementById("vehicle_email2").innerHTML = window.localStorage.getItem("email");
    document.getElementById("brand2").innerHTML = car.local.brand;
    document.getElementById("model2").innerHTML = car.local.model;
    document.getElementById("seats2").innerHTML = car.local.seats;
    document.getElementById("color2").innerHTML = car.local.color;
    document.getElementById("licencePlate2").innerHTML = car.local.licencePlate;
    document.getElementById("year2").innerHTML = car.local.year;
    document.getElementById("cc2").innerHTML = car.local.cc;
    document.getElementById("aircondition2").innerHTML = car.local.aircondition;
    document.getElementById("petsAllowed2").innerHTML = car.local.petsAllowed;

    // if (veh.imagePath) {
    //     document.getElementById('vehicle_picture2').src = ce.imagePath;
    // } else {
    document.getElementById('vehicle_picture2').src = "images/vehicle.png";
    // }

    // Old function

    // var v = window.localStorage.getItem("vehicles");
    // var ve = JSON.parse(v);

    // if (ve) {
    //     vehicles = ve;
    // } else {
    //     loadUsersVehicles(function(data) {
    //         var ve = JSON.parse(data);
    //         vehicles = ve;
    //         window.localStorage.setItem("vehicles", JSON.stringify(vehicles));
    //     });
    // }

    // var veh = vehicles[selectedVehicle];

    // document.getElementById("vehicle_email2").innerHTML = window.localStorage.getItem("email");
    // document.getElementById("brand2").innerHTML = veh.brand;
    // document.getElementById("model2").innerHTML = veh.model;
    // document.getElementById("seats2").innerHTML = veh.seats;
    // document.getElementById("color2").innerHTML = veh.color;
    // document.getElementById("licencePlate2").innerHTML = veh.licencePlate;
    // document.getElementById("year2").innerHTML = veh.year;
    // document.getElementById("cc2").innerHTML = veh.cc;
    // document.getElementById("aircondition2").innerHTML = veh.aircondition;
    // document.getElementById("petsAllowed2").innerHTML = veh.petsAllowed;

    // if (veh.imagePath) {
    //     document.getElementById('vehicle_picture2').src = veh.imagePath;
    // } else {
    //     document.getElementById('vehicle_picture2').src = "images/vehicle.png";
    // }
};



//called at edit_vehicle.html
function loadVehicleInfVal() {
    var v = window.localStorage.getItem('vehicles');
    var ve = JSON.parse(v);
    if (ve) {
        vehicles = ve;
    }

    var veh = vehicles[selectedVehicle];

    document.getElementById('vehicle_email').innerHTML = window.localStorage.getItem('email');
    document.getElementById('brand').value = veh.brand;
    document.getElementById('model').value = veh.model;
    document.getElementById('seats').value = veh.seats;
    document.getElementById('color').value = veh.color;
    document.getElementById('licencePlate').value = veh.licencePlate;
    document.getElementById('year').value = veh.year;
    document.getElementById('cc').value = veh.cc;

    if (veh.aircondition == 'Yes') {
        document.getElementById('aircondition').checked = true;
    } else {
        document.getElementById('aircondition').checked = false;
    }

    if (veh.petsAllowed == 'Yes') {
        document.getElementById('petsAllowed').checked = true;
    } else {
        document.getElementById('petsAllowed').checked = false;
    }

    if (veh.imagePath) {
        document.getElementById('vehicle_picture').src = veh.imagePath;
    } else {
        document.getElementById('vehicle_picture').src = 'images/vehicle.png';
    }

    if (selectedVehicle != 'aaaaaaaaaaaaaaaaaaaaaaaa') {
        if (veh['_id']['$id']) {
            var oid = veh['_id']['$id'];
            document.getElementById('vechicle_oid').value = oid;
        }
    }
}

//==================API CALL FUNCTIONS==================//

function login(email, password) {
    //if(validateEmail(email)){
    var emailHashed = Sha1.hash(email);
    var url_authentication = 'http://' + server + '/authentication';
    var JSONdata = '{"username":"' + email + '","password":"' + password + '"}';
    var ajaxWorker_authentication = new Worker('js/ajax.js');
    ajaxWorker_authentication.postMessage([url_authentication, JSONdata]);

    ajaxWorker_authentication.onmessage = function(e) {
        if (e.data == 401 || e.data == 500) {
            alert('Login failure');
        } else {
            obj = JSON.parse(e.data);
            key = obj.keys.key;
            secret = obj.keys.secret;

            window.localStorage.setItem('email', email);
            window.localStorage.setItem('keyS', key);
            window.localStorage.setItem('secret', secret);

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

            window.localStorage.setItem('password', Sha1.hash(password));
            window.localStorage.setItem('person.oid', obj.user['_id']['$id']);
            window.localStorage.setItem('person.name', obj.user.name);
            window.localStorage.setItem('person.birthDate', obj.user.birthDate);
            window.localStorage.setItem('person.surname', obj.user.surname);
            window.localStorage.setItem('person.occupation', obj.user.occupation);
            window.localStorage.setItem('person.interests', obj.user.interests);
            window.localStorage.setItem('person.music', obj.user.music);
            window.localStorage.setItem('person.smoker', obj.user.smoker);
            window.localStorage.setItem('person.imagePath', obj.user.imagePath);
            window.localStorage.setItem('person.trustLevel', obj.user.trustLevel);
            window.localStorage.setItem('person.role', obj.user.role);
            window.localStorage.setItem('person.project', obj.user.project);
            window.localStorage.setItem('person.credits', obj.user.credits);

            getToken();
            loadVehicles();
            location.reload();
            document.getElementById('inputEmail').value = '';
            document.getElementById('inputPassword').value = '';
        }

        ajaxWorker_authentication.terminate();
    };
    //}else{
    //    showAlert('Email is not in valid format');
    //}
}

function getToken() {
    var key = window.localStorage.getItem('keyS');
    var secret = window.localStorage.getItem('secret');
    var token = '';
    var url_generateToken = 'http://' + server + '/generateToken';
    var JSONdata = '{"key":"' + key + '","secret":"' + secret + '"}';
    var ajaxWorker_generateToken = new Worker('js/ajax.js');
    ajaxWorker_generateToken.postMessage([url_generateToken, JSONdata]);

    ajaxWorker_generateToken.onmessage = function(e) {
        var t = JSON.parse(e.data);
        token = t['access_token'];
        window.localStorage.setItem('token', token);
        if (debug) {
            console.log('token->' + token);
        }

        ajaxWorker_generateToken.terminate();
    };
}

//NOT USED

function loginFB() {
    openFB.init({ appId: '791967860852638' });
    openFB.login(
        function(response) {
            console.log(response);
            if (response.status === 'connected') {
                alert('Facebook login succeeded, got access token: ' + response.authResponse.token);
            } else {
                alert('Facebook login failed: ' + response.error);
            }
        }, { scope: 'email' }
    );
}

function logout() {
    ons.notification.confirm({
        message: 'Are you sure you want to logout?',
        callback: function(idx) {
            switch (idx) {
                case 0:
                    break;
                case 1:
                    // "app.slidingMenu.setMainPage('/', {closeMenu: true})"
                    // window.localStorage.clear();
                    // location.reload();
                    axios.get('/logout')
                        .then(function(response) {
                            console.log("User logged out successfully")
                        });
                    break;
            }
        }
    });
}

//NOT USED

function createJourneyToDB() {
    var token = window.localStorage.getItem('token');
    var email = window.localStorage.getItem('person.email');
    var data = JSON.stringify({
        departureLat: journey.departureLat,
        departureLng: journey.departureLng,
        destinationLat: journey.destinationLat,
        destinationLng: journey.destinationLng,
        timeStamp: Math.floor(Date.now() / 1000),
        schedule: journey.schedule,
        distance: journey.distance,
        driver: window.localStorage.getItem('person.email')
    });

    var url_createJourney = 'http://160.40.50.60/slim/API/carpooling/createJourney';
    var JSONdata = '{"access_token":"' + token + '","userId":"' + email + '","object":' + data + '}';
    var ajaxWorker_createJourney = new Worker('js/ajax.js');
    ajaxWorker_createJourney.postMessage([url_createJourney, JSONdata]);

    ajaxWorker_createJourney.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            ons.notification.alert({
                message: 'A network error occurred when trying to submit your journey. Please try again.',
                title: 'Network Error!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        } else {
            data = JSON.parse(e.data);
            console.log(JSON.stringify(data));
        }

        ajaxWorker_createJourney.terminate();
    };
}

//NOT USED
function getJourneysFromDB() {
    var token = window.localStorage.getItem('token');
    var email = window.localStorage.getItem('person.email');
    var data = JSON.stringify({
        departureLat: '',
        departureLng: '',
        destinationLat: '',
        destinationLng: '',
        timeStamp: '',
        distance: ''
    });

    var clientTime = Math.floor(Date.now() / 1000);
    var url_getJourneys = 'http://160.40.50.60/slim/API/carpooling/getJourneys';
    var JSONdata =
        '{"access_token":"' + token + '","userId":"' + email + '","clientTime":"' + clientTime + '","object":' + data + '}';
    var ajaxWorker_getJourneys = new Worker('js/ajax.js');
    ajaxWorker_getJourneys.postMessage([url_getJourneys, JSONdata]);

    ajaxWorker_getJourneys.onmessage = function(e) {
        if (debug) {
            console.log(e.data);
        }
        if (e.data == 0 || e.data == 500) {
            showAlertBootbox('A network error occurred when trying to send the report. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            console.log(JSON.stringify(data));
        }

        ajaxWorker_getJourneys.terminate();
    };
}

//NOT USED
function updateJourneyToDB(id, data) {
    var token = window.localStorage.getItem('token');
    var email = window.localStorage.getItem('email');
    var clientTime = Math.floor(Date.now() / 1000);
    var url_getJourneys = 'http://160.40.50.60/slim/API/carpooling/getJourneys';
    var JSONdata = '{"access_token":"' + token + '","userId":"' + email + '","id":"' + id + '","object":' + data + '}';
    var ajaxWorker_getJourneys2 = new Worker('js/ajax.js');
    ajaxWorker_getJourneys2.postMessage([url_getJourneys, JSONdata]);

    ajaxWorker_getJourneys2.onmessage = function(e) {
        if (debug) {
            console.log(e.data);
        }
        if (e.data == 0 || e.data == 500) {
            showAlertBootbox('A network error occurred when trying to send the report. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            console.log(JSON.stringify(data));
        }

        ajaxWorker_getJourneys2.terminate();
    };
}

/**
 * @return - simple JSON result, eg {"result":"success"} or error http code
 */
function createCollection(data, callback) {
    var token = window.localStorage.getItem('token');
    // var url_createCollection= 'http://160.40.50.60/slim/API/carpooling/createCollection';
    var url_createCollection = 'http://localhost:3000/CarPoolingIndex';
    var JSONdata = JSON.stringify(data);
    var ajaxWorker_createCollection = new Worker('js/ajax.js');
    ajaxWorker_createCollection.postMessage([url_createCollection, JSONdata]);
    ajaxWorker_createCollection.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            callback(JSON.stringify(data));
        }

        ajaxWorker_createCollection.terminate();
    };
}

/**
 * Gets a specific object based on objectId in the defined collection
 *
 * @param collection - The targeted collection (users,vehicles,journeys)
 * @param data - The JSON object of the inserted data. Example, var data={
    "access_token": "sufrlW94F5joy5r9vTBlXdY6dOVseYcHsr8OohS4",
    "collection":"users",
    "id":"55068321bb7fe80d887f5673"
}

 * 
 * @return - simple JSON result, eg {"data:[]..."} or error http code
 */
function getCollection(data, callback) {
    var ajaxWorker_getCol = new Worker('js/ajax.js');
    var token = window.localStorage.getItem('token');
    var url_getCollection = 'http://160.40.50.60/slim/API/carpooling/getCollection';
    var JSONdata = JSON.stringify(data);

    ajaxWorker_getCol.postMessage([url_getCollection, JSONdata]);
    ajaxWorker_getCol.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            callback(JSON.stringify(data));
            //Check if object has been inserted
        }

        ajaxWorker_getCol.terminate();
    };
}

/**
 * Updates a specific object in the defined collection
 *
 * @param collection - The targeted collection (users,vehicles,journeys)
 * @param data - The JSON object of the inserted data. Example, var data={
    "access_token": "sufrlW94F5joy5r9vTBlXdY6dOVseYcHsr8OohS4",
    "id": "557aa11470c64e386223d7f3",
    "collection":"vehicles",
    "object": {
        "car": "test",
        "type": "Opel Astra",
        "timeStamp": "1434042900",
        "distance": "1025489"
    }
}

 * 
 * @return - simple JSON result, eg {"result":"success"} or error http code
 */
function updateCollection(data, callback) {
    var ajaxWorker_updateCol = new Worker('js/ajax.js');
    var token = window.localStorage.getItem('token');
    var url_updateCollection = 'http://' + server + '/updateCollection';
    var JSONdata = JSON.stringify(data);

    ajaxWorker_updateCol.postMessage([url_updateCollection, JSONdata]);
    ajaxWorker_updateCol.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            callback(JSON.stringify(data));
        }

        ajaxWorker_updateCol.terminate();
    };
}

/**
 * Deletes a specific object in the defined collection, and put it in deleted collection 
 *
 * @param data - The JSON object of the inserted data. Example, var data={
    "access_token": "sufrlW94F5joy5r9vTBlXdY6dOVseYcHsr8OohS4",
    "id": "557aa11470c64e386223d7f3",
    "collection":"vehicles",
}

 * 
 * @return - simple JSON result, eg {"result":"success"} or error http code
 */
function deleteCollection(data, callback) {
    var ajaxWorker_deleteCol = new Worker('js/ajax.js');
    var token = window.localStorage.getItem('token');
    var url_deleteCollection = 'http://' + server + '/deleteCollection';
    var JSONdata = JSON.stringify(data);
    ajaxWorker_deleteCol.postMessage([url_deleteCollection, JSONdata]);

    ajaxWorker_deleteCol.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            callback(JSON.stringify(data));
        }

        ajaxWorker_deleteCol.terminate();
    };
}

/**
 * Gets a specific user from users collection specifying the id or the email (username)
 *
 * @param collection - The targeted collection (users,vehicles,journeys)
 * @param data - The JSON object of the inserted data. Example, var data={
    "access_token": "sufrlW94F5joy5r9vTBlXdY6dOVseYcHsr8OohS4",
    "id": "557aa11470c64e386223d7f3" // or // "email":"dmixalo2@googlemail.com    
}

 * 
 * @return - simple JSON result, eg {"result":"success"} or error http code
 */
function getUser(data, callback) {
    var ajaxWorker_getUser = new Worker('js/ajax.js');
    var token = window.localStorage.getItem('token');
    var url_getUser = 'http://' + server + '/getUser';
    var JSONdata = JSON.stringify(data);
    ajaxWorker_getUser.postMessage([url_getUser, JSONdata]);

    ajaxWorker_getUser.onmessage = function(e) {
        if (e.data == 0 || e.data == 500) {
            alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
        } else {
            data = JSON.parse(e.data);
            callback(JSON.stringify(data));
        }

        ajaxWorker_getUser.terminate();
    };
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
}

function checkJourneyUpdates(oid, callback) {
    var token = window.localStorage.getItem('token');
    if (token) {
        //get the journeys from localStorage
        var j = JSON.parse(window.localStorage.getItem('journeys'));
        if (j) {
            journeys = j;
        }

        if (journeys) {
            if (journeys[oid]) {
                var data = { access_token: token, collection: 'journeys', id: oid };
                getCollection(data, function(result) {
                    var resultObject = { pending: '', accepted: '', rejected: '', notes: '' };
                    var d1 = JSON.parse(result);

                    if (d1['data']) {
                        var d = d1['data'][0];

                        var ch1;
                        var ch2;
                        var ch3;
                        var ch4;

                        //if(d.acceptedPassengers && d.acceptedPassengers){
                        ch1 = arraysEqual(d.acceptedPassengers, journeys[oid].acceptedPassengers);
                        //}
                        //if(d.pendingPassengers && l.pendingPassengers){
                        ch2 = arraysEqual(d.pendingPassengers, journeys[oid].pendingPassengers);
                        //}
                        ch3 = arraysEqual(d.rejectedPassengers, journeys[oid].rejectedPassengers);

                        ch4 = d.notes === journeys[oid].notes;

                        if (ch1 == false) {
                            resultObject['accepted'] = d.acceptedPassengers;
                        }

                        if (ch2 == false) {
                            getUser({ email: d.pendingPassengers, access_token: localStorage.getItem('token') }, function(p) {
                                var dd = JSON.parse(p);
                                var dr = dd['data'][0];

                                var not = ons.notification.confirm({
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
                                    title: 'Passenger Join Request!',
                                    buttonLabels: ['Not now', 'Answer'],
                                    animation: 'default', // or 'none'
                                    // modifier: 'optional-modifier'
                                    callback: function(index) {
                                        // Alert button is closed!
                                        switch (index) {
                                            case 0:
                                                break;
                                            case 1:
                                                myNavigator.pushPage('pending_personal_inf.html', { animation: 'slide' });
                                                setUser(dr['username']);
                                                acceptedJourneySelected(oid);
                                                break;
                                        }
                                    }
                                });
                            });

                            resultObject['pending'] = d.pendingPassengers;
                        }

                        if (ch3 == false) {
                            resultObject['rejected'] = d.rejectedPassengers;
                        }

                        if (ch4 == false) {
                            resultObject['notes'] = d.notes;
                        }
                    } //if(d1['data']
                    callback(resultObject);
                });
            }
        } //if(localJourney)
    } //if(token)
} // This is a JavaScript file

function checkAcceptedJourneyUpdates(oid, callback) {
    var token = window.localStorage.getItem('token');
    if (token) {
        //get the journeys from localStorage
        var j = JSON.parse(window.localStorage.getItem('journeysAccepted'));
        if (j) {
            journeysAccepted = j;
        }

        if (journeysAccepted) {
            if (journeysAccepted[oid]) {
                var data = { access_token: token, collection: 'journeys', id: oid };
                getCollection(data, function(result) {
                    var resultObject = { pending: '', accepted: '', rejected: '', notes: '' };
                    var d1 = JSON.parse(result);

                    if (d1['data']) {
                        var d = d1['data'][0];

                        var ch1;
                        var ch2;
                        var ch3;
                        var ch4;

                        //if(d.acceptedPassengers && d.acceptedPassengers){
                        ch1 = arraysEqual(d.acceptedPassengers, journeysAccepted[oid].acceptedPassengers);
                        //}
                        //if(d.pendingPassengers && l.pendingPassengers){
                        ch2 = arraysEqual(d.pendingPassengers, journeysAccepted[oid].pendingPassengers);
                        //}
                        ch3 = arraysEqual(d.rejectedPassengers, journeysAccepted[oid].rejectedPassengers);

                        ch4 = d.notes === journeysAccepted[oid].notes;

                        if (ch1 == false) {
                            resultObject['accepted'] = d.acceptedPassengers;
                        }

                        if (ch2 == false) {
                            resultObject['pending'] = d.pendingPassengers;
                        }

                        if (ch3 == false) {
                            resultObject['rejected'] = d.rejectedPassengers;
                        }

                        if (ch4 == false) {
                            resultObject['notes'] = d.notes;
                        }
                    } //if(d1['data']
                    callback(resultObject);
                });
            }
        } //if(localJourney)
    } //if(token)
} // This is a JavaScript file

/*function checkJourneyUpdatesReturn(oid){
    var token=localStorage.getItem("token");
    
    if(token){
        //get the journeys from localStorage
        var j=JSON.parse(window.localStorage.getItem("journeys"));
        
        if(j){
            journeys=j;
        }       

        if(journeys[oid]){
            var data={"access_token": token,"collection":"journeys","id":oid};
            var ret=getCollection(data,function(result){return result;});
            
            console.log(ret);    
            var resultObject={"pending":"","accepted":""};
            var d1=JSON.parse(ret);
            
            if(d1['data']){
                var d=d1['data'][0];    
                var ch1; 
                var ch2;
                //if(d.acceptedPassengers && d.acceptedPassengers){              
                ch1=arraysEqual(d.acceptedPassengers,journeys[oid].acceptedPassengers);
                //}
                //if(d.pendingPassengers && l.pendingPassengers){
                ch2=arraysEqual(d.pendingPassengers,journeys[oid].pendingPassengers);
                //}
                if(ch1==false){
                    resultObject["accepted"]=d.acceptedPassengers;
                }
                
                if(ch2==false){
                    resultObject["pending"]=d.pendingPassengers;
                }  
            
            }//if(d1['data']            
            return(resultObject);
            
          
        }//if(localJourney)
    }//if(token)
}// This is a JavaScript file


function CheckUpdateForAllJourneys(callback){
    var jours = JSON.parse(localStorage.getItem("journeys"));
    var resultsObj={};
    var size=Object.keys(js).length;
    
    if (size==0){
        callback(resultsObj);  
    }else{
        if(jours){
            var counter=0;
            for(var i in jours){ 
                counter++;
                //console.log(i);
                resultsObj[i]="-";
                
                checkJourneyUpdates(i,function(r){
                    resultsObj[i]=r;
                    
                    if(counter==size){
                        callback(resultsObj);                
                    }
                });
            }
        }
    }
}*/

function loadUsersVehicles(callback) {
    var ajaxWorker_loadVeh = new Worker('js/ajax.js');
    var token = window.localStorage.getItem('token');
    var email = localStorage.getItem('email');
    var data = { access_token: token, email: email };
    var JSONdata = JSON.stringify(data);
    var url_getUsersVehicles = 'http://' + server + '/getUsersVehicles';
    if (token) {
        ajaxWorker_loadVeh.postMessage([url_getUsersVehicles, JSONdata]);

        ajaxWorker_loadVeh.onmessage = function(e) {
            if (e.data == 0 || e.data == 500) {
                alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
            } else {
                data = JSON.parse(e.data);
                callback(JSON.stringify(data));
            }

            ajaxWorker_loadVeh.terminate();
        };
    }
}

function loadVehicles() {
    var ajaxWorker_generateToken = new Worker('js/ajax.js');
    var key = window.localStorage.getItem('keyS');
    var secret = window.localStorage.getItem('secret');
    var token = '';
    var url_generateToken = 'http://' + server + '/generateToken';
    var JSONdata = '{"key":"' + key + '","secret":"' + secret + '"}';
    ajaxWorker_generateToken.postMessage([url_generateToken, JSONdata]);

    ajaxWorker_generateToken.onmessage = function(e) {
        var t = JSON.parse(e.data);
        token = t['access_token'];
        window.localStorage.setItem('token', token);

        loadUsersVehicles(function(data) {
            var vehs = {};
            var ve = JSON.parse(data);
            if (ve.data) {
                for (var i in ve['data']) {
                    var oid = ve['data'][i]['_id']['$id'];
                    vehs[oid] = ve['data'][i];
                }
            }
            vehicles = vehs;
            window.localStorage.setItem('vehicles', JSON.stringify(vehicles));
            if (debug) {
                console.log('vehicles loaded');
            }
            //if(ve.data){
            //vehicles=ve.data;
            //window.localStorage.setItem("vehicles", JSON.stringify(vehicles));
            //if(debug){
            //    console.log("vehicles loaded");
            //}
            //}
        });

        ajaxWorker_generateToken.terminate();
    };
}

function killJourneyMatcher() {
    journeyMatcher.terminate();
    delete journeyMatcher;
}

/* SHOULD NOT BE USED, MAY CAUSE TROUBLE ON CONFLICTING IDs*/
/*function findMatchingJourney(journeyOid){
    var jour=JSON.parse(window.localStorage.getItem("journeys"));
    
    if(jour){
        if(jour[journeyOid]){
            var j=jour[journeyOid];    
            var token=window.localStorage.getItem("token");
            journeyMatcher.postMessage([server,token,j,20000,radius,window.localStorage.getItem('email')]);
            journeyMatcher.onmessage=function(e){        

                //console.log((e.data));

                journeysMatching[journeyOid]=[];
                var t=JSON.parse(e.data);
                if(t){
                    var d=t.data;
                    if(d){
                        
                        console.log("Matching has been found for journey:"+journeyOid);
                        for(var i in d){
                        var journ=d[i];
                        journeysMatching[journeyOid].push(journ);
                        }
                    }
                }
            };
        }
    }
}*/

var calculateDistance = function(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

async function findMatchingJourneyForAll() {
    var jours = JSON.parse(window.localStorage.getItem('journeys'));

    var joursArray = [];
    if (jours) {
        //Construct the joursArray
        for (var i in jours) {
            if (jours[i].acceptedPassengers.length == 0) {
                joursArray.push(jours[i]);
            }
        }

        // let journeysGet = {};
        var EmailSession = window.localStorage.getItem("Email Session");
        var clientTime = Math.floor(Date.now() / 1000);
        console.log(radius);
        console.log(joursArray);

        try {
            res = await axios.get('/GetJourneysForAll', {
                params: {
                    email: EmailSession,
                    time: clientTime,
                    radius: radius,
                    joursArray: joursArray
                }
            })
            console.log(res);
            console.log("Hey!");
            console.log("Res.data is" + res.data);
            // var journeysGet = JSON.parse(res.data);
            var journeysGet = res.data;
            console.log("JourneysGet is" + journeysGet);
        } catch (e) {
            console.log(e)
        }

        var data = journeysGet;
        console.log("Data is" + data);
        if (data) {
            var j = data;

            var onRej = onRejected(j);
            var onAcc = onAccepted(j);
            var onAcc2 = onAccepted2(j);

            if (onAcc != -1) {
                for (var r in onAcc) {
                    checkIfAccepted(j[onAcc[r][0]][onAcc[r][1]], onAcc[r][2], onAcc[r][0]);
                }
            }

            if (onAcc2 != -1) {
                for (var r in onAcc2) {
                    delete j[onAcc2[r][0]][onAcc2[r][1]];
                }
            }

            if (onRej != -1) {
                for (var r in onRej) {
                    checkIfRejected(j[onRej[r][0]][onRej[r][1]], onRej[r][2]);
                    delete j[onRej[r][0]][onRej[r][1]];
                }
            }

            if (Object.size(j) > Object.size(journeysMatching)) {
                ons.notification.alert({
                    message: 'Matches found: ' + (Object.size(j) - Object.size(journeysMatching)),
                    // or messageHTML: '<div>Message in HTML</div>',
                    title: 'New Matches',
                    buttonLabel: 'OK',
                    animation: 'default', // or 'none'
                    // modifier: 'optional-modifier'
                    callback: function() {
                        // Alert button is closed!
                    }
                });

                if (Object.size(journeysMatching) > 0) {
                    document.getElementById('journeyNotification').innerHTML = Object.size(journeysMatching);
                }

                journeysMatching = j;
                //console.log(JSON.stringify(data));
            }
        }

    }
}

// OLD FUNCTION

// function findMatchingJourneyForAll() {
//     var jours = JSON.parse(window.localStorage.getItem('journeys'));

//     var joursArray = [];
//     if (jours) {
//         //Construct the joursArray
//         for (var i in jours) {
//             if (jours[i].acceptedPassengers.length == 0) {
//                 joursArray.push(jours[i]);
//             }
//         }
//         //console.log(joursArray);
//         var data = {
//             access_token: window.localStorage.getItem('token'),
//             clientTime: Math.floor(Date.now() / 1000),
//             object: joursArray,
//             radius: radius,
//             user: window.localStorage.getItem('email')
//         };
//         var JSONdata = JSON.stringify(data);
//         //console.log(JSONdata);
//         var url_getJourneysForAll = 'http://' + server + '/getJourneysForAll';
//         var ajaxWorker_getJourneysForAll = new Worker('js/ajax.js');
//         ajaxWorker_getJourneysForAll.postMessage([url_getJourneysForAll, JSONdata]);

//         ajaxWorker_getJourneysForAll.onmessage = function(e) {
//             if (e.data == 0 || e.data == 500) {
//                 alert('A network error occurred when trying communicate with the server. Please try again.', 'Error');
//             } else {
//                 data = JSON.parse(e.data);
//                 if (data.data) {
//                     var j = data.data;

//                     var onRej = onRejected(j);
//                     var onAcc = onAccepted(j);
//                     var onAcc2 = onAccepted2(j);

//                     if (onAcc != -1) {
//                         for (var r in onAcc) {
//                             checkIfAccepted(j[onAcc[r][0]][onAcc[r][1]], onAcc[r][2], onAcc[r][0]);
//                         }
//                     }

//                     if (onAcc2 != -1) {
//                         for (var r in onAcc2) {
//                             delete j[onAcc2[r][0]][onAcc2[r][1]];
//                         }
//                     }

//                     if (onRej != -1) {
//                         for (var r in onRej) {
//                             checkIfRejected(j[onRej[r][0]][onRej[r][1]], onRej[r][2]);
//                             delete j[onRej[r][0]][onRej[r][1]];
//                         }
//                     }

//                     if (Object.size(j) > Object.size(journeysMatching)) {
//                         ons.notification.alert({
//                             message: 'Matches found: ' + (Object.size(j) - Object.size(journeysMatching)),
//                             // or messageHTML: '<div>Message in HTML</div>',
//                             title: 'New Matches',
//                             buttonLabel: 'OK',
//                             animation: 'default', // or 'none'
//                             // modifier: 'optional-modifier'
//                             callback: function() {
//                                 // Alert button is closed!
//                             }
//                         });
//                     }

//                     if (Object.size(journeysMatching) > 0) {
//                         document.getElementById('journeyNotification').innerHTML = Object.size(journeysMatching);
//                     }

//                     journeysMatching = j;
//                     //console.log(JSON.stringify(data));
//                 }
//             }

//             ajaxWorker_getJourneysForAll.terminate();
//         };
//     }
// }

function removeOldJourneys() {
    var jour = JSON.parse(window.localStorage.getItem('journeys'));
    var acceptedjour = JSON.parse(window.localStorage.getItem('journeysAccepted'));
    var pendingjour = JSON.parse(window.localStorage.getItem('journeysPending'));

    if (jour) {
        for (var i in jour) {
            var now = Math.floor(Date.now() / 1000);
            if (now > jour[i].schedule) {
                delete jour[i];
                if (debug) {
                    console.log('journey:' + i + ' has been deleted');
                }
            }
            window.localStorage.setItem('journeys', JSON.stringify(jour));
        }
    }

    if (acceptedjour) {
        for (var i in acceptedjour) {
            var now = Math.floor(Date.now() / 1000);
            if (now > acceptedjour[i].schedule) {
                delete acceptedjour[i];
                if (debug) {
                    console.log('accepted journey:' + i + ' has been deleted');
                }
            }
            window.localStorage.setItem('journeysAccepted', JSON.stringify(acceptedjour));
        }
    }

    if (pendingjour) {
        for (var i in pendingjour) {
            var now = Math.floor(Date.now() / 1000);
            if (now > pendingjour[i].schedule) {
                delete pendingjour[i];
                if (debug) {
                    console.log('pending journey:' + i + ' has been deleted');
                }
            }
            window.localStorage.setItem('journeysPending', JSON.stringify(pendingjour));
        }
    }
}

/*function findMatchesForEachJourney(){
    var jour=JSON.parse(window.localStorage.getItem("journeys"));    
    
    if(jour){
        for(var i in jour){
            //console.log(i+"->"+JSON.stringify(jour[i]));
            findMatchingJourney(i);
        }
    }
}*/

function startIntervalJourneyUpdates(oid) {
    var int = setInterval(function() {
        var j = JSON.parse(window.localStorage.getItem('journeys'));
        if (j) {
            if (j[oid]) {
                var l = j[oid];
                var ac = l.acceptedPassengers;
                var pen = l.pendingPassengers;
                var rej = l.rejectedPassengers;
                var not = l.notes;

                checkJourneyUpdates(oid, function(d) {
                    if (d.accepted) {
                        ac = d.accepted;
                    }
                    if (d.pending) {
                        pen = d.pending;
                    }
                    if (d.rejected) {
                        rej = d.rejected;
                    }
                    if (d.notes) {
                        not = d.notes;
                    }
                    updateJourneyInf(oid, ac, pen, rej, not);
                    if (debug) {
                        //console.log("Journey:"+oid+" has been checked for updates");
                    }
                });
            }
        }
        //checkIfAccepted();
    }, checkJourneyChanges);
}

function startIntervalAcceptedJourneyUpdates(oid) {
    var int = setInterval(function() {
        var j = JSON.parse(window.localStorage.getItem('journeysAccepted'));
        if (j) {
            if (j[oid]) {
                var l = j[oid];
                var ac = l.acceptedPassengers;
                var pen = l.pendingPassengers;
                var rej = l.rejectedPassengers;
                var not = l.notes;

                checkAcceptedJourneyUpdates(oid, function(d) {
                    if (d.accepted) {
                        ac = d.accepted;
                    }
                    if (d.pending) {
                        pen = d.pending;
                    }
                    if (d.rejected) {
                        rej = d.rejected;
                    }
                    if (d.notes) {
                        not = d.notes;
                    }

                    updateAcceptedJourneyInf(oid, ac, pen, rej, not);
                    if (debug) {
                        //console.log("Accepted Journey:"+oid+" has been checked for updates");
                    }
                });
            }
        }
        //checkIfAccepted();
    }, checkJourneyChanges);
}

function startIntervalsForEachLocalJourney() {
    var jour = JSON.parse(window.localStorage.getItem('journeys'));

    if (jour) {
        for (var i in jour) {
            //console.log(i);
            startIntervalJourneyUpdates(i);
        }
    }
}

function startIntervalsForEachAcceptedJourney() {
    var jour = JSON.parse(window.localStorage.getItem('journeysAccepted'));

    if (jour) {
        for (var i in jour) {
            //console.log(i);
            startIntervalAcceptedJourneyUpdates(i);
        }
    }
}

function startIntervalForMessages() {
    setInterval(function() {
        onGetMessages();
    }, checkForMessages);
}

function startIntervalForGetSentMessages() {
    setInterval(function() {
        onGetSentMessages();
    }, checkForMessages);
}

function startIntervalForFindMatchingJourneys() {
    setInterval(function() {
        findMatchingJourneyForAll();
    }, checkJourneyJoinsInterval);
}

function scrollTo(element, to, duration) {
    if (duration < 0) return;
    var difference = to - element.scrollTop;
    var perTick = (difference / duration) * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

function scrollToBottom(page) {
    scrollTo(page, document.body.scrollHeight, 300);
}

function rotateBase64Image(base64ImageSrc) {
    var canvas = document.createElement('canvas');
    var img = new Image();
    img.src = document.getElementById(base64ImageSrc).src;
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d');
    context.translate(img.width, img.height);
    context.rotate((180 * Math.PI) / 180);
    context.drawImage(img, 0, 0);
    document.getElementById(base64ImageSrc).src = canvas.toDataURL();
}