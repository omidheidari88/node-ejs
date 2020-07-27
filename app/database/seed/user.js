const faker = require('faker');
faker.locale = 'fa';
const connection = require('../mysql/connection');
module.exports = async (count = 50) => {
	const db = await connection();
	const users = [];
	for (let i = 1; i < count; i++) {
		const user = {
			first_name: faker.name.firstName(),
			last_name: faker.name.lastName(),
			email: faker.internet.email(),
			password: '',
			mobile: faker.phone.phoneNumber(),
		};
		users.push(user);
		db.query('INSERT INTO `users` SET ?', [user]);
	}
};
