// controllers/reviewController.js
const Review = require('../models/Review');

// Create a new review for a listing (protected endpoint)
const createReview = async (req, res) => {
  try {
    const { listing, rating, comment } = req.body;
    // Ensure that the user is authenticated (via verifyToken middleware)
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: No valid token provided' });
    }
    const newReview = new Review({
      listing,
      rating,
      comment: comment || '',
      user: req.user.userId
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a specific listing
const getReviewsForListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const reviews = await Review.find({ listing: listingId })
      .populate('user', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getReviewsForListing };
