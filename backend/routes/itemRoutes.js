const express = require("express");
const router = express.Router();
const { getItems, createItem, getItemById, getItemsByUser, deleteItem, getAvailableItemImages } = require("../controllers/itemController");
const { authenticateUser } = require("../middleware/authMiddleware");
const multer = require('multer');
const path = require('path');
const allowUserOrAdmin = require("../middleware/allowUserOrAdmin");

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

// Specific routes first
router.get("/my-items", authenticateUser, getItemsByUser);
router.get("/images/available", getAvailableItemImages);

// Session-based admin middleware
const sessionAdmin = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ message: 'Not authorized as admin' });
};

// Catch-all param routes after specific ones
router.get("/", getItems);
router.post("/", allowUserOrAdmin, createItem);
router.get("/:id", getItemById);
router.put("/:id", sessionAdmin, require("../controllers/itemController").updateItem);
router.delete("/:id", sessionAdmin, deleteItem);

module.exports = router;
