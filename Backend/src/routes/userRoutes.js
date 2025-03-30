const express = require('express');
const userController = require('../controllers/UserController');
const authController = require('../controllers/authController');
const checkRole = require('../middleware/checkRole');
const jwtMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/getAllusers',jwtMiddleware, checkRole(['admin']), userController.getUsers);
router.get('/getuserById/:id',jwtMiddleware, checkRole(['admin','barber']), userController.getUserById);
router.get('/getuserByUserName/:username',jwtMiddleware, checkRole(['admin']), userController.getUserByUserName);
router.put('/updateUser/:id',jwtMiddleware, checkRole(['admin']), userController.updateUser);
router.delete('/deleteUser/:id',jwtMiddleware, checkRole(['admin']), userController.deleteUser); 

module.exports = router;