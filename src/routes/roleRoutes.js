const express = require('express');
const RoleController = require('../controllers/RoleController');

const router = express.Router();


router.get('/getAllRoles', RoleController.getRoles);
router.get('/getRoleById', RoleController.getRoleById);
router.put('/updateRole/:id', RoleController.updateRole);
router.delete('/deleteRole/:id', RoleController.deleteRole); 

module.exports = router;