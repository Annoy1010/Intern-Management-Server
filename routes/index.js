const userRouter = require('./userRouter');
const adminRouter = require('./adminRouter');
const classRouter = require('./classRouter');
const departmentRouter = require('./departmentRouter');
const teacherRouter = require('./teacherRouter');
const studentRouter = require('./studentRouter');
const majorRouter = require('./majorRouter');
const businessRouter = require('./businessRouter');

function route(app) {
    app.use('/user', userRouter);
    app.use('/admin', adminRouter);
    app.use('/class', classRouter);
    app.use('/department', departmentRouter);
    app.use('/teacher', teacherRouter);
    app.use('/student', studentRouter);
    app.use('/major', majorRouter);
    app.use('/business', businessRouter);
}

module.exports = route;



