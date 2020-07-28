const connection = require('../../database/mysql/connection');
exports.courseModel = async () => {
	const db = await connection();
	const [courses] = await db.query('SELECT * from `courses`');
	return courses;
};
exports.save = async (course) => {
	const db = await connection();
	const [courses] = await db.query('INSERT INTO `courses` SET ?', course);
	return courses;
};
exports.deleteTask = async (id) => {
	const db = await connection();
	const [courses] = await db.query('DELETE FROM `courses` WHERE course_id=?', [id]);
	return courses;
};
exports.findBy = async (key, value) => {
	const db = await connection();
	const [records] = await db.query(`SELECT * FROM courses WHERE ${key}=? LIMIT 1 `, [value]);
	return records[0];
};
exports.update = async (key, value) => {
	const db = await connection();
	const [records] = await db.query(`UPDATE courses SET ? WHERE course_id=${key}`, [value]);
	return records[0];
};
exports.totalCourse = async (id) => {
	const db = await connection();
	const [totalCourses] = await db.query('SELECT COUNT(*) FROM `courses`');
	const [courses] = await db.query(`UPDATE courses SET ? WHERE course_id=${id}`, {total_course: totalCourses[0]['COUNT(*)']});
	return totalCourses[0]['COUNT(*)'];
};
exports.totalPrice = async () => {
	const db = await connection();
	const [total] = await db.query(`SELECT SUM(price) AS TotalPrice FROM courses`);
	return total[0]['TotalPrice'];
};
