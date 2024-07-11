const mongoose = require('mongoose'); // Import mongoose for database operations
const history_hospital_inventory_mongoose = require('mongoose'); // Import mongoose for database operations

// Define the schema
const history_inventory_schema = history_hospital_inventory_mongoose.Schema;

// Create the inventory list schema
const history_inventory_list_schema = new history_inventory_schema({
  p_id: {
    type: Number,
  },
  company_name: {
    type: String,
    required: [true, 'Please add company name'], // Company name is required
  },
  product_name: {
    type: String,
    required: [true, 'Please add product name'], // Product name is required
  },
  product_type: {
    type: String,
    required: [true, 'Please add product type'], // Product type is required
  },
  product_quantity: {
    type: Number,
    required: [true, 'Please add product quantity'], // Product quantity is required
  },
  previous_Qty: {
    type: Number,
  },
  product_price: {
    type: Number,
    required: [true, 'Please add product price'], // Product price is required
  },
  previous_Price: {
    type: Number,
  },
  dispatchedQty: {
    type: Number,
  },
  status: {
    type: String,
  },
  time: {
    type: String,
    default: new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
  },
  departmentName: {
    type: String,
  },
});

// Create the inventory model
const inventory_history = mongoose.model(
  'history',
  history_inventory_list_schema
);

// Export the inventory model
module.exports = inventory_history;
