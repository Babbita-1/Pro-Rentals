const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
  getAvailableVehicleImages
} = require("../controllers/vehicleController");

const { authenticateUser } = require("../middleware/authMiddleware");
const allowUserOrAdmin = require("../middleware/allowUserOrAdmin");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Session-based admin middleware
const sessionAdmin = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ message: 'Not authorized as admin' });
};

// Public: get all available vehicles
router.get("/", getAllVehicles);

// Public: get available vehicle images
router.get("/images/available", getAvailableVehicleImages);

// Public: get vehicle by id
router.get("/:id", getVehicleById);
router.put("/:id", sessionAdmin, require("../controllers/vehicleController").updateVehicle);

// Authenticated: delete own vehicle
router.delete("/:id", sessionAdmin, deleteVehicle);

// Authenticated: add a new vehicle
router.post("/", allowUserOrAdmin, upload.single('image'), createVehicle);

module.exports = router;
