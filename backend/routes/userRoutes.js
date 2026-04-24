// routes/userRoutes.js — Dashboard data (saved coupons)

const express = require('express');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/dashboard — get the logged-in user's saved coupons
router.get('/dashboard', protect, async (req, res) => {
  try {
    // .populate() replaces the saved coupon IDs with the actual coupon documents
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedCoupons');

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
