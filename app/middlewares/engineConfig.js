const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
module.exports = async (app) => {
	const ROOT_PATH = path.dirname(require.main.filename);
	const APP_PATH = path.join(ROOT_PATH, 'app');
	app.set('views', path.join(APP_PATH, 'view'));
	app.set('view engine', 'ejs');
	app.use(expressLayouts);
	app.set('layout', 'partials/header');
	app.set('layout extractScripts', true);
	app.set('layout extractStyles', true);
	app.use(express.static(path.join(ROOT_PATH, 'public')));
};
