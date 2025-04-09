// routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createListing, 
  getPendingListings, 
  verifyListing, 
  getListingStatus, 
  getAllListings 
} = require('../controllers/listingController');
const verifyToken = require('../middleware/auth');

// POST /api/listings (protected route for regular users)
router.post('/', verifyToken, createListing);

// GET /api/listings/pending (admin only, protected route)
router.get('/pending', verifyToken, getPendingListings);

// PUT /api/listings/:id/verify (manual moderation, admin only)
router.put('/:id/verify', verifyToken, verifyListing);

// GET /api/listings/:id/status (open endpoint)
router.get('/:id/status', getListingStatus);

// GET /api/listings (with filtering)
router.get('/', getAllListings);

module.exports = router;
