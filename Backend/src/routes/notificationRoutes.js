
const express = require('express');
const NotificationController = require('../controllers/notificationController');
const router = express.Router();


router.post('/sendActivationLink', NotificationController.SendActivationAccount);

module.exports = router;
