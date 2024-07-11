const express = require('express');
const router = express.Router();
const Admin = require('../models/adminmodel');
const history = require('../models/historymodel');

// Maximum allowed admins
const MAX_ADMINS = 2;

// Minimum allowed admins
const MIN_ADMINS = 1;

// Route for admin registration
router.post('/register', async (req, res) => {
  try {
    // Extract email, password, adminname, address, and contact from request body
    const { email, password, adminname, address, contact } = req.body;

    // Check if email, password, adminname, address, or contact is missing
    if (!email || !password || !adminname || !address || !contact) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Count existing admins
    const adminCount = await Admin.countDocuments({});

    // Check if admin registration limit is reached
    if (adminCount >= MAX_ADMINS) {
      return res.status(403).json({
        error: 'Maximum number of admins reached Admin cannot be more than 2',
      });
    }

    // Check if admin with email already exists (optional)
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create a new admin object
    const newAdmin = new Admin({
      email,
      password,
      adminname,
      address,
      contact,
    });

    // Save the admin to the database
    await newAdmin.save();

    // Respond with success message or redirect to login page
    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/adminlogin', async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find the admin by email
    const adminUser = await Admin.findOne({ email: email });

    // If admin does not exist, return error
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid Email or Password' });
    }

    // Compare the provided password with the stored password
    if (adminUser.password !== password) {
      return res.status(401).json({ error: 'Invalid Email or Password' });
    }

    // const historyData = new history({
    //   adminlogin: adminUser.email,
    //   time: monthYear, // Set timestamp as month year
    // });
    // await historyData.save();
    // For simplicity, we'll just return a success message
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Profile route
router.get('/profile', async (req, res) => {
  try {
    // Extract admin email from request parameters
    const adminEmail = req.query.email;

    // Check if adminId is provided in the query parameters
    if (adminEmail) {
      // Find admin by ID
      const admin = await Admin.findOne({ email: adminEmail });
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      return res.status(200).json({ admin });
    } else {
      // Find all admins
      const alladmins = await Admin.find({});
      return res.status(200).json({ alladmins });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update admin password
router.put('/profile/:adminEmail', async (req, res) => {
  try {
    // Extract admin email from request parameters
    const adminEmail = req.params.adminEmail; // Change from req.query.email to req.params.adminEmail

    // Extract updated fields from request body
    const { adminname, email, password, address, contact } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ email: adminEmail });

    // If admin does not exist, return error
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Update admin fields if provided in request body
    if (email) {
      admin.email = email;
    }
    if (password) {
      admin.password = password;
    }
    if (adminname) {
      admin.adminname = adminname;
    }
    if (address) {
      admin.address = address;
    }
    if (contact) {
      admin.contact = contact;
    }

    // Save the updated admin
    await admin.save();

    console.log('Admin profile updated');
    res.status(200).json({ message: 'Admin profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get the count of admins
router.get('/count', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments({});
    res.status(200).json({ count: adminCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete admin account
router.delete('/:adminEmail', async (req, res) => {
  try {
    const adminEmail = req.params.adminEmail; // Extract the admin ID from the URL parameter
    const { password } = req.body; // Extract the password from the request body

    // Extract adminId from request body
    const adminEmailToDelete = await Admin.findOne({ email: adminEmail });

    // Check if adminId are present in the request body
    if (!adminEmailToDelete) {
      return res.status(400).json({ error: 'AdminEmail not found' });
    }

    // Verify if the provided password matches the admin's password
    if (adminEmailToDelete.password != password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Count existing admins
    const adminCount = await Admin.countDocuments({});

    // Check if admin deletion limit is reached
    if (adminCount <= MIN_ADMINS) {
      return res.status(403).json({
        error:
          'Minimum number of admins must be 1. Admins cannot be less than 1.',
      });
    }

    // Delete the admin account
    await Admin.findOneAndDelete({ email: adminEmail });

    console.log('Admin deleted');
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
