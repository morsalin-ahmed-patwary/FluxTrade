// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { createReview, getReviewsForListing } = require('../controllers/reviewController');
const verifyToken = require('../middleware/auth');

// POST /api/reviews - Create a review (protected)
router.post('/', verifyToken, createReview);

// GET /api/reviews/:listingId - Get all reviews for a given listing
router.get('/:listingId', getReviewsForListing);

module.exports = router;
