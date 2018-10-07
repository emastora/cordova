/*var person = {
    oid:"",
    name:"",
    surname:"",
    email:"",
    birthDate:"",
    occupation:"",
    interests:"",
    music:"",
    smoker:"",
    imagePath:"images/user.png",
    rating:""
};*/

/*var journey = {
    oid:"",
    mode:"",
    departureAddress:"",
    departureLat:"",
    departureLng:"",
    destinationAddress:"",
    destinationLat:"",
    destinationLng:"",
    schedule:"",
    distance:"",
    journeyDuration:"",
    acceptedPassengers:[],
    pendingPassengers:[]
};*/

/*var vehicle = {
    oid:"",
    brand:"",
    model:"",
    seats:"",
    color:"",
    licencePlate:"",
    year:"",
    cc:"",
    aircondition:"",
    imagePath:"images/vehicle.png"
};*/

// person constructor
// function person(oid, name, surname, email, password, birthDate, occupation, interests, music, smoker, imagePath, trustLevel, role, project, credits) {
//     this.oid = oid;
//     this.name = name;
//     this.surname = surname;
//     this.username = email;
//     this.password = password;
//     this.birthDate = birthDate;
//     this.occupation = occupation;
//     this.interests = interests;
//     this.music = music;
//     this.smoker = smoker;
//     this.imagePath = imagePath;
//     this.trustLevel = trustLevel;
//     this.role = role; // This is necessary for harmonize with LTR
//     this.project = project;
//     this.credits = credits;
// }

function person(
    name,
    surname,
    email,
    birthDate,
    occupation,
    interests,
    music,
    smoker,
    imagePath,
    trustLevel,
    role,
    project,
    credits
) {
    // this.oid = oid;
    this.name = name;
    this.surname = surname;
    this.email = email;
    // this.username = email;
    // this.password = password;
    this.birthDate = birthDate;
    this.occupation = occupation;
    this.interests = interests;
    this.music = music;
    this.smoker = smoker;
    // this.imagePath = imagePath;
    // this.trustLevel = trustLevel;
    // this.role = role; // This is necessary for harmonize with LTR
    // this.project = project;
    // this.credits = credits;
}

person.prototype.getOid = function() {
    return this.oid;
};

person.prototype.setOid = function(oid) {
    this.oid = oid;
};

person.prototype.setImage = function(imgPath) {
    this.imagePath = imgPath;
};

person.prototype.getImage = function() {
    return this.imagePath;
};

person.prototype.getTrustLevel = function() {
    return this.trustLevel;
};

person.prototype.setTrustLevel = function(tl) {
    this.trustLevel = tl;
};

// vehicle constructor
function vehicle(owner, brand, model, seats, color, licencePlate, year, cc, aircondition, petsAllowed) {
    // this.oid = oid;
    this.owner = owner;
    this.brand = brand;
    this.model = model;
    this.seats = seats;
    this.color = color;
    this.licencePlate = licencePlate;
    this.year = year;
    this.cc = cc;
    this.aircondition = aircondition;
    this.petsAllowed = petsAllowed;
    // this.imagePath = imagePath;
}

vehicle.prototype.getOid = function() {
    return this.oid;
};

vehicle.prototype.setOid = function(oid) {
    this.oid = oid;
};

vehicle.prototype.setImage = function(imgPath) {
    this.imagePath = imgPath;
};

vehicle.prototype.getImage = function() {
    return this.imagePath;
};

// journey constructor
function journey(
    requester,
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
) {
    this.requester = requester;
    this.oid = oid;
    this.vehicle = vehicle;
    this.driver = driver;
    this.mode = mode;
    this.departureAddress = departureAddress;
    this.departureLat = departureLat;
    this.departureLng = departureLng;
    this.destinationAddress = destinationAddress;
    this.destinationLat = destinationLat;
    this.destinationLng = destinationLng;
    this.schedule = schedule;
    this.distance = distance;
    this.journeyDuration = journeyDuration;
    this.acceptedPassengers = acceptedPassengers;
    this.pendingPassengers = pendingPassengers;
    this.rejectedPassengers = rejectedPassengers;
    this.waypoints = waypoints;
    this.seatsAvailable = seatsAvailable;
    this.notes = notes;
}

journey.prototype.getOid = function() {
    return this.oid;
};

journey.prototype.setOid = function(oid) {
    this.oid = oid;
};

journey.prototype.setAcceptedPassenges = function(array) {
    this.acceptedPassengers = array;
};

journey.prototype.setPendingPassengers = function(array) {
    this.pendingPassengers = array;
};

journey.prototype.setRejectedPassengers = function(array) {
    this.rejectedPassengers = array;
};

journey.prototype.setDriver = function(driver) {
    this.driver = driver;
};

journey.prototype.setSeatsAvailable = function(seats) {
    this.seatsAvailable = seats;
};

journey.prototype.setVehicle = function(veh) {
    this.vehicle = veh;
};

journey.prototype.setNotes = function(not) {
    this.notes = not;
};

//The message prototype
function message(oid, from, to, text, time, read) {
    this.oid = oid;
    this.from = from;
    this.to = to;
    this.text = text;
    this.time = time;
    this.read = read;
}

message.prototype.setOid = function(oid) {
    this.oid = oid;
};

message.prototype.setTime = function(time) {
    this.time = time;
};

message.prototype.setRead = function(read) {
    this.read = read;
};

var locationObject = {
    userLatitude: '',
    userLongitude: '',
    accuracy: '',
    heading: '',
    speed: '',
    time: ''
};

//var server="83.212.168.47/slim/API/carpooling";
// var server="160.40.50.60/slim/API/carpooling";
// var server = "http://localhost:3000/slim/API/";
var server = 'localhost:3000';
var scheduleLimitInDays = 31;
var journeys = {};
var vehicles = {};
var journeysPending = {};
var journeysAccepted = {};
var journeysMatching = {};
var messagesSent = {};
var messagesReceived = {};
var map = null;
var journey_map = null;
var marker = null;
var destMarker = null;
var control = null;
var journeyControl = null;
var journey_control = null;
var bingKey = 'Ak_S8Tc2YoCDJrVGllgMA4XE9zEmJBlvaY1rsJEmxLafxlb3Yv_jHjVURPjEZLqK';
var ajaxWorker = new Worker('js/ajax.js');
var homeAddress = null;
var destAddress = null;
var totalDist = null;
var totalTime = null;
var schedule = null;
var journeyWaypoints = null;
var mode = null;
var journeyVehicle = null;
// var selectedJourney = '';
var selectedJourney = "58f87961f7cf66592528a6b5";
var selectedMatchingJourneyI = '';
var selectedMatchingJourneyJ = '';
var seatsAvailable = null;
var user = null;
var uVehicle = null;
var imageBase64 = '';
var radius = 50;
var checkJourneyJoinsInterval = 60000;
var checkJourneyChanges = 20000;
var checkIfAcceptedInterval = 20000;
var checkIfRejectedInterval = 20000;
var checkForMessages = 20000;
var rejected;
var unreadMessages = 0;

var debug = true;
var journeyMatcher = new Worker('js/journeyMatchDM.js');