const express = require('express');
const router = express.Router();
// const bodyParser = require('body-parser');
const Inventory = require('../models/inventorymodel');
const TotalPrice = require('../models/totalPricemodel');
const History = require('../models/historymodel');
// get Date to store in history
const currentDate = new Date();
const monthYear = currentDate.toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});

// Route for adding a new inventory item

router.post('/addinventory', async (req, res) => {
  try {
    const {
      p_id,
      company_name,
      product_name,
      product_type,
      product_quantity,
      product_price,
      product_image,
    } = req.body;

    // Ensure ID is unique
    const existingItem = await Inventory.findOne({ p_id });
    if (existingItem) {
      console.log('Item with this ID already exists');
      return res
        .status(400)
        .json({ error: 'Item with this ID already exists' });
    }

    const existingTotalPrice = await TotalPrice.findOne({});
    const totalPrice = existingTotalPrice ? existingTotalPrice.total_Price : 0;
    const p_Price_mul_p_Qty =
      parseFloat(product_price) * parseInt(product_quantity);
    const newTotalPrice = totalPrice + p_Price_mul_p_Qty;

    const newInventory = new Inventory({
      p_id,
      company_name,
      product_name,
      product_type,
      product_quantity,
      product_price,
      product_image,
    });
    await newInventory.save();
    if (existingTotalPrice) {
      existingTotalPrice.total_Price = newTotalPrice;
      await existingTotalPrice.save();
    } else {
      const newTotalPriceDocument = new TotalPrice({
        total_Price: newTotalPrice,
      });
      await newTotalPriceDocument.save();
    }

    const historyData = new History({
      p_id: p_id,
      company_name,
      product_name,
      product_type,
      product_quantity,
      product_price,
      status: 'New',
    });
    await historyData.save();

    res.status(201).json({ message: 'Inventory item added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

// GET route to retrieve all inventory items
router.get('/', async (req, res) => {
  try {
    // Extract the query parameters
    const { totalProducts, product_type, totalType } = req.query;

    // Check if the totalProducts query parameter is present
    if (totalProducts !== undefined) {
      // Find all inventory items
      const inventories = await Inventory.find({});

      // Calculate the total number of products
      const totalProductsCount = inventories.length;

      return res.status(200).json({ totalProducts: totalProductsCount });
    }

    // Check if the product_type query parameter is present
    if (product_type !== undefined) {
      // Find inventory items of the specified product type
      const itemsOfType = await Inventory.find({ product_type });

      // If no items found for the specified type, return a 404 error
      if (!itemsOfType || itemsOfType.length === 0) {
        return res
          .status(404)
          .json({ error: 'Items of specified type not found' });
      }

      // Return the list of inventory items of that type along with the count
      return res
        .status(200)
        .json({ items: itemsOfType, totalProducts: itemsOfType.length });
    }

    // Check if the totalType query parameter is present
    if (totalType !== undefined) {
      // Find all inventory items
      const inventories = await Inventory.find({});

      // Extract unique categories
      const uniqueCategories = new Set(
        inventories.map((item) => item.product_type)
      );
      const totalTypeCount = uniqueCategories.size;

      return res.status(200).json({ totalType: totalTypeCount });
    }

    // If no query parameters provided, return all inventory items
    const inventories = await Inventory.find({});
    return res.status(200).json(inventories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT route to update an inventory item
router.put('/:inventoryID', async (req, res) => {
  try {
    const inventoryID = req.params.inventoryID;
    const updatedInventoryData = req.body;

    // Validate incoming data
    if (
      updatedInventoryData.product_price !== undefined &&
      isNaN(parseFloat(updatedInventoryData.product_price))
    ) {
      return res.status(400).json({ error: 'Invalid product price' });
    }

    if (
      updatedInventoryData.product_quantity !== undefined &&
      isNaN(parseInt(updatedInventoryData.product_quantity))
    ) {
      return res.status(400).json({ error: 'Invalid product quantity' });
    }

    // Convert values to numbers
    updatedInventoryData.product_price = parseFloat(
      updatedInventoryData.product_price
    );
    updatedInventoryData.product_quantity = parseInt(
      updatedInventoryData.product_quantity
    );

    const inventoryItemBeforeUpdate = await Inventory.findOne({
      p_id: inventoryID,
    });

    if (!inventoryItemBeforeUpdate) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    let priceDifference =
      updatedInventoryData.product_price -
      inventoryItemBeforeUpdate.product_price;
    let quantityDifference =
      updatedInventoryData.product_quantity -
      inventoryItemBeforeUpdate.product_quantity;

    if (isNaN(priceDifference) || isNaN(quantityDifference)) {
      return res
        .status(400)
        .json({ error: 'Invalid price or quantity difference' });
    }

    if (priceDifference !== 0 && quantityDifference !== 0) {
      return res.status(500).json({
        error:
          'if both qty and price want to update then add complete product again',
      });
    }

    updatedInventoryData.total_Price = inventoryItemBeforeUpdate.total_Price;

    const existingTotalPrice = await TotalPrice.findOne({});

    if (quantityDifference !== 0) {
      let totalPriceUpdate =
        existingTotalPrice.total_Price +
        inventoryItemBeforeUpdate.product_price * quantityDifference;
      existingTotalPrice.total_Price = totalPriceUpdate;
      await existingTotalPrice.save();
    } else if (priceDifference !== 0) {
      let totalPriceUpdate =
        existingTotalPrice.total_Price +
        priceDifference * inventoryItemBeforeUpdate.product_quantity;
      existingTotalPrice.total_Price = totalPriceUpdate;
      await existingTotalPrice.save();
    }

    const response = await Inventory.findOneAndUpdate(
      { p_id: inventoryID },
      updatedInventoryData,
      {
        new: true,
        runValidators: true,
      }
    );

    const historyData = new History({
      p_id: updatedInventoryData.p_id,
      company_name: updatedInventoryData.company_name,
      product_name: updatedInventoryData.product_name,
      product_type: updatedInventoryData.product_type,
      previous_Qty: inventoryItemBeforeUpdate.product_quantity,
      product_quantity: updatedInventoryData.product_quantity,
      previous_Price: inventoryItemBeforeUpdate.product_price,
      product_price: updatedInventoryData.product_price,
      departmentName: updatedInventoryData.departmentName,
      dispatchedQty: updatedInventoryData.dispatchedQty,
      status: updatedInventoryData.status,
      time: monthYear,
    });
    await historyData.save();

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE route to delete an inventory item
router.delete('/:inventoryID', async (req, res) => {
  try {
    const inventoryID = req.params.inventoryID; // Extract the id from the URL parameter

    // Find the inventory item by p_id
    const itemToDelete = await Inventory.findOne({ p_id: inventoryID });

    // If inventory item not found, return a 404 error
    if (!itemToDelete) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // Find the existing total price from the database or default to 0 if not found
    const existingTotalPrice = await TotalPrice.findOne({});

    // Calculate the new total price by subtracting the product_price
    let newTotalPrice;
    if (existingTotalPrice) {
      const totalPrice = existingTotalPrice.total_Price;
      newTotalPrice =
        totalPrice - itemToDelete.product_price * itemToDelete.product_quantity;
    }

    // Update the total price in the total_Price collection
    if (existingTotalPrice) {
      existingTotalPrice.total_Price = newTotalPrice;
      await existingTotalPrice.save();
    } else {
      const newTotalPriceDocument = new TotalPrice({
        total_Price: newTotalPrice,
      });
      await newTotalPriceDocument.save();
    }

    // Delete the inventory item
    await Inventory.findByIdAndDelete(itemToDelete._id); // Use findByIdAndDelete with the retrieved item's _id

    const historyData = new History({
      p_id: itemToDelete.p_id,
      company_name: itemToDelete.company_name,
      product_name: itemToDelete.product_name,
      product_type: itemToDelete.product_type,
      product_quantity: itemToDelete.product_quantity,
      product_price: itemToDelete.product_price,
      status: 'Deleted',
      time: monthYear, // Set timestamp as month year
    });
    await historyData.save();

    // Log success message and respond with the deleted item
    res
      .status(200)
      .json({ response: 'Item deleted and total price is updated' }); // Respond with the deleted item (optional)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
