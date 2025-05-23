const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
    * /api/auth/register:
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/activate/:token', authController.activateAccount);
module.exports = router;