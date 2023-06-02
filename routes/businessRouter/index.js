const express = require('express');
const router = express.Router();

const businessController = require('../../controller/businessController');

router.get('/job', businessController.getJobsController);
router.post('/job', businessController.addJob);
router.get('/jobs', businessController.getAllJobs);



module.exports = router;