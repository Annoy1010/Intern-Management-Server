const express = require('express');
const router = express.Router();

const chatController = require('../../controller/chatController');

router.get('/teacher', chatController.getTeacher);
router.get('/student', chatController.getStudents);
router.get('/message', chatController.getMessage);
router.get('/message/:id', chatController.getMessageTeacher);

module.exports = router;