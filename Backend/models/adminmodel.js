const hospital_inventory_mongoose = require('mongoose'); // Import mongoose for database operations

// Define the admin schema
const adminSchema = new hospital_inventory_mongoose.Schema({
  adminname: {
    type: String,
    required: [true, 'Please add a name'], // Name is required
  },
  email: {
    type: String,
    required: [true, 'Please add an email'], // Email is required
    unique: true, // Email should be unique
    trim: true, // Trim whitespace from email
    match: [
      // Regular expression for email validation
      /^[\w-]+(?:\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'], // Password is required
  },
  address: {
    type: String,
    required: [true, 'Please add an address'], // Address is required
  },
  contact: {
    type: String,
    required: [true, 'Please add a number'], // Contact number is required
  },
});

const Admin = hospital_inventory_mongoose.model('Admin', adminSchema);
module.exports = Admin;
