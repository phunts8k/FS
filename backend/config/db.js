// config/db.js — Connect to MongoDB

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not set. Add your MongoDB Atlas connection string to backend/.env');
    }

    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected (${mongoUri.startsWith('mongodb+srv://') ? 'Atlas' : 'configured server'})`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
