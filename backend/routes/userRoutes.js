// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  signInUser,
  getProfile,
  generateReferralCode,
  makeAdmin,
} = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/signin', signInUser);
router.get('/profile', verifyToken, getProfile);
router.post('/generate-referral-code', verifyToken, generateReferralCode);
router.put('/:id/make-admin', makeAdmin);

module.exports = router;
