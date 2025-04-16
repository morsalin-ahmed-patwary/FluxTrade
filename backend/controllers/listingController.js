// controllers/listingController.js
const Listing = require('../models/Listing');
const User = require('../models/User');

// Create a new listing (requires authentication)
// The owner is set based on the JWT payload (req.user.userId)
const createListing = async (req, res) => {
  try {
    const { title, description, images, category, condition, location, price, tradePreference } = req.body;

    // Ensure that the user is authenticated (via JWT, verifyToken middleware)
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: No valid token provided' });
    }

    const newListing = new Listing({
      title,
      description,
      images: images || [],
      category,
      condition,
      location,
      price,
      tradePreference: tradePreference || 'Sell',
      owner: req.user.userId // owner set from authenticated user
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending listings for verification (admin only)
// Requires a valid admin JWT token
const getPendingListings = async (req, res) => {
  try {
    // Verify that the requester is an admin (token must contain admin flag)
    if (!req.user || !req.user.admin) {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const pendingListings = await Listing.find({ verificationStatus: 'pending' })
      .populate('owner', 'username email');

    res.status(200).json(pendingListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify a listing (manual moderation by admin)
// Admin sends the action ("approve" or "reject") along with optional notes.
// The admin is determined from the JWT token.
const verifyListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body;

    // Ensure the requester is an admin
    if (!req.user || !req.user.admin) {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject"' });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Update listing verification status
    listing.verificationStatus = action === 'approve' ? 'approved' : 'rejected';
    listing.isVerified = action === 'approve';
    listing.verificationNotes = notes || '';
    // Instead of using an adminId, save the admin's username from the token
    listing.verifiedBy = req.user.username;
    listing.verifiedAt = new Date();

    const updatedListing = await listing.save();
    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the verification status of a listing (for users)
const getListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .select('title verificationStatus verificationNotes verifiedAt');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all listings with optional filtering (only verified listings by default)
const getAllListings = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.condition) filter.condition = req.query.condition;
    if (req.query.location) filter.location = req.query.location;

    // Show only verified listings unless overridden by query param
    if (req.query.showAll !== 'true') {
      filter.isVerified = true;
    }

    const listings = await Listing.find(filter)
      .populate('owner', 'username email');

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Get a single listing by its ID (full details)
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate('owner', 'username email');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createListing,
  getPendingListings,
  verifyListing,
  getListingStatus,
  getAllListings,
  getListingById   // Export the new function
};
