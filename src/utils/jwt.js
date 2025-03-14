const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (user) => {
    const payload = {
      userId: user._id,
      role: user.role,
      username: user.username,
      email: user.email,
    };
  
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '4h', 
    });
  };

  const verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  };
  
  module.exports = { generateToken, verifyToken };
  