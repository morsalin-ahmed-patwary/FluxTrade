// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection established');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if unable to connect
  }
};

module.exports = connectDB;
