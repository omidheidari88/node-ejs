const express = require('express');
var expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const sessionFileStore = require('session-file-store')(session);
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
const {passportLocalRegister, passportLocalLogin, passportGoogle} = require('../modules/auth/passport');
const {flashMessages, authenticate} = require('../modules/auth/middleware');
module.exports = (app) => {
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use(cors());
	app.use(cookieParser('SecretID'));
	app.use(
		session({
			secret: 'SecretID',
			resave: false,
			saveUninitialized: true,
			// store: new sessionFileStore({}),
			// store: new MongoStore({mongooseConnection: mongoose.connection}),
			cookie: {secure: false},
		}),
	);
	passportLocalRegister();
	passportLocalLogin();
	passportGoogle();
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use((req, res, next) => {
		flashMessages(req, res, next);
	});
	app.use((req, res, next) => {
		authenticate(req, res, next);
	});
	app.use(passport.initialize());
	app.use(passport.session());
};
