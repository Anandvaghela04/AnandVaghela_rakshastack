const mongoose = require('mongoose');

const pgListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'PG name is required'],
    trim: true,
    maxlength: [100, 'PG name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  price: {
    monthly: {
      type: Number,
      required: [true, 'Monthly price is required'],
      min: [1000, 'Price must be at least 1000'],
      max: [50000, 'Price cannot exceed 50000']
    },
    deposit: {
      type: Number,
      default: 0,
      min: [0, 'Deposit cannot be negative']
    }
  },
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'Security', 
      'Gym', 'Study Room', 'TV', 'Refrigerator', 'Washing Machine',
      'Hot Water', 'Power Backup', 'CCTV', 'Housekeeping'
    ]
  }],
  gender: {
    type: String,
    required: [true, 'Gender preference is required'],
    enum: ['boys', 'girls', 'unisex'],
    lowercase: true
  },
  roomTypes: [{
    type: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Dormitory'],
      required: true
    },
    available: {
      type: Number,
      default: 0,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 1000
    }
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  rules: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
pgListingSchema.index({ 
  'location.city': 'text', 
  'location.state': 'text', 
  name: 'text',
  description: 'text'
});

// Index for filtering
pgListingSchema.index({ 
  'location.city': 1, 
  gender: 1, 
  'price.monthly': 1,
  isAvailable: 1 
});

// Virtual for full address
pgListingSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} - ${this.location.pincode}`;
});

// Ensure virtual fields are serialized
pgListingSchema.set('toJSON', { virtuals: true });
pgListingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('PGListing', pgListingSchema); 