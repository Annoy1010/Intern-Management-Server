const express = require('express');
const router = express.Router();

const userController = require('../../controller/userController');

router.post('/auth', userController.handleLoginInput);
router.post('/login/token', userController.handleToken);
router.get('/data', userController.handleUserDataByToken);
router.put('/logout', userController.handleLogout);
router.post('/resetpassword/email', userController.verifyEmail);
router.post('/business/add', userController.addBusinessController);
router.get('/business', userController.getBusinessController);

module.exports = router;