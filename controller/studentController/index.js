const studentModel = require("../../model/studentModel");
const Joi = require('joi');

const getAllStudentsController = (req, res) => {
    const search = req.query.search || '';
    studentModel.getALLStudents(req, res, search);
}

const getStudentIdByUserIdController = (req, res) => {
    const user_id = req.query.user_id;
    studentModel.getStudentIdByUserId(user_id, res);
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
    } else{
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

const postRegistInternJobRequestController = (req, res) => {
    studentModel.postRegistInternJobRequest(req, res);
}

const getAllRegistInternJobRequestController = (req, res) => {
    const student_id = req.query.student_id;
    studentModel.getAllRegistInternJobRequest(student_id, res);
}

const deleteRegistInternJobRequestController = (req, res) => {
    const request_id = req.query.request_id;
    studentModel.deleteRegistInternJobRequest(request_id, res);
}

const getAllRequestJobIntern = (req, res) => {
    const student_id = req.query.student_id;
    studentModel.getAllRequestJobIntern(student_id, res);
}

const getInteringStatusOfStudent = (req, res) => {
    const studentId = req.query.studentId;
    studentModel.getInteringStatusOfStudent(studentId, res)
}

const getAllJobsController = (req, res) => {
    const searchJob = req.query.searchJob || '';
    studentModel.getAllJobs(req, res, searchJob);
}

const getJobInLibraryOfStudentController = (req, res) => {
    const student_id = req.query.student_id;
    const job_id = req.query.job_id;
    studentModel.getJobInLibraryOfStudent(student_id, job_id, res);
}

const postJobToLibraryController = (req, res) => {
    const student_id = req.body.student_id;
    const job_id = req.body.job_id;
    studentModel.postJobToLibrary(student_id, job_id, res);
}

const getAllJobsInLibraryController = (req, res) => {
    const student_id = req.query.student_id;
    const search = req.query.search || '';
    studentModel.getAllJobsInLibrary(student_id, res, search);
}

const deleteJobFromLibraryController = (req, res) => {
    const student_id = req.query.student_id;
    const job_id = req.query.job_id;
    studentModel.deleteJobFromLibrary(student_id, job_id, res);
}

const getCareJobController = (req, res) => {
    const student_id = req.query.student_id;
    studentModel.getCareJob(student_id, res);
}

const getAllTodoOfStudentController = (req, res) => {
    const student_id = req.query.student_id;
    studentModel.getAllTodoOfStudent(student_id, res);
}

const updateTodoOfStudentController = (req, res) => {
    const id = req.body.id;
    const end_date = req.body.end_date
    studentModel.updateTodoOfStudent(id, end_date, res);
}

const getFileAppreciateBusiness = async (req, res) => {
    try {
        const studentId = await studentModel.getStudentId(req.headers.authorization);
        if (!studentId) return res.status(401).json('user was not found');

        const result = await studentModel.getFileAppreciateBusiness(studentId);

        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.mesaage});
    }
}

const getFileTeacher = async (req, res) => {
    try {
        const studentId = await studentModel.getStudentId(req.headers.authorization);
        if (!studentId) return res.status(401).json('user was not found');

        const result = await studentModel.getFileTeacher(studentId);

        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.mesaage});
    }
}

const saveReport = async (req, res) => {
    try {
        const studentId = await studentModel.getStudentId(req.headers.authorization);

        const schema = Joi.object({
            result_file: Joi.string().required(),
            result_business_file:  Joi.string().required(),
            result_teacher_file: Joi.string().required(),
            sent_time: Joi.date().default(new Date().toISOString().slice(0, 10)),
        });

        const {error, value} = schema.validate(req.body);

        if (error) return res.status(401).json(error);

        const result = await studentModel.deleteReport(studentId);
        console.log(result);

        await studentModel.saveReport(value, studentId);
        return res.status(200).json();
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.mesaage});
    }
}

const getReport = async (req, res) => {
    try {
        const studentId = await studentModel.getStudentId(req.headers.authorization);
        if (!studentId) return res.status(401).json('user was not found');

        const result = await studentModel.getReport(studentId);

        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.mesaage});
    }
}

module.exports = {
    getAllStudentsController,
    getStudentIdByUserIdController,
    addStudentController,
    updateStudentController,
    deleteStudentController,
    getStudentOfYearController,
    getAllOpeningSubjectController,
    getDepartmentIdOfStudentController,
    checkRegistLearnSubjectRequestController,
    postRegistLearnSubjectRequestController,
    getRegistedSubjectInfoController,
    deleteRegistSubjectController,
    postRegistInternJobRequestController,
    getAllRegistInternJobRequestController,
    deleteRegistInternJobRequestController,
    getAllRequestJobIntern,
    getInteringStatusOfStudent,
    getAllJobsController,
    getJobInLibraryOfStudentController,
    postJobToLibraryController,
    getAllJobsInLibraryController,
    deleteJobFromLibraryController,
    getCareJobController,
    getAllTodoOfStudentController,
    updateTodoOfStudentController,
    getFileAppreciateBusiness,
    getFileTeacher,
    saveReport,
    getReport
}