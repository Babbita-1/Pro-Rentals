const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Admin login (session-based)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Admin login attempt:', email);
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(404).json({ message: 'Admin not found' });
    }
    console.log('Admin found. Stored password:', admin.password);
    if (admin.password !== password) {
      console.log('Invalid credentials for admin:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    req.session.admin = { id: admin._id, name: admin.name, email: admin.email };
    req.session.save(() => {
      res.json({ message: 'Admin logged in', admin: req.session.admin });
    });
  } catch (err) {
    console.log('Server error during admin login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

// Get admin profile (session-based)
exports.getProfile = async (req, res) => {
  if (!req.session.admin) return res.status(401).json({ message: 'Not logged in as admin' });
  try {
    const admin = await Admin.findById(req.session.admin.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update admin profile (session-based)
exports.updateProfile = async (req, res) => {
  if (!req.session.admin) return res.status(401).json({ message: 'Not logged in as admin' });
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const admin = await Admin.findByIdAndUpdate(req.session.admin.id, updates, { new: true, runValidators: true }).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    // Update session info
    req.session.admin = { id: admin._id, name: admin.name, email: admin.email };
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  try {
    const query = [];
    if (email) query.push({ email });
    if (phoneNumber) query.push({ phoneNumber });
    if (query.length === 0) {
      return res.status(400).json({ message: "Please provide email or phone number." });
    }
    const admin = await Admin.findOne({ $or: query });
    if (!admin) {
      console.log('Admin not found for reset:', email, phoneNumber);
      return res.status(404).json({ message: "Admin not found with provided email or phone number." });
    }
    console.log('Resetting password for admin:', admin.email, 'New password:', password);
    admin.password = password;
    await admin.save();
    res.json({ message: "Admin password reset successful. You can now log in with your new password." });
  } catch (error) {
    console.log('Error during admin password reset:', error);
    res.status(500).json({ message: "Server error during admin password reset." });
  }
}; 