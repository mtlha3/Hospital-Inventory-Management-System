// totalPriceroute.js

const express = require('express');
const router = express.Router();
const TotalPrice = require('../models/totalPricemodel');

// Route to get the total price
router.get('/', async (req, res) => {
  try {
    const totalPrice = await TotalPrice.findOne({});
    res.status(200).json(totalPrice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
