const userModel = require("../../model/userModel");

const handleLoginInput = (req, res) => {
    const { username, pass } = req.body;
    if (username === '' || pass === '') {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng nhập đầy đủ thông tin đăng nhập',
        });
    } else {
        userModel.handleLoginDataModel({ username, pass }, res);
    }
}

const handleToken = (req, res) => {
    userModel.updateToken(req.body, res);
}

const handleUserAccountDataByToken = (req, res) => {
    userModel.getUserAccountData(req.query, res);
}

const handleUserPersonDataByToken = (req, res) => {
    userModel.getUserPersonData(req.query, res);
}

const handleLogout = (req, res) => {
    userModel.resetToken(res);
}

module.exports = {
    handleLoginInput,
    handleToken,
    handleUserAccountDataByToken,
    handleUserPersonDataByToken,
    handleLogout,
}