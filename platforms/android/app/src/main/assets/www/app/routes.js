const Mongoose = require('mongoose');
const User = Mongoose.model('User');
const Car = Mongoose.model('Car');
const Journey = Mongoose.model('Journey');

module.exports = (app, passport) => {

    // index routes
    app.get('/', (req, res) => {
        res.render('index');
    });

    //login view
    app.get('/login', (req, res) => {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/CarPoolingIndex',
        failureRedirect: '/login',
        failureFlash: true
    }));


    // signup view
    app.get('/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/CarPoolingIndex',
        failureRedirect: '/signup',
        failureFlash: true // allow flash messages
    }));

    //profile view
    //    app.get('/profile', isLoggedIn, (req, res) => {
    //        res.render('profile', {
    //            user: req.user
    //        });
    //	});

    app.get('/CarPoolingIndex', isLoggedIn, (req, res) => {

        // res.send('Hello World');
        res.render('CarPoolingIndex', {
            user: req.user
        });
    });


    // logout
    app.get('/logout', (req, res) => {
        req.logout();
        // successRedirect: '/'
        res.redirect('/');
        // res.render('index');
    });

    // app.get('/map', (req, res) => {
    //     res.render('map.ejs', {
    //         message: req.flash('loginMessage')
    //     });
    // });

    // app.get('/GetUser', (req, res) => {
    //     // req.logout();
    //     // res.redirect('/');

    //     User.findOne({ 'local.email': req.params.Iden }, function(err, user) {
    //         if (err) {
    //             res.send(err);
    //             // console.log(req);
    //             // console.log(res.status);
    //         } else if (user) {
    //             res.json(User);
    //             console.log("brika user blaks");
    //             // console.log(res);
    //             // console.log(res.body);
    //         } else
    //             console.log("Paparia")
    //     });
    // });

    app.get('/GetUser', async(req, res) => {
        try {
            const user = await User.findOne({ 'local.email': req.query.email }).lean()
            console.log('/GetUser', user)
            res.json(user);
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    });

    // app.post('/UpdateUser', async(req, res) => {
    //     try {
    //         const user = await User.findOne({ 'local.email': req.body.email }).lean();
    //         console.log('/UpdateUser found', user)
    //         user = await User.update({ 'local.name': req.body.name, 'local.surname': req.body.surname }).lean()
    //         console.log('/UpdateUser updated', user)
    //         res.json({ data: user, message: 'User updated!' })
    //     } catch (e) {
    //         console.log(e)
    //         res.send(e)
    //     }
    // });

    app.post('/UpdateUser', (req, res) => {

        User.findOne({ 'local.email': req.body.email }, function(err, user) {
            if (err) {
                console.log(req);
                console.log(res.status);
                // return done(err);
            } else if (user) {
                console.log(req.body);
                user.update({
                        'local.name': req.body.name,
                        'local.surname': req.body.surname,
                        'local.birthDate': req.body.birthdate,
                        'local.occupation': req.body.occupation,
                        'local.interests': req.body.interests,
                        'local.music': req.body.music,
                        'local.smoker': req.body.smoker
                    },

                    function(err) {
                        if (err)
                            console.log('error')
                        else
                            console.log('success')
                        res.json({ message: 'User updated!' })
                    });
            }
        })
    });

    app.get('/GetVehicle', async(req, res) => {
        try {
            const car = await Car.findOne({ 'local.owner': req.query.email }).lean()
            console.log('/GetCar', car)
            res.json(car);
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    });


    app.post('/CreateVehicle', (req, res) => {

        var newVehicle2 = new Car();
        console.log(req.body);
        newVehicle2.local.owner = req.body.owner;
        newVehicle2.local.brand = req.body.brand;
        newVehicle2.local.model = req.body.model;
        newVehicle2.local.seats = req.body.seats;
        newVehicle2.local.color = req.body.color;
        newVehicle2.local.licencePlate = req.body.licencePlate;
        newVehicle2.local.year = req.body.year;
        newVehicle2.local.cc = req.body.cc;
        newVehicle2.local.aircondition = req.body.aircondition;
        newVehicle2.local.petsAllowed = req.body.petsAllowed;

        newVehicle2.save(function(err) {
            if (err) {
                throw err;
            }
            res.json({ message: 'Vehicle created!' });
        });

    });

    app.post('/UpdateVehicle', (req, res) => {

        Car.findOne({ 'local.owner': req.body.owner }, function(err, car) {
            if (err) {
                console.log(req);
                console.log(res.status);
                // return done(err);
            } else if (car) {
                console.log(req.body);
                car.update({
                        'local.brand': req.body.brand,
                        'local.model': req.body.model,
                        'local.seats': req.body.seats,
                        'local.color': req.body.color,
                        'local.licencePlate': req.body.licencePlate,
                        'local.year': req.body.year,
                        'local.cc': req.body.cc
                    },

                    function(err) {
                        if (err)
                            console.log('error')
                        else
                            console.log('success')
                        res.json({ message: 'Car updated!' })
                    });
            }
        })
    });

    app.post('/CreateJourney', (req, res) => {

        var journey2 = new Journey();
        console.log(req.body);
        journey2._id = req.body.oid;
        journey2.local.requester = req.body.requester;
        journey2.local.vehicle = req.body.vehicle;
        journey2.local.driver = req.body.driver;
        journey2.local.mode = req.body.mode;
        journey2.local.departureAddress = req.body.departureAddress;
        journey2.local.departureLat = req.body.departureLat;
        journey2.local.departureLng = req.body.departureLng;
        journey2.local.schedule = req.body.schedule;
        journey2.local.distance = req.body.distance;
        journey2.local.acceptedPassengers = req.body.acceptedPassengers;
        journey2.local.pendingPassengers = req.body.pendingPassengers;
        journey2.local.rejectedPassengers = req.body.rejectedPassengers;
        journey2.local.waypoints = req.body.waypoints;
        journey2.local.seatsAvailable = req.body.seatsAvailable;
        journey2.local.notes = req.body.notes;

        journey2.save(function(err) {
            if (err) {
                throw err;
            }
            res.json({ message: 'Journey created!' });
        });

    });

    app.get('/GetJourney', async(req, res) => {
        try {
            const journe = await Journey.findOne({ 'local.requester': req.query.email }).lean()
            console.log('/GetJourney', journe)
            res.json(journe);
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    });


    app.get('/GetJourneysForAll', async(req, res) => {
        try {
            const journeyAll = await Journey.find({ 'local.schedule': { $gte: req.query.time }, 'local.driver': { $ne: req.query.email } }).lean();
            // console.log('/GetJourneysForAll', journeyAll)
            console.log("Journey All are" + journeyAll);
            console.log("Journey Array are" + req.query.joursArray);
            var journeyMatch = [];

            if (typeof journeyAll == 'undefined' || journeyAll.length == 0) {
                console.log('No matching journeys found');
            } else {
                for (var i in req.query.joursArray) {
                    for (var k in journeyAll) {
                        if (Math.abs(journeyAll[k].schedule - req.query.joursArray[i].schedule) < 43200) {
                            var distance1 = calculateDistance(req.query.joursArray[i].departureLat, req.query.joursArray[i].departureLng, journeyAll[k].departureLat, journeyAll[k].departureLng);
                            console.log("Distance1 is " + distance1);
                            if (distance1 <= req.query.radius) {
                                var distance2 = calculateDistance(req.query.joursArray[i].destinationLat, req.query.joursArray[i].destinationLng, journeyAll[k].destinationLat, journeyAll[k].destinationLng)
                                if (distance2 <= req.query.radius) {
                                    console.log("Distance2 is " + distance2);
                                    journeyMatch.push(journeyAll[k]);

                                    console.log("journeyMatch is " + journeyMatch);
                                }

                            }

                        }

                    }

                }

            }
            res.json(journeyMatch);
            console.log("JourneyMatch is " + journeyMatch);
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    });


};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}