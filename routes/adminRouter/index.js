const express = require('express');
const router = express.Router();

const adminController = require('../../controller/adminController');

router.get('/school', adminController.handleGetSchool);
router.get('/program', adminController.handleGetProgram);
router.post('/program/new', adminController.handlePostProgram);
router.put('/program/edit', adminController.handlePutProgram);
router.get('/academic-year', adminController.handleGetAcademicYear);
router.get('/semester', adminController.handleGetSemester);

router.get('/department', adminController.handleGetDepartment);
router.get('/department/teachers', adminController.handleGetTeacherInDepartment);
router.get('/department/teachers/active', adminController.handleGetActiveTeacherInDepartment);
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

router.post('/intern/board/new', adminController.handlePostInternBoard);
router.put('/intern/board/edit', adminController.handlePutInternBoard);
router.delete('/intern/board/delete', adminController.handleDeleteInternBoard);
router.get('/intern/board/all', adminController.handleGetAllInternBoards);

module.exports = router;