const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(id).populate('role');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, phone, address } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, role, phone, address },
            { new: true }
        ).populate('role');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };