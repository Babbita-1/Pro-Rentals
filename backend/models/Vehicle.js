const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  type: { type: String, enum: ["car", "bike", "bicycle"], required: true },
  brand: { type: String, required: true },
  model: { type: String },
  year: { type: Number },
  pricePerHour: { type: Number, required: true },
  available: { type: Boolean, default: true },
  description: { type: String },
  imageUrl: { type: String }, // URL to vehicle image
  seat: { type: Number },
  door: { type: Number },
  luggage: { type: String },
  transmission: { type: String },
  drive: { type: String },
  fuelType: { type: String },
  engine: { type: String },
  status: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
