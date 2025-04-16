// controllers/userController.js
const User = require('../models/User');
const Referral = require('../models/Referral');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper: Generate a random referral code (6-character alphanumeric, uppercase)
const generateRandomReferralCode = () => {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
};

// Register a new user with referral processing
const registerUser = async (req, res) => {
  try {
    const { username, email, password, profilePicture, referralCode: inputReferralCode } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate a unique referral code for the new user (6-character alphanumeric, uppercase)
    const generatedReferralCode = generateRandomReferralCode();
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: profilePicture || '',
      referralCode: generatedReferralCode,
    });
    
    const savedUser = await newUser.save();
    
    // Process referral if a referral code was provided
    if (inputReferralCode && inputReferralCode.trim() !== "") {
      // Look up the referrer by the provided referral code
      const referrer = await User.findOne({ referralCode: inputReferralCode });
      // Prevent self-referral
      if (referrer && referrer._id.toString() !== savedUser._id.toString()) {
        // Create a referral record linking the referrer and the new user
        const referralRecord = new Referral({
          referrer: referrer._id,
          referee: savedUser._id,
        });
        await referralRecord.save();
        
        // Atomically update the referrer's reward points by incrementing by 10
        await User.findByIdAndUpdate(referrer._id, { $inc: { referralReward: 10 } });
      }
    }
    
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sign in user and return JWT
const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const payload = {
      userId: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        referralCode: user.referralCode,
        referralReward: user.referralReward,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile (protected route)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate (or regenerate) a referral code for the authenticated user
const generateReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Generate a new referral code
    const newCode = generateRandomReferralCode();
    user.referralCode = newCode;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Make a user an admin (for testing purposes)
const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { secretKey } = req.body;
    
    if (secretKey !== 'makeAdmin') {
      return res.status(403).json({ message: 'Invalid secret key' });
    }
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isAdmin = true;
    const updatedUser = await user.save();
    res.status(200).json({ message: 'User is now an admin', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  signInUser,
  getProfile,
  generateReferralCode,
  makeAdmin,
};
