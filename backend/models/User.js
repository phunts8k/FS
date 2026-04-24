// models/User.js — What a user looks like in the database

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },

  // Array of coupon IDs the user has saved
  savedCoupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }]
}, { timestamps: true }); // adds createdAt, updatedAt automatically

// Before saving, hash the password if it was changed
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare a plain password with the stored hash
UserSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);
