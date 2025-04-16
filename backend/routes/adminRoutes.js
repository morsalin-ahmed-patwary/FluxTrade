// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminSignIn } = require('../controllers/adminController');

// POST /api/admin/signin - Admin login
router.post('/signin', adminSignIn);

module.exports = router;
