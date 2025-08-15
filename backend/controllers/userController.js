const User = require('../models/User');
const PGListing = require('../models/PGListing');

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
          isVerified: user.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/user/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/user/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    let dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      },
      stats: {}
    };

    // If user is an owner, get PG listing stats
    if (user.role === 'owner') {
      const totalListings = await PGListing.countDocuments({ owner: user._id });
      const activeListings = await PGListing.countDocuments({ 
        owner: user._id, 
        isAvailable: true 
      });
      const verifiedListings = await PGListing.countDocuments({ 
        owner: user._id, 
        isVerified: true 
      });

      dashboardData.stats = {
        totalListings,
        activeListings,
        verifiedListings,
        pendingVerification: totalListings - verifiedListings
      };

      // Get recent listings
      const recentListings = await PGListing.find({ owner: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name location price isAvailable isVerified createdAt');

      dashboardData.recentListings = recentListings;
    }

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get owner dashboard with detailed stats
// @route   GET /api/user/owner-dashboard
// @access  Private (Owner)
const getOwnerDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Owner privileges required.'
      });
    }

    // Get detailed stats
    const totalListings = await PGListing.countDocuments({ owner: user._id });
    const activeListings = await PGListing.countDocuments({ 
      owner: user._id, 
      isAvailable: true 
    });
    const verifiedListings = await PGListing.countDocuments({ 
      owner: user._id, 
      isVerified: true 
    });

    // Get listings by gender
    const genderStats = await PGListing.aggregate([
      { $match: { owner: user._id } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    // Get price range stats
    const priceStats = await PGListing.aggregate([
      { $match: { owner: user._id } },
      { 
        $group: { 
          _id: null, 
          avgPrice: { $avg: '$price.monthly' },
          minPrice: { $min: '$price.monthly' },
          maxPrice: { $max: '$price.monthly' }
        } 
      }
    ]);

    // Get recent listings with full details
    const recentListings = await PGListing.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-__v');

    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      stats: {
        totalListings,
        activeListings,
        verifiedListings,
        pendingVerification: totalListings - verifiedListings,
        genderDistribution: genderStats,
        priceRange: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 }
      },
      recentListings
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Get owner dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch owner dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // If user is an owner, delete their PG listings
    if (user.role === 'owner') {
      await PGListing.deleteMany({ owner: user._id });
    }

    // Delete user account
    await User.findByIdAndDelete(user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  updateProfile,
  changePassword,
  getDashboard,
  getOwnerDashboard,
  deleteAccount
}; 