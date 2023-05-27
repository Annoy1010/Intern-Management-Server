const courseModel = require("../../model/courseModel");

const confirmSignUpController = (req, res) => {
    courseModel.confirmSignUp(req, res);
}

module.exports = {
    confirmSignUpController,
}