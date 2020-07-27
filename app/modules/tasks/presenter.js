const {convertToPersianNumber} = require('../../services/lang');

exports.removePassword = (user) => {
	delete user.password;
	return user;
};
exports.addFullname = (user) => {
	user.full_name = `${user.first_name} ${user.last_name}`;
	return user;
};

exports.removeAdminFlag = (user) => {
	delete user.is_admin;
	return user;
};
exports.persianMobile = (user) => {
	user.mobile = convertToPersianNumber(user.mobile);
	return user;
};
