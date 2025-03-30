const express = require('express');
const RoleController = require('../controllers/RoleController');
const checkRole = require('../middleware/checkRole');
const jwtMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/addRole', jwtMiddleware, checkRole(['admin']),RoleController.addRole);
router.get('/getAllRoles',jwtMiddleware, checkRole(['admin','user','barber']), RoleController.getRoles);
router.get('/getRoleById/:id', jwtMiddleware, checkRole(['admin']), RoleController.getRoleById);
router.put('/updateRole/:id', jwtMiddleware, checkRole(['admin']), RoleController.updateRole);
router.delete('/deleteRole/:id', jwtMiddleware, checkRole(['admin']), RoleController.deleteRole);

module.exports = router;