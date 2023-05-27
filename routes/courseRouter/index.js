const express = require('express');
const router = express.Router();

const courseController = require('../../controller/courseController');

router.put('/confirm', courseController.confirmSignUpController);

module.exports = router;