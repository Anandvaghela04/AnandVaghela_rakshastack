const PGListing = require('../models/PGListing');

// @desc    Create a new PG listing
// @route   POST /api/pg
// @access  Private (Owner)
const createPGListing = async (req, res) => {
  try {
    const pgData = {
      ...req.body,
      owner: req.user._id
    };

    const pgListing = new PGListing(pgData);
    await pgListing.save();

    // Populate owner details
    await pgListing.populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'PG listing created successfully',
      data: { pgListing }
    });

  } catch (error) {
    console.error('Create PG listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PG listing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all PG listings with search and filters
// @route   GET /api/pg
// @access  Public
const getAllPGListings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      city,
      state,
      gender,
      minPrice,
      maxPrice,
      amenities,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isAvailable: true };

    if (location) {
      filter['location.address'] = { $regex: location, $options: 'i' };
    }
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    if (state) {
      filter['location.state'] = { $regex: state, $options: 'i' };
    }
    if (gender) {
      filter.gender = gender.toLowerCase();
    }
    if (minPrice || maxPrice) {
      filter['price.monthly'] = {};
      if (minPrice) filter['price.monthly'].$gte = parseInt(minPrice);
      if (maxPrice) filter['price.monthly'].$lte = parseInt(maxPrice);
    }
    if (amenities) {
      const amenitiesArray = amenities.split(',').map(a => a.trim());
      filter.amenities = { $in: amenitiesArray };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const pgListings = await PGListing.find(filter)
      .populate('owner', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await PGListing.countDocuments(filter);

    res.json({
      success: true,
      data: {
        pgListings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get PG listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PG listings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single PG listing by ID
// @route   GET /api/pg/:id
// @access  Public
const getPGListingById = async (req, res) => {
  try {
    const pgListing = await PGListing.findById(req.params.id)
      .populate('owner', 'name email phone profileImage');

    if (!pgListing) {
      return res.status(404).json({
        success: false,
        message: 'PG listing not found'
      });
    }

    res.json({
      success: true,
      data: { pgListing }
    });

  } catch (error) {
    console.error('Get PG listing by ID error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'PG listing not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch PG listing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update PG listing
// @route   PUT /api/pg/:id
// @access  Private (Owner)
const updatePGListing = async (req, res) => {
  try {
    const pgListing = await PGListing.findById(req.params.id);

    if (!pgListing) {
      return res.status(404).json({
        success: false,
        message: 'PG listing not found'
      });
    }

    // Check if user is the owner
    if (pgListing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this PG listing'
      });
    }

    const updatedPGListing = await PGListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      success: true,
      message: 'PG listing updated successfully',
      data: { pgListing: updatedPGListing }
    });

  } catch (error) {
    console.error('Update PG listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update PG listing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete PG listing
// @route   DELETE /api/pg/:id
// @access  Private (Owner)
const deletePGListing = async (req, res) => {
  try {
    const pgListing = await PGListing.findById(req.params.id);

    if (!pgListing) {
      return res.status(404).json({
        success: false,
        message: 'PG listing not found'
      });
    }

    // Check if user is the owner
    if (pgListing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this PG listing'
      });
    }

    await PGListing.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'PG listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete PG listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete PG listing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get PG listings by owner
// @route   GET /api/pg/owner/my-listings
// @access  Private (Owner)
const getMyPGListings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const pgListings = await PGListing.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await PGListing.countDocuments({ owner: req.user._id });

    res.json({
      success: true,
      data: {
        pgListings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get my PG listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your PG listings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Search PG listings
// @route   GET /api/pg/search
// @access  Public
const searchPGListings = async (req, res) => {
  try {
    const { q, location, gender, minPrice, maxPrice } = req.query;

    const filter = { isAvailable: true };

    if (q) {
      filter.$text = { $search: q };
    }
    if (location) {
      filter.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
    }
    if (gender) {
      filter.gender = gender.toLowerCase();
    }
    if (minPrice || maxPrice) {
      filter['price.monthly'] = {};
      if (minPrice) filter['price.monthly'].$gte = parseInt(minPrice);
      if (maxPrice) filter['price.monthly'].$lte = parseInt(maxPrice);
    }

    const pgListings = await PGListing.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');

    res.json({
      success: true,
      data: { pgListings }
    });

  } catch (error) {
    console.error('Search PG listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get cities with PG listings
// @route   GET /api/pg/cities
// @access  Public
const getCities = async (req, res) => {
  try {
    const cities = await PGListing.distinct('location.city');
    
    res.json({
      success: true,
      data: { cities: cities.sort() }
    });

  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createPGListing,
  getAllPGListings,
  getPGListingById,
  updatePGListing,
  deletePGListing,
  getMyPGListings,
  searchPGListings,
  getCities
}; 