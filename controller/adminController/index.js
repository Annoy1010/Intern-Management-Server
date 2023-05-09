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

const handleGetTeacher = (req, res) => {
    adminModel.getAllTeacher(req, res)
}

const handlePostTeacherAccount = (req, res) => {
    const full_name = req.body.full_name;
    if (full_name === '') {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin giảng viên'
        })
    } else {
        const hashedUsername = () => {
            const splitName = full_name.split(' ');
            const hashFullName = splitName.map((name) => name[0].toLowerCase());
            const randomNumber = Math.floor(Math.random() * 10000) + 1;
            const createUsername = `${hashFullName.join('')}_gv_${randomNumber}`;
            return createUsername;
        };

        adminModel.postTeacherAccount(hashedUsername(), res);
    }
}

const handleTeacherPersonal = (req, res) => {
    const data = req.body;
    const existedEmpty = Object.keys(data).some(item => data[`${item}`] === '')
    if (existedEmpty) {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin giảng viên'
        })
    } else {
        if (data.isPosted) {
            adminModel.postTeacherPersonal(data, res);
        } else {
            adminModel.putTeacherPersonal(data, res);
        }
    }
}

const handleTeacherDetail = (req, res) => {
    const data = req.body;
    const nullTeachingStatus = -1;
    const nullDepartment = 0;
    const existedEmpty = Object.keys(data).some(item => data[`${item}`] === '' || data[`${item}`] === nullTeachingStatus || data[`${item}`] === nullDepartment)
    if (existedEmpty) {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin giảng viên'
        })
    } else {
        if (data.isPosted) {
            adminModel.postTeacherDetail(data, res);
        } else {
            adminModel.putTeacherDetail(data, res);
        }
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
    handlePutDepartment,
    handleGetTeacher,
    handlePostTeacherAccount,
    handleTeacherPersonal,
    handleTeacherDetail,
}