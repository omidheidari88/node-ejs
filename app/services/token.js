const jwt = require('jsonwebtoken');
exports.sign = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET);
};
exports.verify = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		console.log(error);
	}
};
exports.findToken = (req) => {
	// const {authorization} = req.headers;

	// Object.keys(req.headers).includes('authorization')
	// if (!('authorization' in req.headers)) {
	// 	return false;
	// }
	const authorization = req.session.token;
	if (!authorization) {
		return false;
	}
	const [bearer, token] = authorization.split(' ');
	if (!token) {
		return false;
	}
	return token;
};
