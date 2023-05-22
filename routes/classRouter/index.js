const express = require('express');
const router = express.Router();

const classController = require('../../controller/classController');

router.post('/add', classController.addClassController);
router.get('/', classController.getClassAllController);
router.get('/year', classController.getClassYearController);
router.get('/academicyear', classController.getAcademicYearController);
router.put('/update', classController.updateClassController);
router.delete('/delete', classController.deleteClassController);
router.get('/department', classController.getClassOfDepartmentController);

module.exports = router;