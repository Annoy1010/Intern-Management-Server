const userRouter = require('./userRouter');
const classRouter = require('./classRouter');
const departmentRouter = require('./departmentRouter');
const teacherRouter = require('./teacherRouter');

function route(app) {
    app.use('/user', userRouter);
    app.use('/class', classRouter);
    app.use('/department', departmentRouter);
    app.use('/teacher', teacherRouter);
}

module.exports = route;



