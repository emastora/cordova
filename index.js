const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
require('./www/app/models/user');
require('./www/app/models/vehicle');
require('./www/app/models/journey');

const { url } = require('./www/config/database.js');

mongoose.connect(url);

require('./www/config/passport')(passport);

// static files
app.use(express.static(path.join(__dirname, 'www')));

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'www/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// required for passport
app.use(
    session({
        secret: 'faztwebtutorialexample',
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
require('./www/app/routes.js')(app, passport);

// start the server
app.listen(app.get('port'), () => {
    console.log('server on port ', app.get('port'));
});