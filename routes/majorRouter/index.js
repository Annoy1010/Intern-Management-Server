const express = require('express');
const router = express.Router();

const majorController = require('../../controller/majorController');

router.get('/department', majorController.getMajorOfDepartmentController);

module.exports = router;