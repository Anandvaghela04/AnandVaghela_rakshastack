const mongoose = require('mongoose');
const PGListing = require('./models/PGListing');
const User = require('./models/User');
require('dotenv').config({ path: './config.env' });

const connectDB = require('./config/db');

const samplePGs = [
  {
    name: "Sunshine PG for Girls",
    description: "A comfortable and safe PG accommodation for girls with modern amenities and 24/7 security.",
    location: {
      address: "123 Sunshine Street",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380001"
    },
    price: {
      monthly: 8000,
      deposit: 5000
    },
    amenities: ["WiFi", "AC", "Food", "Laundry", "Security"],
    gender: "girls",
    roomTypes: [
      {
        type: "Single",
        available: 5,
        price: 8000
      },
      {
        type: "Double",
        available: 3,
        price: 6000
      },
      {
        type: "Triple",
        available: 2,
        price: 4500
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
        caption: "Main entrance",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=500",
        caption: "Common area"
      }
    ],
    contactInfo: {
      phone: "9876543210",
      email: "sunshine@pg.com"
    },
    rules: [
      "No smoking",
      "No pets",
      "Quiet hours after 10 PM"
    ],
    isAvailable: true,
    isVerified: true,
    rating: {
      average: 4.5,
      count: 12
    }
  },
  {
    name: "Royal PG for Boys",
    description: "Premium PG accommodation for boys with excellent facilities and convenient location.",
    location: {
      address: "456 Royal Avenue",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380002"
    },
    price: {
      monthly: 7500,
      deposit: 4000
    },
    amenities: ["WiFi", "AC", "Food", "Gym", "Parking"],
    gender: "boys",
    roomTypes: [
      {
        type: "Single",
        available: 3,
        price: 7500
      },
      {
        type: "Double",
        available: 4,
        price: 5500
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
        caption: "Building exterior",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=500",
        caption: "Room interior"
      }
    ],
    contactInfo: {
      phone: "9876543211",
      email: "royal@pg.com"
    },
    rules: [
      "No smoking",
      "No pets",
      "Maintain cleanliness"
    ],
    isAvailable: true,
    isVerified: true,
    rating: {
      average: 4.3,
      count: 8
    }
  },
  {
    name: "Green Valley PG",
    description: "Eco-friendly PG accommodation with garden and peaceful environment.",
    location: {
      address: "789 Green Valley Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    price: {
      monthly: 12000,
      deposit: 8000
    },
    amenities: ["WiFi", "AC", "Food", "Security"],
    gender: "girls",
    roomTypes: [
      {
        type: "Single",
        available: 2,
        price: 12000
      },
      {
        type: "Double",
        available: 3,
        price: 9000
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
        caption: "Garden view",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=500",
        caption: "Room view"
      }
    ],
    contactInfo: {
      phone: "9876543212",
      email: "greenvalley@pg.com"
    },
    rules: [
      "No smoking",
      "No pets",
      "Respect garden area"
    ],
    isAvailable: true,
    isVerified: true,
    rating: {
      average: 4.7,
      count: 15
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await PGListing.deleteMany({});
    console.log('Cleared existing PG listings');

    // Create a sample owner user
    let owner = await User.findOne({ email: 'owner@test.com' });
    if (!owner) {
      owner = new User({
        name: 'Test Owner',
        email: 'owner@test.com',
        password: 'password123',
        phone: '9876543210',
        role: 'owner'
      });
      await owner.save();
      console.log('Created test owner user');
    }

    // Add owner to each PG listing
    const pgsWithOwner = samplePGs.map(pg => ({
      ...pg,
      owner: owner._id
    }));

    // Insert sample data
    const insertedPGs = await PGListing.insertMany(pgsWithOwner);
    console.log(`Inserted ${insertedPGs.length} PG listings`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 