const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const checkRole = require('../middleware/checkRole');
const jwtMiddleware = require('../middleware/authMiddleware');

router.post('/bookings', jwtMiddleware, checkRole(['user']), bookingController.createBooking);
router.put('/bookings/:id', jwtMiddleware, checkRole(['user']), bookingController.updateBooking);
router.delete('/booking/:id', jwtMiddleware, checkRole(['user']), bookingController.deleteBooking);
router.get('/bookings/allBarbers', jwtMiddleware, checkRole(['user', 'barber']), bookingController.listAllBarbers);

// Modified route to accept multiple roles
router.get('/barber/bookings', jwtMiddleware, checkRole(['user', 'barber', 'admin']), bookingController.getBarberBookings);
router.put('/barber/bookings/:id', jwtMiddleware, checkRole(['barber']), bookingController.updateBookingStatus);

// New route to get bookings by barber ID
router.get('/barber/:barberId/bookings', jwtMiddleware, checkRole(['user', 'barber', 'admin']), bookingController.getBookingsByBarberId);

// New route to get user's bookings
router.get('/user/bookings', jwtMiddleware, checkRole(['user', 'barber', 'admin']), bookingController.getUserBookings);

module.exports = router;