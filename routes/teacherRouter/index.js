const express = require('express');
const router = express.Router();

const teacherController = require('../../controller/teacherController');

router.get('/department', teacherController.getTeacherController);
router.get('/assigned/list', teacherController.getAssignedListController);
router.get('/todo/list', teacherController.getTodoListOfStudentController);
router.post('/todo/new', teacherController.postTodoController);
router.delete('/todo/remove', teacherController.removeTodoController);
router.post('/todo/appreciation/new', teacherController.postTodoAppreciationController);
router.get('/todo/appreciation/all', teacherController.getAllTodoAppreciationController);
router.delete('/todo/appreciation/remove', teacherController.removeAppreciationController);
router.get('/student', teacherController.getStudentLearnIntern);
router.put('/save_score', teacherController.saveScore);
router.put('/save_score/:id', teacherController.saveScore);
router.put('/student/intern/completed', teacherController.completeInternProcess);
router.put('/student/file', teacherController.saveFile);

module.exports = router;