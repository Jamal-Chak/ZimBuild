const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For development with memory storage, we don't need actual MongoDB
    console.log('📊 Using in-memory storage for development');
    
    // If you want to use MongoDB later, uncomment this:
    /*
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zimbuild', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    */

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;