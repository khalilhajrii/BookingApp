
const Role = require('../models/Role');


const addRole = async (req, res) => {
    try {
        const { name } = req.body;
        const role = new Role({ name });
        await role.save();
        res.status(200).json({ role });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};


const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({ roles });
    } catch (error) {
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
};

const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id);
        res.status(200).json({ role });
    } catch (error) {
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
};
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );

        if (!updatedRole) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRole = await Role.findByIdAndDelete(id);

        if (!deletedRole) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

module.exports = { getRoles, getRoleById, updateRole, deleteRole,addRole };