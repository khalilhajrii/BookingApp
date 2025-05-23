const User = require('../models/User');
const Role = require('../models/role');
const { generateToken } = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');
const notificationController = require('../controllers/notificationController');

const register = async (req, res) => {
  try {
    const { username, name, lastname, dateOfBirth, sexe, email, password, role, phone, address, sender } = req.body;

    const roleExists = await Role.findOne({name:role}).select('_id');
    if (!roleExists) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const activationToken = uuidv4();
    const user = new User({ 
      username,
      name,
      lastname,
      dateOfBirth,
      sexe, 
      email, 
      password, 
      role: roleExists._id,
      phone, 
      address, 
      activationToken,
      isAccountActivated: sender === 'admin' ? true : false
    });
    await user.save();

    if (sender === 'admin') {
      try {
        await notificationController.sendCredentialsNotification(user, password);
      } catch (notifError) {
        console.error('Failed to send credentials notification:', notifError);
      }
    }

    res.status(201).json({
      message: sender === 'admin' 
        ? 'User created successfully by admin. Account is activated.' 
        : 'User registered successfully. Please check your email to activate your account.',
      user: {
        name: user.name,
        lastname: user.lastname,
        dateOfBirth: user.dateOfBirth,
        sexe: user.sexe,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        isAccountActivated: user.isAccountActivated,
        username: user.username,
        email: user.email,
        activationToken: user.activationToken,
        _id: user._id,
      },
    });
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