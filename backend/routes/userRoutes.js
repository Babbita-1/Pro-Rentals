const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const { register, login, getUserProfile, updateUserProfile } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateUser, getUserProfile);
router.put("/profile", authenticateUser, updateUserProfile);

module.exports = router;
