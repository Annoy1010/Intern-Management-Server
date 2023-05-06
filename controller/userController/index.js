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

const handleUserDataByToken = (req, res) => {
    userModel.getUserData(req.query, res);
}

const handleLogout = (req, res) => {
    userModel.resetToken(res);
}

const verifyEmail = (req, res) => {
    const email = req.body.email;
    if (email === '') {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng nhập email!',
        });
    } else {
        userModel.verifyEmailModel(email, res);
    }
}

const addBusinessController = (req, res) => {
    const {id, name, img, phone, email, address, establishDate, sector, representator, desc} = req.body; 
    console.log(name);
    if (name === '' || phone === '' ||email === '' ||address === '' ||sector === '' ||representator === '' ||desc === ''){
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng nhập đầy đủ thông tin đăng nhập',
        });
    }else{
        userModel.addBusiness(req.body,res);
    }
}

const getBusinessController = (req, res) => {
    userModel.getBusinessModel(req, res);
}

module.exports = {
    handleLoginInput,
    handleToken,
    handleUserDataByToken,
    handleLogout,
    verifyEmail,
    addBusinessController,
    getBusinessController,
}