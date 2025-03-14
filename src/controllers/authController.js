const User = require('../models/User');
const Role = require('../models/Role');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
  
      const roleExists = await Role.findById(role);
      if (!roleExists) {
        return res.status(400).json({ message: 'Invalid role' });
      }
  
      const user = new User({ username, email, password, role });
      await user.save();
  
      const token = generateToken(user);
  
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email }).populate('role');
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const token = generateToken(user);
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  };

  
module.exports = { register, login };