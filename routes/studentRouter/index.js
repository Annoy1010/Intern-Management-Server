const express = require('express');
const router = express.Router();

const studentController = require('../../controller/studentController');

router.get('/', studentController.getAllStudentsController);
router.post('/add', studentController.addStudentController);
router.put('/update', studentController.updateStudentController);
router.post('/delete', studentController.deleteStudentController);
router.get('/year', studentController.getStudentOfYearController);
router.get('/department/student_id', studentController.getDepartmentIdOfStudentController)
router.get('/intern/subject', studentController.getAllOpeningSubjectController);
router.post('/intern/subject/regist/check', studentController.checkRegistLearnSubjectRequestController);
router.post('/intern/subject/regist', studentController.postRegistLearnSubjectRequestController);
router.get('/intern/subject/info', studentController.getRegistedSubjectInfoController);
router.delete('/intern/subject/delete/id', studentController.deleteRegistSubjectController);

module.exports = router;