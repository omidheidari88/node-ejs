const connection = require('../../database/mysql/connection');
const connectionMongo = require('../../database/mongoDB/connection');
const objectId = require('mongodb').ObjectID;

exports.findUserByCredential = async (email, password) => {
	const db = await connection();
	const [user] = await db.query('SELECT * from users WHERE email=? AND password=? LIMIT 1', [email, password]);
	if (user.length > 0) {
		return user[0];
	}
	return false;
};
exports.registerUser = async (user) => {
	const db = await connection();
	const [users] = await db.query('INSERT INTO `users` SET ?', user);
	return users;
};

exports.findBy = async (key, value) => {
	const db = await connection();
	const [records] = await db.query(`SELECT * FROM users WHERE ${key}=? LIMIT 1 `, [value]);
	return records[0];
};
//-------------------MONGO QUERY--------------
exports.all = async (params = null) => {
	const db = await connectionMongo();
	const result = await db.collection('users').find({});
	const items = await result.toArray();
	return items;
};

exports.create = async (params) => {
	const db = await connectionMongo();
	const result = await db.collection('users').insertOne(params);
	return result;
};
exports.update = async (data) => {
	const db = await connectionMongo();
	const result = await db.collection('users').updateOne(
		{_id: objectId(data.id)},
		{
			$set: {title: data.title},
		},
	);
	return result.modifiedCount > 0;
};
