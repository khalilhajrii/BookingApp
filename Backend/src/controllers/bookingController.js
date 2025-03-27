const Booking = require('../models/booking');
const User = require('../models/User');
const Role = require('../models/role');

const listAllBarbers = async (req, res) => {
    try {
        const barberRole = await Role.findOne({ name: 'barber' });
        if (!barberRole) {
            return res.status(404).json({ message: 'Barber role not found' });
        }

        const barbers = await User.find({ role: barberRole._id })
            .select('username email phone address') 
            .populate('role', 'name'); 

        res.status(200).json(
            barbers);

    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving barbers', 
            error: error.message 
        });
    }
};

const createBooking = async (req, res) => {
    try {
        const { barberId, date, time } = req.body;
        const userId = req.user.userId;

        const barber = await User.findById(barberId);
        if (!barber || barber.role.name !== 'barber') {
            return res.status(400).json({ message: 'Invalid barber' });
        }

        const booking = new Booking({ user: userId, barber: barberId, date, time });
        await booking.save();

        res.status(200).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time } = req.body;
        const userId = req.user.userId;

        const booking = await Booking.findOne({ _id: id, user: userId });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.date = date || booking.date;
        booking.time = time || booking.time;
        await booking.save();

        res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const booking = await Booking.findOne({ _id: id, user: userId });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await booking.remove();

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
};

// Get all bookings for a barber (for barbers)
const getBarberBookings = async (req, res) => {
    try {
        const barberId = req.user.userId;
        const bookings = await Booking.find({ barber: barberId }).populate('user', 'username email');

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// Update booking status (for barbers)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const barberId = req.user.userId;

        const booking = await Booking.findOne({ _id: id, barber: barberId });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ message: 'Booking status updated successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking status', error: error.message });
    }
};

module.exports = {
    createBooking,
    updateBooking,
    deleteBooking,
    getBarberBookings,
    updateBookingStatus,
    listAllBarbers,
};