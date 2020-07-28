const homeRouter = require('./modules/home/routes');
const tasksRouter = require('./modules/tasks/routes');
const authRouter = require('./modules/auth/routes');
const adminRouter = require('./modules/admin/routes');

module.exports = (app) => {
	app.use('/', homeRouter);
	app.use('/tasks', tasksRouter);
	app.use('/auth', authRouter);
	app.use('/admin', adminRouter);
};
