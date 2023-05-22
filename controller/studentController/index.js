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

module.exports = {
    getAllStudentsController,
    addStudentController,
    updateStudentController,
    deleteStudentController,
    getStudentOfYearController,
}