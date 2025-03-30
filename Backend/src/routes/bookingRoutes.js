const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const checkRole = require('../middleware/checkRole');
const jwtMiddleware = require('../middleware/authMiddleware');

router.post('/bookings', jwtMiddleware, checkRole(['user']), bookingController.createBooking);
router.put('/booking/:id', jwtMiddleware, checkRole(['user', 'barber', 'admin']), bookingController.updateBooking);
router.delete('/booking/:id', jwtMiddleware, checkRole(['user']), bookingController.deleteBooking);
router.get('/bookings/allBarbers', jwtMiddleware, checkRole(['user', 'barber']), bookingController.listAllBarbers);
router.get('/barber/bookings', jwtMiddleware, checkRole(['user', 'barber', 'admin']), bookingController.getBarberBookings);
router.get('/barber/:barberId/bookings', jwtMiddleware, checkRole([ 'barber','user', 'admin']), bookingController.getBookingsByBarberId);
router.get('/user/bookings', jwtMiddleware, checkRole(['user', 'admin']), bookingController.getUserBookings);

module.exports = router;