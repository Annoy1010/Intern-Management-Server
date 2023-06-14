const adminModel = require("../../model/adminModel");
const Joi = require('joi');


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

const handleGetAcademicYear = (req, res) => {
    adminModel.getAcademicYear(req, res);
}

const handleGetSemester = (req, res) => {
    adminModel.getSemester(req, res);
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

const handleGetDepartmentHead = (req, res) => {
    adminModel.getDepartmentHead(req, res);
}

const handleGetMajor = (req, res) => {
    adminModel.getMajorByDepartment(req, res);
}

const handleRemoveMajor = (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng cung cấp mã ngành học'
        })
    } else {
        adminModel.removeMajor(id, res);
    }
}



const handleGetTeacherInDepartment = (req, res) => {
    adminModel.getAllTeachersInDepartment(req, res);
}

const handlePostDepartment = (req, res) => {
    const department_name = req.body.department_name;
    const major_list = req.body.major_list;
    if (department_name.trim() === '') {
        res.send({ 
            statusCode: 400, 
            responseData: 'Vui lòng nhập thông tin tên khoa'
        });
    } else if (major_list.length === 0) {
        res.send({ 
            statusCode: 400, 
            responseData: 'Vui lòng nhập danh sách ngành học của khoa'
        });
    } else {
        adminModel.postNewDepartment(req, res);
    }
}

const handlePutDepartment = (req, res) => {
    const department_name = req.body.department_name;
    const department_head = req.body.department_head;
    const major_list = req.body.major_list;
    if (department_name === '' || department_head === null) {
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

const handlePostSubject = (req, res) => {
    const data = req.body;
    const keys = Object.keys(data);
    const IsExistedNullInput = keys.some(item => data[item] === null);
    if (IsExistedNullInput) {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin giảng viên'
        })
    } else {
        const IsExistedInvalidNumber = keys.some(item => Number.isInteger(data[item]) === false && Number.parseInt(data[item]) <= 0);
        if (IsExistedInvalidNumber) {
                res.send({
                    statusCode: 400,
                    responseData: 'Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại'
                })
        } else {
                adminModel.postSubject(data, res);
        }
    }
}

const handleGetSubject = (req, res) => {
    const semester_id = req.query.semester_id;
    const academic_year = req.query.academic_year;

    if (Number.parseInt(semester_id) === 0 && Number.parseInt(academic_year) === 0) {
        adminModel.getAllSubject(req, res);
    } else {
        if (Number.parseInt(semester_id) !== 0 && Number.parseInt(academic_year) === 0) {
            adminModel.getSubjectBySemester(semester_id, res);
        } else if (Number.parseInt(semester_id) === 0 && Number.parseInt(academic_year) !== 0) {
            adminModel.getSubjectByAcademicYear(academic_year, res);
        } else {
            adminModel.getSubjectByAllFilter(semester_id, academic_year, res);
        }
    }
}

const handlePutSubject = (req, res) => {
    const data = req.body;
    const keys = Object.keys(data);
    const IsExistedNullInput = keys.some(item => data[item] === null);
    if (IsExistedNullInput) {
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin giảng viên'
        })
    } else {
        const IsExistedInvalidNumber = keys.some(item => Number.isInteger(data[item]) === false && Number.parseInt(data[item]) <= 0);
        if (IsExistedInvalidNumber) {
                res.send({
                    statusCode: 400,
                    responseData: 'Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại'
                })
        } else {
                adminModel.putSubject(data, res);
        }
    }
}

const confirmLearnIntern = async (req, res) => {
    
    try {
        const studentId = req.params.id;
        const key = req.body.key;
        if (!studentId) return res.status(400).json('Không tìm thấy sinh viên nào');
        if (!key) return res.status(400).json('Lỗi không thể xác nhận đăng ký thực tập');
        
        const result = await adminModel.confirmLearnIntern(studentId, key);
        return res.status(200).json('Xác nhận thành công');
    } catch (e) {
        console.log(e);
        return res.status(500).json({ detail: e.message }); 
    }
}

const getStudentSignUpIntern = async (req, res) => {
    try {        
        const schema = Joi.object({
            academic: Joi.number().default(0),
            semester: Joi.number().default(0),
            teacher: Joi.number().default(0),
        });
    
        const {error, value} = schema.validate(req.query);
    
        if (error) return res.status(400).json(error);
    
        const result = await adminModel.getStudentSignUpIntern(value);
    
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ detail: e.message });        
    }
}

const getStudentRequestJobIntern = async (req, res) => {
    try {
        const schema = Joi.object({
            academic: Joi.number().default(0),
            semester: Joi.number().default(0),
        });
    
        const {error, value} = schema.validate(req.query);
    
        if (error) return res.status(400).json(error);

        const result = await adminModel.getStudentRequestJobIntern(value);

        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.message});
    }
}

const confirmInternJobRequested = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        
        console.log(req);
        const file = req.file.buffer;
        const key = req.body.key;
        const result = await adminModel.confirmInternJobRequested(file, key);
        console.log(result);

        const requestInfo = await adminModel.getInfoRequestOfstudent(key);

        if (result.affectedRows === 1) {
            await adminModel.saveRequestJobIntern(requestInfo, file);
        }
    
        return res.status(200).json('xac nhan thanh cong');
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.message});
    }
}

module.exports = {
    handleGetSchool,
    handleGetProgram,
    handlePostProgram,
    handlePutProgram,
    handleGetAcademicYear,
    handleGetSemester,
    handleGetDepartment,
    handleGetDepartmentHead,
    handleGetMajor,
    handleRemoveMajor,
    handleGetTeacher,
    handleGetTeacherInDepartment,
    handlePostDepartment,
    handlePutDepartment,
    handlePostTeacherAccount,
    handleTeacherPersonal,
    handleTeacherDetail,
    handlePostSubject,
    handleGetSubject,
    handlePutSubject,
    getStudentSignUpIntern,
    confirmLearnIntern,
    getStudentRequestJobIntern,
    confirmInternJobRequested,
}