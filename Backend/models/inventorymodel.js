const mongoose = require('mongoose'); // Import mongoose for database operations

// Define the schema
const inventory_schema = mongoose.Schema;

// Create the inventory list schema
const inventory_list_schema = new inventory_schema({
  p_id: {
    type: Number,
    unique: true,
    // required: true,
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
  product_price: {
    type: Number,
    required: [true, 'Please add product price'], // Product price is required
  },
  product_image: {
    type: String,
  },
});

// Create the inventory model
const Inventory = mongoose.model('Inventory', inventory_list_schema);

// Export the inventory model
module.exports = Inventory;
