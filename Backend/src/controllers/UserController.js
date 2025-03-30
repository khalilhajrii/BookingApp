const User = require('../models/User');
const notificationController = require('./notificationController');

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
        const { id } = req.params;
        const user = await User.findById(id).populate('role');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
};
const getUserByUserName = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).populate('role');

        if (user) {
            return res.status(409).json({ message: 'Duplicated username', user });
        } else {
            return res.status(200).json({ message: 'Username is available' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error getting user', error: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role, phone, address, name, lastname, dateOfBirth, sexe } = req.body;

        const originalUser = await User.findById(id).populate('role');
        if (!originalUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateData = { 
            username, 
            email, 
            role, 
            phone, 
            address,
            name,
            lastname,
            dateOfBirth,
            sexe
        };

        let passwordChanged = false;
        if (password && password.trim() !== '') {
            updateData.password = password;
            passwordChanged = true;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('role');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (originalUser.email !== email || passwordChanged) {
            try {
                await notificationController.sendAccountUpdateNotification(
                    updatedUser, 
                    {
                        emailChanged: originalUser.email !== email,
                        passwordChanged,
                        originalEmail: originalUser.email,
                        plainPassword: passwordChanged ? password : null
                    }
                );
            } catch (notifError) {
                console.error('Failed to send account update notification:', notifError);
            }
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

module.exports = { getUsers, getUserById, updateUser, deleteUser, getUserByUserName };