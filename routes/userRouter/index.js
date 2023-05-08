const express = require('express');
const router = express.Router();

const userController = require('../../controller/userController');

router.post('/auth', userController.handleLoginInput);
router.post('/login/token', userController.handleToken);
router.get('/account/data', userController.handleUserAccountDataByToken);
router.get('/person/data', userController.handleUserPersonDataByToken);
router.put('/logout', userController.handleLogout);

module.exports = router;