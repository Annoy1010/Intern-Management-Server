const express = require('express');
const router = express.Router();

const teacherController = require('../../controller/teacherController');

router.get('/department', teacherController.getTeacherController);
router.get('/assigned/list', teacherController.getAssignedListController);
router.get('/todo/list', teacherController.getTodoListOfStudentController);
router.post('/todo/new', teacherController.postTodoController);
router.post('/todo/appreciation/new', teacherController.postTodoAppreciationController);
router.get('/todo/appreciation/all', teacherController.getAllTodoAppreciationController);

module.exports = router;