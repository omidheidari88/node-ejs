const connection = require('../../database/mysql/connection');
exports.taskModel = async () => {
	const db = await connection();
	const [tasks] = await db.query('SELECT * from `tasks`');
	return tasks;
};
exports.save = async (task) => {
	const db = await connection();
	const [tasks] = await db.query('INSERT INTO `tasks` SET ?', task);
	return tasks;
};
exports.deleteTask = async (id) => {
	const db = await connection();
	const [tasks] = await db.query('DELETE FROM `tasks` WHERE id=?', [id]);
	return tasks;
};
exports.courseModel = async () => {
	const db = await connection();
	const [courses] = await db.query('SELECT * from `courses`');
	return courses;
};
exports.usersModel = async () => {
	const db = await connection();
	const [users] = await db.query('SELECT * from `users` WHERE is_admin=1');
	return users;
};
