const express = require('express');
const router = express.Router();

const teacherController = require('../../controller/teacherController');

router.get('/department', teacherController.getTeacherController);

module.exports = router;