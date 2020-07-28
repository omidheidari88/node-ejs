const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
const dbName = process.env.MONGO_DB;
const connection = async () => {
	const client = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
	const db = client.db(dbName);
	return db;
};
module.exports = connection;
