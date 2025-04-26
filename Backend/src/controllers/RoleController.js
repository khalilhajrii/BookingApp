const Role = require('../models/role');
const User = require('../models/User');


const addRole = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Role name is required' });
        }
        
        // Check if role with this name already exists
        const existingRole = await Role.findOne({ name: name.trim() });
        if (existingRole) {
            return res.status(409).json({ message: 'A role with this name already exists' });
        }
        
        const role = new Role({ name: name.trim() });
        await role.save();
        res.status(201).json({ role, message: 'Role created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error: error.message });
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
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Role name is required' });
        }
        
        // Check if another role with this name already exists
        const existingRole = await Role.findOne({ 
            name: name.trim(),
            _id: { $ne: id } // exclude the current role
        });
        
        if (existingRole) {
            return res.status(409).json({ message: 'A role with this name already exists' });
        }

        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true }
        );

        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ role: updatedRole, message: 'Role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if the role is in use by any users
        const usersWithRole = await User.countDocuments({ role: id });
        
        if (usersWithRole > 0) {
            return res.status(409).json({ 
                message: 'Role is currently in use by users and cannot be deleted',
                usersCount: usersWithRole 
            });
        }
        
        const deletedRole = await Role.findByIdAndDelete(id);

        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
};

module.exports = { getRoles, getRoleById, updateRole, deleteRole, addRole };