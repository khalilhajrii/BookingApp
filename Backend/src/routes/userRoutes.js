const express = require('express');
const authController = require('../controllers/UserController');
const checkRole = require('../middleware/checkRole');
const jwtMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/getAllusers',jwtMiddleware, checkRole(['admin']), authController.getUsers);
router.get('/getuserById/:id',jwtMiddleware, checkRole(['admin','barber']), authController.getUserById);
router.get('/getuserByUserName/:username',jwtMiddleware, checkRole(['admin']), authController.getUserByUserName);
router.put('/updateUser/:id',jwtMiddleware, checkRole(['admin']), authController.updateUser);
router.delete('/deleteUser/:id',jwtMiddleware, checkRole(['admin']), authController.deleteUser); 

module.exports = router;