const express = require('express');
const router = express.Router();

const studentController = require('../../controller/studentController');

router.get('/', studentController.getAllStudentsController);
router.get('/id_data/user_id', studentController.getStudentIdByUserIdController)
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
router.post('/intern/job/regist/new', studentController.postRegistInternJobRequestController);
router.get('/intern/job/regist/all', studentController.getAllRegistInternJobRequestController);
router.delete('/intern/job/regist/id', studentController.deleteRegistInternJobRequestController);
router.get('/intern/job/request', studentController.getAllRequestJobIntern);

router.get('/job/all', studentController.getAllJobsController)
router.get('/job/store', studentController.getJobInLibraryOfStudentController)
router.post('/job/store/new', studentController.postJobToLibraryController)
router.get('/job/library/all', studentController.getAllJobsInLibraryController)
router.delete('/job/library/delete/id', studentController.deleteJobFromLibraryController)
router.get('/job/care', studentController.getCareJobController)

router.get('/todo/all', studentController.getAllTodoOfStudentController)
router.put('/todo/complete', studentController.updateTodoOfStudentController)

module.exports = router;