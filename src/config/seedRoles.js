const mongoose = require('mongoose');
const Role = require('../models/Role');
const dotenv = require('dotenv');
dotenv.config();

const seedRoles = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const roles = [
      { name: 'user' },
      { name: 'admin' },
      { name: 'barber' },
    ];

    await Role.insertMany(roles);
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedRoles();