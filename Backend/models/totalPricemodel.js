const mongoose = require('mongoose'); // Import mongoose for database operations
const hospital_inventory_totalPrice_mongoose = require('mongoose'); // Import mongoose for database operations

// Define the schema
const inventory_schema = hospital_inventory_totalPrice_mongoose.Schema;

// Create the inventory list schema
const inventory_list_schema = new inventory_schema({
  total_Price: {
    type: Number,
    required: [true, 'Please add total price'],
  },
});

// Create the inventory model
const inventoryTotalPrice = mongoose.model(
  'InventoryTotalPrice',
  inventory_list_schema
);

// Export the inventory model
module.exports = inventoryTotalPrice;
