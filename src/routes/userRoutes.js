const express = require('express');
const authController = require('../controllers/UserController');

const router = express.Router();


router.get('/getAllusers', authController.getUsers);
router.get('/getuserById', authController.getUserById);
router.put('/updateUser/:id', authController.updateUser);
router.delete('/deleteUser/:id', authController.deleteUser); 

module.exports = router;