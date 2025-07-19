const Booking = require("../models/Booking");
const Item = require("../models/Item");
const Vehicle = require("../models/Vehicle");

// Create a booking (supports both item and vehicle)
exports.createBooking = async (req, res) => {
  try {
    const { item: itemId, vehicle: vehicleId, startDate, durationInDays, pickupLocation, notes } = req.body;

    let refDoc = null;
    let refField = null;

    if (itemId) {
      refDoc = await Item.findById(itemId);
      refField = "item";
      if (!refDoc) return res.status(404).json({ message: "Item not found" });
    } else if (vehicleId) {
      refDoc = await Vehicle.findById(vehicleId);
      refField = "vehicle";
      if (!refDoc) return res.status(404).json({ message: "Vehicle not found" });
    } else {
      return res.status(400).json({ message: "Must provide item or vehicle ID" });
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationInDays);

    const pricePerHour = refDoc.pricePerHour || 0;
    const totalPrice = pricePerHour * 24 * durationInDays;

    const bookingData = {
      user: req.user._id,
      startDate,
      endDate,
      durationInDays,
      totalPrice,
      pickupLocation,
      notes,
      source: req.body.source // Save the source field if provided
    };
    bookingData[refField] = refDoc._id;

    const newBooking = await Booking.create(bookingData);

    // Don't change item/vehicle status when booking is created
    // Status will be updated only when admin marks transaction as completed

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// Get bookings of logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("item", "brand model pricePerHour imageUrl description year")
      .populate("vehicle", "brand model pricePerHour imageUrl description year type available seat door luggage transmission drive fuelType engine status")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("item")
      .populate("vehicle", "brand model imageUrl type year pricePerHour status")
      .populate("user")
      .exec();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a booking (by the user who created it, any status)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking belongs to the logged-in user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Allow deleting any booking, regardless of status
    await booking.deleteOne();

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update booking status (only by item owner)
exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;

    // Validate input
    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(bookingId).populate('item').populate('vehicle');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the logged-in user is the owner of the item or vehicle
    if ((!booking.item || booking.item.createdBy.toString() !== req.user.id) && 
        (!booking.vehicle || booking.vehicle.createdBy.toString() !== req.user.id)) {
      return res.status(403).json({ message: "Only the item/vehicle owner can update booking status." });
    }

    booking.status = status;
    await booking.save();

    // Update item or vehicle status accordingly
    if (booking.item) {
      if (status === 'pending') {
        // Keep item as Available when booking is pending
        await Item.findByIdAndUpdate(booking.item, { status: 'Available' });
      } else if (status === 'confirmed') {
        // Keep item as Available when booking is confirmed (not yet rented)
        await Item.findByIdAndUpdate(booking.item, { status: 'Available' });
      } else if (status === 'cancelled') {
        await Item.findByIdAndUpdate(booking.item, { status: 'Available' });
      } else if (status === 'completed') {
        // Mark item as Rented only when transaction is completed
        await Item.findByIdAndUpdate(booking.item, { status: 'Rented' });
      }
    }
    if (booking.vehicle) {
      if (status === 'pending') {
        // Keep vehicle as Available when booking is pending
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'Available' });
      } else if (status === 'confirmed') {
        // Keep vehicle as Available when booking is confirmed (not yet rented)
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'Available' });
      } else if (status === 'cancelled') {
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'Available' });
      } else if (status === 'completed') {
        // Mark vehicle as Rented only when transaction is completed
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'Rented' });
      }
    }

    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

// Get bookings for items created by the logged-in user
exports.getBookingsForMyItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all bookings and populate item and user
    const bookings = await Booking.find()
      .populate({
        path: "item",
        select: "brand model createdBy",
        populate: { path: "createdBy", select: "_id name email" }
      })
      .populate("user", "name email phoneNumber");

    // Filter bookings where item's createdBy matches logged-in user
    const myItemBookings = bookings.filter(
      (booking) => booking.item?.createdBy?._id?.toString() === userId
    );

    res.json(myItemBookings);

  } catch (err) {
    console.error("Error getting bookings for my items:", err);
    res.status(500).json({ message: "Server error fetching bookings." });
  }
};

// Get admin dashboard stats: sales chart, recent bookings, recent transactions
exports.getAdminStats = async (req, res) => {
  try {
    // Check if session admin is present
    if (!req.session || !req.session.admin) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    // Sales data: group by day for last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const salesData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lte: today },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%d %b', date: '$createdAt' } },
          sales: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Fill missing days with 0 sales
    const salesMap = {};
    salesData.forEach(d => { salesMap[d._id] = d.sales; });
    const salesChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      salesChart.push({ date: label, sales: salesMap[label] || 0 });
    }

    // Recent bookings (last 2)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .populate('user', 'name email phoneNumber')
      .populate('item', 'brand model')
      .populate('vehicle', 'brand model');

    // Recent transactions (last 6)
    const recentTransactions = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('user', 'name email');

    // Format transactions for frontend
    const transactions = recentTransactions.map(b => ({
      transaction: b.status === 'cancelled' ? `Payment failed from #${b._id.toString().slice(-6)}` : `Payment from ${b.user?.name || 'User'}`,
      date: b.createdAt,
      amount: b.totalPrice,
      status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
    }));

    res.json({
      salesChart,
      recentBookings: recentBookings.map(b => ({
        name: b.item ? `${b.item.brand} ${b.item.model}` : b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'N/A',
        user: b.user?.name || 'User',
        email: b.user?.email || '',
        phone: b.user?.phoneNumber || '',
        daysAgo: Math.floor((today - b.createdAt) / (1000 * 60 * 60 * 24))
      })),
      transactions
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
};

// Admin: Get all booking requests
exports.getAllBookings = async (req, res) => {
  try {
    if (!req.session || !req.session.admin) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const bookings = await Booking.find()
      .populate('user', 'name email phoneNumber') 
      .populate('item', 'brand model imageUrl')
      .populate('vehicle', 'brand model imageUrl')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// Admin: Update booking status (approve/reject)
exports.adminUpdateBookingStatus = async (req, res) => {
  try {
    if (!req.session || !req.session.admin) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const bookingId = req.params.id;
    const { status } = req.body;
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = status;
    await booking.save();

    // Update item or vehicle status accordingly
    if (booking.item) {
      if (status === 'pending') {
        // Keep item as Available when booking is pending
        await Item.findByIdAndUpdate(booking.item, { status: 'Available' });
      } else if (status === 'confirmed') {
        // Keep item as Available when booking is confirmed (not yet rented)
        await Item.findByIdAndUpdate(booking.item, { status: 'Available' });
      } else if (status === 'cancelled') {
        await Item.findByIdAndUpdate(booking.item, { status: 'Available' });
      } else if (status === 'completed') {
        // Mark item as Rented only when transaction is completed
        await Item.findByIdAndUpdate(booking.item, { status: 'Rented' });
      }
    }
    if (booking.vehicle) {
      if (status === 'pending') {
        // Keep vehicle as Available when booking is pending
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'Available' });
      } else if (status === 'confirmed') {
        // Keep vehicle as Available when booking is confirmed (not yet rented)
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'Available' });
      } else if (status === 'cancelled') {
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'Available' });
      } else if (status === 'completed') {
        // Mark vehicle as Rented only when transaction is completed
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'Rented' });
      }
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Admin update booking status error:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
};