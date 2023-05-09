const express = require('express');
const router = express.Router();

const adminController = require('../../controller/adminController');

router.get('/school', adminController.handleGetSchool);
router.get('/program', adminController.handleGetProgram);
router.post('/program/new', adminController.handlePostProgram);
router.put('/program/edit', adminController.handlePutProgram);
router.get('/department', adminController.handleGetDepartment);
router.get('/department/teachers', adminController.handleGetTeacherInDepartment);
router.post('/department/new', adminController.handlePostDepartment);
router.put('/department/edit', adminController.handlePutDepartment);
router.get('/teacher', adminController.handleGetTeacher);
router.post('/teacher/createAccount', adminController.handlePostTeacherAccount);
router.post('/teacher/createPersonalInfo', adminController.handleTeacherPersonal);
router.post('/teacher/createDetailInfo', adminController.handleTeacherDetail);
router.put('/teacher/editPersonalInfo', adminController.handleTeacherPersonal);
router.put('/teacher/editDetailInfo', adminController.handleTeacherDetail);

module.exports = router;