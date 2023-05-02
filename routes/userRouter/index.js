const express = require('express');
const router = express.Router();

const userController = require('../../controller/userController');

router.post('/auth', userController.handleLoginInput);
router.post('/login/token', userController.handleToken);
router.get('/data', userController.handleUserDataByToken);
router.put('/logout', userController.handleLogout);

module.exports = router;