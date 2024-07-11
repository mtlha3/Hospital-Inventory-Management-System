// totalPriceroute.js

const express = require('express');
const router = express.Router();
const allhistory = require('../models/historymodel');

// Route to get the total price
router.get('/', async (req, res) => {
  try {
    const history = await allhistory.find({});
    res.status(200).json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
