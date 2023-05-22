const express = require('express');
const router = express.Router();

const departmentController = require('../../controller/departmentController');

router.get('/', departmentController.getDepartmentController);

module.exports = router;