const {findBy, registerUser} = require('./model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {hashingPassword, verifyHashedPassword, getRes} = require('./middleware');
const passport = require('passport');
const {sign} = require('../../services/token');
exports.passportLocalRegister = () => {
	passport.use(
		'local-register',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			async (req, email, password, done) => {
				const findingUser = await findBy('email', email);
				if (findingUser) {
					return done(null, false, req.flash('errors', 'the email is already registered'));
				}
				const user = {
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					email,
					password,
					confpass: req.body.confpass,
				};
				await hashingPassword(user);
				const registeredUser = await registerUser(user);
				if (registeredUser.affectedRows < 1) {
					return done(null, false, req.flash('errors', 'user can not register/please try later'));
				}
				const userRegistered = await findBy('id', registeredUser.insertId);
				return done(null, userRegistered, req.flash('success', 'you are successfully registered'));
			},
		),
	);
	passport.serializeUser((user, done) => {
		return done(null, user.id);
	});
	passport.deserializeUser(async (id, done) => {
		const user = await findBy('id', id);
		return done(null, user);
	});
};
exports.passportLocalLogin = () => {
	passport.use(
		'local-login',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			async (req, email, password, done) => {
				const user = await findBy('email', email);
				if (!user) {
					return done(null, false, req.flash('errors', 'email is incorrect'));
				}
				const comparepass = await verifyHashedPassword(password, user.password);
				if (!comparepass) {
					return done(null, false, req.flash('errors', 'password is incorrect'));
				}
				const token = sign({uid: user.id, is_admin: user.is_admin});
				if (!token) {
					return done(null, false, req.flash('errors', "you don't have token access"));
				}
				req.session.token = `bearer ${token}`;
				req.session.user = user;
				req.session.admin = user.is_admin;
				return done(null, user);
			},
		),
	);
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		const user = await findBy('id', id);
		return done(null, user);
	});
};

exports.passportGoogle = () => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CONSUMER_KEY,
				clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
				callbackURL: process.env.GOOGLE_CALLBACK,
			},
			async (accessToken, refreshToken, profile, done) => {
				const userFind = await findBy('email', profile.emails[0].value);
				if (userFind) {
					// req.session.user = user;
					return done(null, userFind);
				}

				const user = {
					first_name: profile.name.givenName,
					last_name: profile.name.familyName,
					email: profile.emails[0].value,
					password: profile.id,
					confpass: profile.id,
				};

				await hashingPassword(user);
				const registeredUser = await registerUser(user);

				if (registeredUser.affectedRows < 1) {
					return done(null, false);
				}
				const userRegistered = await findBy('id', registeredUser.insertId);
				return done(null, userRegistered);
			},
		),
	);
};
