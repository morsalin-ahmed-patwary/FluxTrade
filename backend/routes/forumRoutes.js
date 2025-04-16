// routes/forumRoutes.js
const express = require('express');
const router = express.Router();
const { createForumPost, getForumPosts, getForumPostById } = require('../controllers/forumController');
const verifyToken = require('../middleware/auth');

// POST /api/forum - Create a forum post (protected)
router.post('/', verifyToken, createForumPost);

// GET /api/forum - Get all forum posts
router.get('/', getForumPosts);

// GET /api/forum/:id - Get a forum post by ID
router.get('/:id', getForumPostById);

module.exports = router;
