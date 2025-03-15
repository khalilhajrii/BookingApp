const User = require('../models/User');
const Role = require('../models/Role');
const { generateToken } = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../config/email');

const register = async (req, res) => {
  try {
    const { username, email, password, role, phone, address } = req.body;

    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const activationToken = uuidv4();
    const user = new User({ username, email, password, role, phone, address, activationToken });
    await user.save();
    const activationLink = `http://localhost:3000/api/auth/activate/${activationToken}`;
    const emailSubject = 'Activate Your Account';
    const emailText = `Click the link below to activate your account:\n\n${activationLink}`;
    await sendEmail(email, emailSubject, emailText);
    res.status(200).json({ user });
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
    if (user.isAccountActivated === false) {
      return res.status(400).json({ message: 'Account not activated' });
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

const activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ activationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired activation token' });
    }
    user.isAccountActivated = true;
    await user.save();
    res.status(200).json({ message: 'Account activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error activating account', error: error.message });
  }
};

module.exports = { register, login, activateAccount };