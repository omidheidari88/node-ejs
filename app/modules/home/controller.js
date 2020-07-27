const {taskModel, courseModel} = require('./model');
const {totalPrice} = require('../admin/model');
exports.home = async (req, res) => {
	// if (!('token' in req.session)) {
	// 	return res.redirect('/auth/login');
	// }

	const courses = await courseModel();
	const total = await totalPrice();
	req.session.courses = courses;
	req.session.price = total;
	const tasks = await taskModel();
	res.render('tasks/list', {tasks, user: req.session.user, courses: req.session.courses, admin: req.session.admin, price: req.session.price});
};
exports.adminPannel = async (req, res) => {
	res.render('admin/index', {user: req.session.user});
};
