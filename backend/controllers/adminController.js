// controllers/adminController.js
const jwt = require('jsonwebtoken');

const adminSignIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validate the credentials
    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Create JWT payload with an admin flag
    const payload = {
      admin: true,
      username: adminUsername
    };

    // Sign the token (expires in 1 hour)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { adminSignIn };
