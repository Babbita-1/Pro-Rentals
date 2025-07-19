const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  // type field removed as ItemType is deleted
  brand: { type: String },
  model: { type: String },
  year: { type: Number },
  pricePerHour: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  status: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);
