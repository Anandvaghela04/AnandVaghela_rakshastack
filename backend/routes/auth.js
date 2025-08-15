const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { 
  validateRegistration, 
  validateLogin, 
  handleValidationErrors 
} = require('../middleware/validation');
const { 
  sendOTP, 
  verifyOTP, 
  resendOTP, 
  login, 
  getMe, 
  becomeOwner 
} = require('../controllers/authController');

// @route   POST /api/auth/send-otp
// @desc    Send OTP for registration
// @access  Public
router.post('/send-otp', validateRegistration, handleValidationErrors, sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and register user
// @access  Public
router.post('/verify-otp', verifyOTP);

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP
// @access  Public
router.post('/resend-otp', resendOTP);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, login);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, getMe);

// @route   POST /api/auth/become-owner
// @desc    Change user role to owner
// @access  Private
router.post('/become-owner', auth, becomeOwner);

module.exports = router; 