const {findToken, verify} = require('../../services/token');
const {check} = require('express-validator');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const bcrypt = require('bcryptjs');
const path = require('path');
const passport = require('passport');
exports.authMiddleware = (req, res, next) => {
	const token = findToken(req);
	if (!token) {
		return res.status(401).send({
			success: false,
			message: "you don't have access to admin pannel please login as an admin",
		});
	}
	const verifyToken = verify(token);
	if (!verifyToken) {
		return res.status(401).send({
			success: false,
			message: "you don't have verify option",
		});
	}
	return next();
};

exports.isAdmin = (req, res, next) => {
	const token = findToken(req);
	const {is_admin} = verify(token);
	if (is_admin > 0) {
		return next();
	} else {
		return res.status(403).send({
			success: false,
			message: 'just admin have access',
		});
	}
};

exports.registerValidator = [check('email').isEmail().withMessage('email has to have @ in it'), check('password').isLength({min: 2}).withMessage('password should be at least 1 characters'), check('first_name').isLength({min: 3}).withMessage('first name should be at least 3 characters')];
exports.loginValidator = [check('email').isEmail().withMessage('email has to have @ in it'), check('password').isLength({min: 2}).withMessage('password should be at least 1 characters')];
exports.courseValidator = [
	check('title').isLength({min: 2}).withMessage('title must be more than 2 characters'),
	check('descript').not().isEmpty().withMessage('description can not be emty'),
	check('price').not().isEmpty().withMessage('Enter the Price'),
	check('time').matches('^([0-9]|0[0-9]|9[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$').withMessage('Time Format is Invalid'),

	check('images').custom(async (image, {req}) => {
		if (req.query.method === 'POST' && image === undefined) {
			return;
		}
		// if (!image) {
		// 	throw new Error('please select the image');
		// }
		// else {
		// 	const formats = ['.png', '.jpg', '.svg'];
		// 	if (!formats.includes(path.extname(image))) {
		// 		throw new Error('format is not valid,acceptable format:PNG/JPG/JPEG/SVG');
		// 	}
		// }
	}),
];

exports.googleRecaptcha = () => {
	const siteKey = '6LckTPQUAAAAAM3A3jEKo7JDv6wOXm_tMUlw801P';
	const secretKey = '6LckTPQUAAAAAEgkJrewtG9mLVwWMIfzKiJicoKR';
	var options = {hl: 'en'};
	const recaptcha = new Recaptcha(siteKey, secretKey, options);
	return recaptcha;
};
exports.verifyRecaptcha = (req, res, recaptcha) => {
	return new Promise((resolve, reject) => {
		recaptcha.verify(req, (error) => {
			if (error) {
				// messages.push('check robot box');
				// req.flash('errors', messages);
				// res.redirect('/auth/register');
				resolve(false);
			}
			resolve(true);
		});
	});
};
exports.hashingPassword = async (user) => {
	// bcrypt.genSalt(10, (err, salt) => {
	// 	bcrypt.hash(password, salt, (err, hash) => {
	// 		if (err) throw err;
	// 		return hash;
	// 	});
	// });
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(user.password, salt);
	user.password = hash;
	return user;
};
exports.verifyHashedPassword = async (password, userpassword) => {
	return bcrypt.compare(password, userpassword); // true
};

exports.flashMessages = (req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.errors = req.flash('errors');
	next();
};

// az in method jaiee use nakardam faghat khastam neshun bedam in check alan dar samte view dar dastress has . example in view : if(check){you don not have access to view this page}
exports.authenticate = (req, res, next) => {
	res.locals.check = req.isAuthenticated();
	next();
};
