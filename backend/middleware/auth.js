// middleware/auth.js — Checks if user is logged in via JWT

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// protect: only logged-in users can access this route
const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  // Token must be sent as:  Authorization: Bearer <token>
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    const token   = header.split(' ')[1];          // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify
    req.user = await User.findById(decoded.id).select('-password');
    next(); // Token is valid, continue
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// adminOnly: only admins can access this route (use AFTER protect)
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Admins only' });
};

module.exports = { protect, adminOnly };
