const userRouter = require('./userRouter');
const adminRouter = require('./adminRouter');

function route(app) {
    app.use('/user', userRouter);
    app.use('/admin', adminRouter);
}

module.exports = route;



