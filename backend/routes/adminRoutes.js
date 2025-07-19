const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Base admin route for health check or info
router.get('/', (req, res) => {
  res.json({ message: 'Admin API is working' });
});

// Admin login
router.post('/login', adminController.login);

// Admin logout
router.post('/logout', adminController.logout);

// Debug: Log session on profile request
router.get('/profile', adminController.getProfile);

// Update admin profile (session-based)
router.put('/profile', adminController.updateProfile);

router.post('/forgot-password', adminController.forgotPassword);

module.exports = router; 