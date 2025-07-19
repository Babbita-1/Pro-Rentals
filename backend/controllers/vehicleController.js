const Vehicle = require("../models/Vehicle");
const mongoose = require("mongoose");

// Get available vehicle images
exports.getAvailableVehicleImages = async (req, res) => {
  try {
    const vehicleImageFiles = [];
    
    res.json({
      images: vehicleImageFiles,
      message: "Available vehicle images retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const {
      type,
      brand,
      model,
      year,
      pricePerHour,
      description,
      imageUrl,
      seat,
      door,
      luggage,
      transmission,
      drive,
      fuelType,
      engine,
      status,
      available
    } = req.body;

    // If a file was uploaded, use its path as imageUrl
    let fileImageUrl = imageUrl;
    if (req.file) {
      fileImageUrl = `/uploads/${req.file.filename}`;
    }

    // Process imageUrl to handle vehicle assets (legacy support)
    let processedImageUrl = fileImageUrl;
    if (fileImageUrl && !fileImageUrl.startsWith('http') && !fileImageUrl.startsWith('/vehicle-images/') && !fileImageUrl.startsWith('/uploads/')) {
      const vehicleImageFiles = [
        'NixonEV5600.jpg',
        'Bus.jpg',
        'ComputerVan.jpg',
        'MultimediaSpeakerSystem.jpg',
        'SpeedfightScooter.jpg',
        'LithiumElectricScooterBlue.jpg',
        'CommuterEBicycle.jpg'
      ];
      if (vehicleImageFiles.includes(fileImageUrl)) {
        processedImageUrl = `/vehicle-images/${fileImageUrl}`;
      }
    }

    const vehicle = new Vehicle({
      type,
      brand,
      model,
      year,
      pricePerHour,
      description,
      imageUrl: processedImageUrl,
      seat,
      door,
      luggage,
      transmission,
      drive,
      fuelType,
      engine,
      status,
      available
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all available vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalVehicles = await Vehicle.countDocuments();
    const vehicles = await Vehicle.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalPages = Math.ceil(totalVehicles / limit);

    res.json({
      vehicles,
      currentPage: page,
      totalPages,
      totalVehicles
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Failed to fetch vehicles." });
  }
};

// Get a specific vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a vehicle (only if owner)
exports.updateVehicle = async (req, res) => {
  try {
    // Only allow admin
    if (!(req.user && req.user.role === 'admin') && !(req.session && req.session.admin)) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const vehicleId = req.params.id;
    const updateFields = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, updateFields, { new: true });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Failed to update vehicle.' });
  }
};

// Delete a vehicle (only if owner)
exports.deleteVehicle = async (req, res) => {
  try {
    // Only allow admin
    if (!(req.user && req.user.role === 'admin') && !(req.session && req.session.admin)) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    await vehicle.deleteOne();
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
