const express = require("express");
const router = express.Router();
const { createBooking, getUserBookings, getAdminStats, getAllBookings, adminUpdateBookingStatus, getBookingById, deleteBooking } = require("../controllers/bookingController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Session-based admin middleware
const sessionAdmin = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ message: 'Not authorized as admin' });
};

router.get("/admin-stats", sessionAdmin, getAdminStats);
router.get("/admin-all", sessionAdmin, getAllBookings);
router.put("/admin-status/:id", sessionAdmin, adminUpdateBookingStatus);

router.post("/", authenticateUser, createBooking);
router.get("/my-bookings", authenticateUser, getUserBookings);
router.get("/my-items", authenticateUser, require("../controllers/bookingController").getBookingsForMyItems);
router.get("/:id", authenticateUser, getBookingById);
router.delete("/:id", authenticateUser, deleteBooking);

module.exports = router;
