// controllers/forumController.js
const ForumPost = require('../models/ForumPost');

// Create a new forum post (protected endpoint)
const createForumPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: No valid token provided' });
    }
    const newPost = new ForumPost({
      title,
      content,
      author: req.user.userId
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all forum posts
const getForumPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate('author', 'username');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single forum post by ID
const getForumPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await ForumPost.findById(id)
      .populate('author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Forum post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createForumPost, getForumPosts, getForumPostById };
