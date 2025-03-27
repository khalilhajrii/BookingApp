const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

// Check if the model exists before creating it
const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

module.exports = Role;