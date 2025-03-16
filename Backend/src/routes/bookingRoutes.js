const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const checkRole = require('../middleware/checkRole');

router.post('/bookings', checkRole('user'), bookingController.createBooking);
router.put('/bookings/:id', checkRole('user'), bookingController.updateBooking);
router.delete('/bookings/:id', checkRole('user'), bookingController.deleteBooking);

// Barber routes
router.get('/barber/bookings', checkRole('barber'), bookingController.getBarberBookings);
router.put('/barber/bookings/:id', checkRole('barber'), bookingController.updateBookingStatus);

module.exports = router;