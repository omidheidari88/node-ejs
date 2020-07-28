const {save, courseModel, deleteTask, findBy, update, totalCourse} = require('./model');
const {validationResult} = require('express-validator');
const fs = require('fs');

exports.adminPannel = async (req, res) => {
	res.render('admin/index');
};
exports.store = async (req, res) => {
	let course = {
		title: req.body.title,
		type: req.body.type,
		time: req.body.time,
		descript: req.body.descript,
		images: req.body.images,
		price: req.body.price,
		tags: req.body.tags,
	};
	const messages = [];
	const result = validationResult(req);
	const errors = result.array();
	errors.forEach((err) => messages.push(err.msg));
	if (messages.length > 0) {
		return res.render('admin', {messages});
	} else {
		const saveCourses = await save(course);
		const courses = await courseModel();
		courses.forEach(async (course) => {
			await totalCourse(course.course_id);
		});
		courses.forEach(async (course) => {
			const totalTime = await require('./middleware').updateTime(courses);
			await update(course.course_id, {total_time: totalTime});
		});
		req.session.courses = courses;
		res.cookie('saveCourses', saveCourses, {httpOnly: true}).redirect('/');
	}
};

exports.showEditCourse = async (req, res) => {
	const id = req.params.id;
	const course = await findBy('course_id', id);

	res.render('admin/edit', {course});
};
exports.updateCourse = async (req, res) => {
	const id = req.params.id;
	let course = {
		title: req.body.title,
		type: req.body.type,
		time: req.body.time,
		descript: req.body.descript,
		images: req.body.images,
		price: req.body.price,
		tags: req.body.tags,
	};
	const messages = [];
	const result = validationResult(req);
	const errors = result.array();
	errors.forEach((err) => messages.push(err.msg));
	if (messages.length > 0) {
		return res.render('admin', {messages, course});
	} else {
		const updateCourses = await update(id, course);
		const courses = await courseModel();
		courses.forEach(async (course) => {
			await totalCourse(course.course_id);
		});
		courses.forEach(async (course) => {
			const totalTime = await require('./middleware').updateTime(courses);
			await update(course.course_id, {total_time: totalTime});
		});

		if (messages.length > 0) {
			return res.render('admin', {messages, course});
		}
		res.redirect('/');
	}
};

exports.remove = async (req, res) => {
	const id = req.params.id;
	const course = await findBy('course_id', id);
	if (!course.images === null) {
		Object.values(course.images).forEach((image) => {
			fs.unlinkSync(`./public${image}`);
		});
	}
	const results = await deleteTask(id);
	const courses = await courseModel();
	courses.forEach(async (course) => {
		await totalCourse(course.course_id);
	});
	courses.forEach(async (course) => {
		const totalTime = await require('./middleware').updateTime(courses);
		await update(course.course_id, {total_time: totalTime});
	});
	if (results.affectedRows == 1) {
		res.redirect('/');
	}
};
