const express = require('express');
const app = express();

require('./middlewares/engineConfig')(app);
require('./middlewares/parsers')(app);
require('./router')(app);
require('./middlewares/404')(app);

const start = () => {
	app.listen(process.env.WEB_PORT, () => {
		console.log(`app is running on port ${process.env.WEB_PORT}`);
	});
};
module.exports = start;
