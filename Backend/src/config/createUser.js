const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const dotenv = require('dotenv');
dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const userRole = await Role.findOne({ name: 'user' });

    const newUser = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123', 
      role: userRole._id,
      phone: '1234567890',
        address: '123 Main St',
    });

    await newUser.save();
    console.log('User created successfully:', newUser);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    mongoose.disconnect();
  }
};

createUser();