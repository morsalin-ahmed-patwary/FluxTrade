// controllers/referralController.js
const Referral = require('../models/Referral');

const getMyReferrals = async (req, res) => {
  try {
    // Retrieve referral records where the authenticated user is the referrer
    const referrals = await Referral.find({ referrer: req.user.userId })
      .populate('referee', 'username email');
    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyReferrals };
