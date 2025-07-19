const Item = require("../models/Item");
const Booking = require("../models/Booking");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// GET /api/items
exports.getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalItems = await Item.countDocuments();

    const items = await Item.find()
      .populate("createdBy", "name email phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      items,
      currentPage: page,
      totalPages,
      totalItems
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// POST /api/items
exports.createItem = async (req, res) => {
  try {
    // Allow both JWT admin and session admin
    if (!(req.user && req.user.role === 'admin') && !(req.session && req.session.admin)) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const { brand, model, price, status, imageUrl, description, year } = req.body;
    if (!brand || !model || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Only use imageUrl from the request body
    const newItem = new Item({
      brand,
      model,
      year,
      pricePerHour: price,
      description,
      imageUrl, // always from body
      status,
      createdBy: req.user?._id || (req.session && req.session.admin && req.session.admin.id),
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Failed to create item' });
  }
};

// GET /api/items/:id
exports.getItemById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    console.log("Fetching item with ID:", req.params.id);
    const item = await Item.findById(req.params.id)
      .populate("createdBy", "name email phoneNumber");

    if (!item) {
      console.log("Item not found for ID:", req.params.id);
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Failed to fetch item details", error: error.message });
  }
};

// DELETE /api/items/:id
exports.getItemsByUser = async (req, res) => {
  try {
    const items = await Item.find({ createdBy: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your items" });
  }
};

// DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  try {
    // Only allow admin
    if (!(req.user && req.user.role === 'admin') && !(req.session && req.session.admin)) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const itemId = req.params.id;

    // check for existing bookings for this item
    const existingBookings = await Booking.find({ item: itemId });
    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "Cannot delete item with active bookings." });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete item." });
  }
};

exports.updateItem = async (req, res) => {
  try {
    // Only allow admin
    if (!(req.user && req.user.role === 'admin') && !(req.session && req.session.admin)) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const itemId = req.params.id;
    const updateFields = req.body;
    const item = await Item.findByIdAndUpdate(itemId, updateFields, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item.' });
  }
};

exports.getAvailableItemImages = (req, res) => {
  const imagesDir = path.join(__dirname, '../../frontend/public/item-images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read images directory' });
    }
    const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    res.json({ images });
  });
};