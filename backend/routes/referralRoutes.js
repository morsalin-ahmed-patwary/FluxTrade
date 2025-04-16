// routes/referralRoutes.js
const express = require('express');
const router = express.Router();
const { getMyReferrals } = require('../controllers/referralController');
const verifyToken = require('../middleware/auth');

router.get('/me', verifyToken, getMyReferrals);

module.exports = router;
