const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        // if (ext !== '.pdf') {
        //     return cb(new Error('Only PDFs are allowed'));
        // }

        return cb(null, true);
    }
});

const adminController = require('../../controller/adminController');

router.get('/school', adminController.handleGetSchool);
router.get('/program', adminController.handleGetProgram);
router.post('/program/new', adminController.handlePostProgram);
router.put('/program/edit', adminController.handlePutProgram);
router.get('/academic-year', adminController.handleGetAcademicYear);
router.get('/semester', adminController.handleGetSemester);

router.get('/department', adminController.handleGetDepartment);
router.get('/department/teachers', adminController.handleGetTeacherInDepartment);
router.post('/department/new', adminController.handlePostDepartment);
router.put('/department/edit', adminController.handlePutDepartment);
router.get('/department/head', adminController.handleGetDepartmentHead);

router.get('/major', adminController.handleGetMajor);
router.delete('/major/remove', adminController.handleRemoveMajor);

router.get('/teacher', adminController.handleGetTeacher);
router.post('/teacher/createAccount', adminController.handlePostTeacherAccount);
router.post('/teacher/createPersonalInfo', adminController.handleTeacherPersonal);
router.post('/teacher/createDetailInfo', adminController.handleTeacherDetail);
router.put('/teacher/editPersonalInfo', adminController.handleTeacherPersonal);
router.put('/teacher/editDetailInfo', adminController.handleTeacherDetail);

router.post('/subject/new', adminController.handlePostSubject);
router.get('/subject', adminController.handleGetSubject);
router.put('/subject/edit', adminController.handlePutSubject);

router.get('/student/signup_intern', adminController.getStudentSignUpIntern);
router.get('/student/request_job', adminController.getStudentRequestJobIntern);
router.put('/student/request_job/:id', upload.single('file'), adminController.confirmInternJobRequested);
router.put('/student/:id/confirm_learn_intern', adminController.confirmLearnIntern);

module.exports = router;