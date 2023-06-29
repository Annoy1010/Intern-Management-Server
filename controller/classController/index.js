const classModel = require("../../model/classModel");

const addClassController = (req, res) => {
    const {name, students, academic_year, head_teacher, department_id} = req.body;
    if (name === '' || students === '' || head_teacher === '' || department_id === ''){
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng nhập đầy đủ thông tin đăng nhập',
        });
    } else {
        classModel.addClassModel(req, res);
    }
}

const getClassAllController = (req, res) => {
    const search = req.query.search || '';
    classModel.getClassAllModel(req, res, search);
}

const getClassYearController = (req, res) => {
    classModel.getClassYearModel(req, res);
}

const getAcademicYearController = (req, res) => {
    classModel.getAcademicYear(req, res);
}

const updateClassController = (req, res) => {
    const {name, students, academic_year, head_teacher, department_id} = req.body.newclass;
    const {id} = req.body.classId;
    if (name === '' || students === '' || head_teacher === '' || department_id === ''){
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng nhập đầy đủ thông tin đăng nhập',
        });
    } else {
        classModel.updateClass(req, res);
    }
}

const deleteClassController = (req, res) => {
    classModel.deleteClassModel(req, res);
}

const getClassOfDepartmentController = (req, res) => {
    classModel.getClassOfDepartment(req, res);
}

module.exports = {
    addClassController,
    getClassAllController,
    getClassYearController,
    getAcademicYearController,
    updateClassController,
    deleteClassController,
    getClassOfDepartmentController,
}