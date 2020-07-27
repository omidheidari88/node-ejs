const taskStatus = require('./task_status');
const {save, deleteTask} = require('./model');

exports.create = async (req, res) => {
	res.render('tasks/add');
};
exports.store = async (req, res) => {
	let task = {
		task_title: req.body.task_title,
		task_category: req.body.task_category,
		task_assignee: req.body.task_assignee,
		task_status: taskStatus.CREATED,
	};
	const tasks = await save(task);
	res.cookie('tasks', tasks, {httpOnly: true}).redirect('/');
};
exports.remove = async (req, res) => {
	const id = req.params.id;
	const results = await deleteTask(id);
	if (results.affectedRows == 1) {
		res.redirect('/');
	}
};

// exports.user = async (req, res) => {
// 	const {page, number} = req.query;
// 	const users = await getUser(page, number);
// 	const total_users = await getTotal();
// 	const total_page = total_users / number;
// 	const pagination = {
// 		total: total_users,
// 		number,
// 		page,
// 		next_page: page < total_page ? `http://localhost:5000/api/user?page=${parseInt(page) + 1}&number=${number}` : null,
// 		prev_page: page > 1 ? `http://localhost:5000/api/user?page=${page - 1}&number=${number}` : null,
// 	};
// 	const data = users.map(removePassword).map(addFullname).map(persianMobile);
// 	res.send({data});
// };

// exports.create = async (req, res) => {
// 	const users = req.body;
// 	const result = await createUser(users);
// 	res.send({users, result});
// };
// exports.deleteUser = async (req, res) => {
// 	const uid = req.params.id;
// 	const result = await deleteUserModel(uid);
// 	console.log(result);
// 	if (result.affectedRows > 0) {
// 		res.send({uid, result});
// 	}
// 	if (result.affectedRows > 0) {
// 		res.send({message: 'no user found'});
// 	}
// };
