const express = require('express');
const router = express.Router();

const studentController = require('../../controller/studentController');

router.get('/', studentController.getAllStudentsController);
router.post('/add', studentController.addStudentController);
router.put('/update', studentController.updateStudentController);
router.post('/delete', studentController.deleteStudentController);
router.get('/year', studentController.getStudentOfYearController);
router.post('/job/:id', studentController.saveRequestJobIntern);
router.post('/job/:id/save_interested', studentController.saveJobInterest);
router.get('/job/interested', studentController.getJobInterested);


module.exports = router;