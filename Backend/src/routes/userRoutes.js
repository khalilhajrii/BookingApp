const express = require('express');
const authController = require('../controllers/UserController');

const router = express.Router();


router.get('/getAllusers', authController.getUsers);
router.get('/getuserById/:id', authController.getUserById);
router.get('/getuserByUserName/:username', authController.getUserByUserName);
router.put('/updateUser/:id', authController.updateUser);
router.delete('/deleteUser/:id', authController.deleteUser); 

module.exports = router;