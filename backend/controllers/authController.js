const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    let userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, phoneNumber });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  try {
    // Find user by email or phone number
    const query = [];
    if (email) query.push({ email });
    if (phoneNumber) query.push({ phoneNumber });
    if (query.length === 0) {
      return res.status(400).json({ message: "Please provide email or phone number." });
    }
    const user = await User.findOne({ $or: query });
    if (!user) {
      return res.status(404).json({ message: "User not found with provided email or phone number." });
    }
    // Update password (will be hashed by pre-save hook)
    user.password = password;
    user.markModified('password'); // Ensure Mongoose knows password is modified
    await user.save();
    res.json({ message: "Password reset successful. You can now log in with your new password." });
  } catch (error) {
    res.status(500).json({ message: "Server error during password reset." });
  }
};

