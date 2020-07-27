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
	const [tasks] = await db.query('DELETE FROM `tasks` WHERE task_id=?', [id]);
	return tasks;
};

// exports.getUser = async (page = 1, number = 20) => {
// 	const offset = (page - 1) * number;
// 	const db = await connection();
// 	const [users] = await db.query(`SELECT * from users LIMIT ${number} OFFSET ${offset}`);
// 	return users;
// };
// exports.getTotal = async () => {
// 	const db = await connection();
// 	const [users] = await db.query(`SELECT COUNT(id) as total FROM users`);
// 	return users[0].total;
// };
// exports.createUser = async (user) => {
// 	const db = await connection();
// 	const [users] = await db.query('INSERT INTO `users` SET?', user);
// 	return users;
// };
// exports.deleteUserModel = async (uid) => {
// 	const db = await connection();

// 	const [result] = await db.query('DELETE FROM `users` WHERE id=?', [uid]);
// 	return result;
// };
