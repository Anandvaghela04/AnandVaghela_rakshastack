const express = require('express');
const router = express.Router();
const { auth, authorizeOwner } = require('../middleware/auth');
const { 
  validateProfileUpdate, 
  handleValidationErrors 
} = require('../middleware/validation');
const {
  updateProfile,
  changePassword,
  getDashboard,
  getOwnerDashboard,
  deleteAccount
} = require('../controllers/userController');

// All routes are private (require authentication)
router.use(auth);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', validateProfileUpdate, handleValidationErrors, updateProfile);

// @route   PUT /api/user/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', changePassword);

// @route   GET /api/user/dashboard
// @desc    Get user dashboard stats
// @access  Private
router.get('/dashboard', getDashboard);

// @route   GET /api/user/owner-dashboard
// @desc    Get owner dashboard with detailed stats
// @access  Private (Owner)
router.get('/owner-dashboard', authorizeOwner, getOwnerDashboard);

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', deleteAccount);

module.exports = router; 