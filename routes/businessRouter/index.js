const express = require('express');
const router = express.Router();

const businessController = require('../../controller/businessController');

router.get('/job', businessController.getJobsController);
router.post('/job', businessController.addJob);


module.exports = router;