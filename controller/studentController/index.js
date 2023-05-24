const studentModel = require("../../model/studentModel");

const getAllStudentsController = (req, res) => {
    studentModel.getALLStudents(req, res);
}

const addStudentController = (req, res) => {
    const { image,
        full_name,
        dob,
        email,
        address,
        department_id,
        class_id,
        major_id } = req.body;
    if (full_name === "" || dob === "" || email === "" || address === "" || department_id === "" || class_id === "" || major_id === ""){
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin',
        });
    }else{
        studentModel.addStudent(req, res);
    }
}

const updateStudentController = (req, res) => {
    const { image,
        full_name,
        dob,
        email,
        address,
        department_id,
        class_id,
        major_id } = req.body.newStudent;
    const id = req.body.user_id;
    if (full_name === "" || dob === "" || email === "" || address === "" || department_id === "" || class_id === "" || major_id === ""){
        res.send({
            statusCode: 400,
            responseData: 'Vui lòng điền đầy đủ thông tin',
        });
    }else{
        studentModel.updateStudent(req, res);
    }
}

const deleteStudentController = (req, res) => {
    studentModel.deleteStudent(req, res);
}

const getStudentOfYearController = (req, res) => {
    studentModel.getStudentOfYear(req, res);
}

const getDepartmentIdOfStudentController = (req, res) => {
    const student_id = req.query.user_id;
    studentModel.getDepartmentIdOfStudent(student_id, res);
}

const getAllOpeningSubjectController = (req, res) => {
    const date = new Date(Date.now());
    const year = date.getFullYear();
    const month = date.getMonth();
    const department_id = req.query.department_id;
    studentModel.getAllOpeningSubject(year, month, department_id, res);
}

const checkRegistLearnSubjectRequestController = (req, res) => {
    const student_id = req.body.student_id;
    studentModel.checkRegistLearnSubjectRequest(student_id, res);
}

const postRegistLearnSubjectRequestController = (req, res) => {
    const student_id = req.body.student_id
    const subject_id = req.body.subject_id;
    studentModel.postRegistLearnSubjectRequest(student_id, subject_id, res);
}

const getRegistedSubjectInfoController = (req, res) => {
    studentModel.getRegistedSubjectInfo(req, res);
}

const deleteRegistSubjectController = (req, res) => {
    const id = req.query.id;
    studentModel.deleteRegistSubject(id, res);
}

module.exports = {
    getAllStudentsController,
    addStudentController,
    updateStudentController,
    deleteStudentController,
    getStudentOfYearController,
    getAllOpeningSubjectController,
    getDepartmentIdOfStudentController,
    checkRegistLearnSubjectRequestController,
    postRegistLearnSubjectRequestController,
    getRegistedSubjectInfoController,
    deleteRegistSubjectController
}