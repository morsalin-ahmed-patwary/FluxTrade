// models/Listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  tradePreference: {
    type: String,
    enum: ['Swap', 'Sell', 'Gift', 'Swap or Sell'],
    default: 'Sell'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationNotes: {
    type: String,
    default: ''
  },
  // Change the type from ObjectId to String, since admin verification uses a username
  verifiedBy: {
    type: String,
    default: ''
  },
  verifiedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Listing', listingSchema);
