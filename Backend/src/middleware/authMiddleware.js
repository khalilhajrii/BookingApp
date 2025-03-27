const jwt = require('jsonwebtoken');
const User = require('../models/user');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    User.findById(decoded.userId)
      .populate('role')
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
      })
      .catch(err => {
        console.error('Error finding user:', err);
        return res.status(500).json({ message: 'Error finding user' });
      });
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(403).json({ 
      message: 'Failed to authenticate token',
      error: err.message 
    });
  }
}

module.exports = verifyToken;