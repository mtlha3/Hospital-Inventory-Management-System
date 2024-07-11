const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '16mb' }));
app.use(cors());

const adminRoutes = require('./routes/adminroute');
const inventoryRoutes = require('./routes/inventoryroute');
const inventoryTotalPrice = require('./routes/totalPriceroute');
const historyData = require('./routes/historyroute');

const PORT = process.env.PORT || 3030;
const connectionString =
  process.env.MONGODB_URI ||
  'mongodb://0.0.0:27017/hospitalInventorysystemBUKC';
// 'mongodb+srv://amabdullah643:dbmongoAbdullah1@!@cluster0.9usrxp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use('/admin', adminRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/totalPrice', inventoryTotalPrice);
app.use('/history', historyData);

mongoose
  .connect(connectionString)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
