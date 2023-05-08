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

module.exports = router;