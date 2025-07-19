const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: false }, // not required
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: false }, // not required
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  durationInDays: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  pickupLocation: { type: String, required: true },
  notes: { type: String },
  status: { type: String, default: "pending" },
  source: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);