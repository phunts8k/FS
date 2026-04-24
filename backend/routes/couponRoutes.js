// routes/couponRoutes.js — CRUD + search + save

const express = require('express');
const Coupon  = require('../models/Coupon');
const User    = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/coupons — get all coupons, supports ?search= and ?category=
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { isActive: true };

    if (search) {
      // $or = match any of these fields; $regex = partial, case-insensitive match
      filter.$or = [
        { brand:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code:        { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'All') filter.category = category;

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/coupons/:id/save — save or unsave a coupon
router.post('/:id/save', protect, async (req, res) => {
  try {
    const user     = await User.findById(req.user._id);
    const couponId = req.params.id;
    const alreadySaved = user.savedCoupons.includes(couponId);

    if (alreadySaved) {
      // Remove from saved list
      user.savedCoupons = user.savedCoupons.filter(id => id.toString() !== couponId);
    } else {
      // Add to saved list
      user.savedCoupons.push(couponId);
    }

    await user.save();
    res.json({ saved: !alreadySaved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/coupons — add coupon (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ coupon });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/coupons/:id — edit coupon (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Not found' });
    res.json({ coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/coupons/:id — delete coupon (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
