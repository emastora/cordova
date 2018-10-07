const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function(passport) {
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Signup
    passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },

            function(req, email, password, done) {
                User.findOne({ 'local.email': email }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'the email is already taken'));
                    } else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.name = req.body.name;
                        newUser.local.surname = req.body.surname;
                        newUser.local.occupation = req.body.occupation;
                        newUser.local.interests = req.body.interests;
                        newUser.local.music = req.body.music;
                        console.log('Smoker is ', req.body.smoker);
                        newUser.local.smoker = req.body.smoker;
                        newUser.local.birthDate = req.body.birthdate;

                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            console.log('The user is ', newUser);
                            return done(null, newUser);
                        });
                    }
                });
            }
        )
    );

    // login
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local
    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, email, password, done) {
                User.findOne({ 'local.email': email }, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'No User found'));
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Wrong Password'));
                    }

                    return done(null, user);
                });
            }
        )
    );
};