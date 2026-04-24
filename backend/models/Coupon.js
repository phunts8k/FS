// models/Coupon.js — What a coupon looks like in the database

const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  brand:       { type: String, required: true },
  code:        { type: String, required: true, uppercase: true },
  description: { type: String, required: true },
  discount:    { type: String, required: true },   // e.g. "20% OFF"
  category:    {
    type: String,
    enum: ['Electronics', 'Fashion', 'Food', 'Travel', 'Beauty', 'Other'],
    default: 'Other'
  },
  expiryDate:  { type: Date, required: true },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);
