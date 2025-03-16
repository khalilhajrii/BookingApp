const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const checkRole = require('../middleware/checkRole');
const jwtMiddleware = require('../middleware/authMiddleware');

router.post('/bookings', jwtMiddleware, checkRole('user'), bookingController.createBooking);
router.put('/bookings/:id', jwtMiddleware, checkRole('user'), bookingController.updateBooking);
router.delete('/bookings/:id', jwtMiddleware, checkRole('user'), bookingController.deleteBooking);

// Barber routes
router.get('/barber/bookings', jwtMiddleware, checkRole('barber'), bookingController.getBarberBookings);
router.put('/barber/bookings/:id', jwtMiddleware, checkRole('barber'), bookingController.updateBookingStatus);

module.exports = router;