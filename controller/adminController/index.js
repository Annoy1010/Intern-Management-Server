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

const handleGetDepartment = (req, res) => {
    const schoolId = req.query.schoolId;
    if (!schoolId) {
        res.send({ 
            statusCode: 400,
            responseData: 'Cần cung cấp mã trường'
        })
    } else {
        adminModel.getAllDepartment(schoolId, res)
    }
}

const handleGetTeacherInDepartment = (req, res) => {
    adminModel.getAllTeachersInDepartment(req, res)
}

const handlePostDepartment = (req, res) => {
    const department_name = req.body.department_name;
    const majors = req.body.majors;
    if (department_name === '' || majors === '') {
        res.send({ 
            statusCode: 400, 
            responseData: 'Vui lòng nhập đầy đủ thông tin dữ liệu của khoa'
        });
    } else {
        adminModel.postNewDepartment(req, res);
    }
}

const handlePutDepartment = (req, res) => {
    const department_name = req.body.department_name;
    const majors = req.body.majors;
    const department_head = req.body.department_head;
    if (department_name === '' || majors === '' || department_head === null) {
        res.send({ 
            statusCode: 400, 
            responseData: 'Vui lòng nhập đầy đủ thông tin dữ liệu của khoa'
        });
    } else {
        adminModel.editDepartment(req, res);
    }
}

module.exports = {
    handleGetSchool,
    handleGetProgram,
    handlePostProgram,
    handlePutProgram,
    handleGetDepartment,
    handleGetTeacherInDepartment,
    handlePostDepartment,
    handlePutDepartment
}