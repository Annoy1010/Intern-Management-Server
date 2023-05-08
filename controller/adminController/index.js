const adminModel = require("../../model/adminModel");

const handleGetSchool = (req, res) => {
    const email = req.query.email;
    if (!email) {
        res.send({ 
            statusCode: 400,
            responseData: 'Cần cung cấp địa chỉ Email'
        })
    } else {
        adminModel.getSchool(email, res)
    }
}

const handleGetProgram = (req, res) => {
    const schoolId = req.query.schoolId;
    if (!schoolId) {
        res.send({ 
            statusCode: 400,
            responseData: 'Cần cung cấp mã trường'
        })
    } else {
        adminModel.getAllProgram(schoolId, res)
    }
}

const handlePostProgram = (req, res) => {
    const data = req.body;
    if (data.program_name === '') {
        res.send({
            tatusCode: 400,
            responseData: 'Cần cung cấp tên chương trình đào tạo'
        })
    } else {
        adminModel.postNewProgram(data, res);
    }
}

const handlePutProgram = (req, res) => {
    const data = req.body;
    if (data.program_name === '') {
        res.send({
            tatusCode: 400,
            responseData: 'Cần cung cấp tên chương trình đào tạo'
        })
    } else {
        adminModel.editProgram(data, res);
    }
}

module.exports = {
    handleGetSchool,
    handleGetProgram,
    handlePostProgram,
    handlePutProgram
}