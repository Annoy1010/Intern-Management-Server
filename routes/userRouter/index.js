const express = require('express');
const router = express.Router();

const userController = require('../../controller/userController');

router.post('/auth', userController.handleLoginInput);
router.post('/login/token', userController.handleToken);
router.get('/account/data', userController.handleUserAccountDataByToken);
router.get('/person/data', userController.handleUserPersonDataByToken);
router.put('/logout', userController.handleLogout);
router.post('/resetpassword/email', userController.verifyEmail);
router.post('/business', userController.saveBusiness);
router.get('/business/all', userController.getBusinessController);
router.put('/business/edit', userController.putBusinessController);
router.put('/:id', userController.updateUser);
router.get('/student', userController.getStudent);
router.put('/student/:id', userController.updateStudent);
router.get('/teacher', userController.getTeacher);
router.put('/teacher/:id', userController.updateTeacher);
router.get('/', userController.getUserInfo);

module.exports = router;