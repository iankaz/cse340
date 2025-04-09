const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtUtil = {
  // Create a JWT token
  createToken: (accountData) => {
    try {
      const token = jwt.sign(
        { 
          account_id: accountData.account_id,
          account_type: accountData.account_type
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );
      return token;
    } catch (error) {
      console.error('Error creating JWT token:', error);
      throw error;
    }
  },

  // Verify a JWT token
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return decoded;
    } catch (error) {
      console.error('Error verifying JWT token:', error);
      throw error;
    }
  }
};

module.exports = jwtUtil; 