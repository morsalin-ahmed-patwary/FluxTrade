// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, signInUser, getProfile, getUsers, makeAdmin } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/signin
router.post('/signin', signInUser);

// GET /api/users (for testing)
router.get('/', getUsers);

// GET /api/users/profile (protected)
router.get('/profile', verifyToken, getProfile);

// PUT /api/users/:id/make-admin
router.put('/:id/make-admin', makeAdmin);

module.exports = router;
