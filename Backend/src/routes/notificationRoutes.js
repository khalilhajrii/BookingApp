
const express = require('express');
const NotificationController = require('../controllers/notificationController');
const router = express.Router();
const jwtMiddleware = require('../middleware/authMiddleware');

router.post('/sendActivationLink', NotificationController.SendActivationAccount);
router.get('/getNotification',jwtMiddleware, NotificationController.getnotification);
router.put('/updateNotificationStatus/:id', jwtMiddleware, NotificationController.UpdateNotifStatus);
module.exports = router;
