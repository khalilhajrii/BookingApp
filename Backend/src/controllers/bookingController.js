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
        const userId = req.user.id;
        const status = 'pending';
        const createdAt = new Date();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const barber = await User.findById(barberId).populate('role');
        if (!barber || barber.role.name !== 'barber') {
            return res.status(400).json({ message: 'Invalid barber' });
        }
        const bookingDate = new Date(date);
        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) {
            return res.status(400).json({ message: 'Invalid time format. Use HH:mm format' });
        }

        const booking = new Booking({ 
            user: userId, 
            barber: barberId, 
            date: bookingDate,
            time: time, 
            status: status, 
            createdAt: createdAt 
        });

        try {
            await booking.save();
            res.status(200).json({ booking });
        } catch (saveError) {
            console.error('Save error details:', saveError);
            return res.status(400).json({ 
                message: 'Error saving booking', 
                error: saveError.message,
                details: saveError.errors 
            });
        }
    } catch (error) {
        console.error('General error:', error);
        res.status(500).json({ 
            message: 'Error creating booking', 
            error: error.message,
            stack: error.stack 
        });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, status } = req.body;
        const userId = req.user.id;

        const booking = await Booking.findOne({ _id: id, user: userId });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update fields if provided
        if (date) {
            const bookingDate = new Date(date);
            if (isNaN(bookingDate.getTime())) {
                return res.status(400).json({ message: 'Invalid date format' });
            }
            booking.date = bookingDate;
        }

        if (time) {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(time)) {
                return res.status(400).json({ message: 'Invalid time format. Use HH:mm format' });
            }
            booking.time = time;
        }

        if (status) {
            if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }
            booking.status = status;
        }

        await booking.save();

        res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await Booking.findOne({ _id: id, user: userId });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await Booking.deleteOne({ _id: id, user: userId });

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
};

const getBarberBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = {};
        
        if (userRole === 'barber') {
            query.barber = userId;
        }
        else if (userRole === 'user') {
            query.user = userId;
        }
        else if (userRole === 'admin') {
        }

        const bookings = await Booking.find(query)
            .populate('user', 'username email')
            .populate('barber', 'username email')
            .sort({ date: 1, time: 1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

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

const getBookingsByBarberId = async (req, res) => {
    try {
        const { barberId } = req.params;
        const userRole = req.user.role.name;

        const barber = await User.findById(barberId).populate('role');
        if (!barber || barber.role.name !== 'barber') {
            return res.status(400).json({ message: 'Invalid barber' });
        }

        const bookings = await Booking.find({ barber: barberId })
            .populate('user', 'username email')
            .populate('barber', 'username email')
            .sort({ date: 1, time: 1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.find({ user: userId })
            .populate('barber', 'username email')
            .sort({ date: -1, time: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
    }
};

module.exports = {
    createBooking,
    updateBooking,
    deleteBooking,
    getBarberBookings,
    updateBookingStatus,
    listAllBarbers,
    getBookingsByBarberId,
    getUserBookings
};