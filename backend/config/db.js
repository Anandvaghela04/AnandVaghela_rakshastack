const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📋 Collections: ${collections.length}`);
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 