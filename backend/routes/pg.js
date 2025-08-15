const express = require('express');
const router = express.Router();
const { auth, authorizeOwner } = require('../middleware/auth');
const { 
  validatePGListing, 
  validatePGUpdate, 
  handleValidationErrors 
} = require('../middleware/validation');
const {
  createPGListing,
  getAllPGListings,
  getPGListingById,
  updatePGListing,
  deletePGListing,
  getMyPGListings,
  searchPGListings,
  getCities
} = require('../controllers/pgController');

// Public routes
// @route   GET /api/pg
// @desc    Get all PG listings with search and filters
// @access  Public
router.get('/', getAllPGListings);

// @route   GET /api/pg/search
// @desc    Search PG listings
// @access  Public
router.get('/search', searchPGListings);

// @route   GET /api/pg/cities
// @desc    Get cities with PG listings
// @access  Public
router.get('/cities', getCities);

// @route   GET /api/pg/:id
// @desc    Get single PG listing by ID
// @access  Public
router.get('/:id', getPGListingById);

// Private routes (Owner only)
// @route   POST /api/pg
// @desc    Create a new PG listing
// @access  Private (Owner)
router.post('/', auth, authorizeOwner, validatePGListing, handleValidationErrors, createPGListing);

// @route   PUT /api/pg/:id
// @desc    Update PG listing
// @access  Private (Owner)
router.put('/:id', auth, authorizeOwner, validatePGUpdate, handleValidationErrors, updatePGListing);

// @route   DELETE /api/pg/:id
// @desc    Delete PG listing
// @access  Private (Owner)
router.delete('/:id', auth, authorizeOwner, deletePGListing);

// @route   GET /api/pg/owner/my-listings
// @desc    Get PG listings by owner
// @access  Private (Owner)
router.get('/owner/my-listings', auth, authorizeOwner, getMyPGListings);

module.exports = router; 