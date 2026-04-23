// seed.js — Run once to add sample data: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const Coupon   = require('./models/Coupon');
const User     = require('./models/User');

const coupons = [
  { brand: 'Amazon',     code: 'AMZN20',    description: '20% off on electronics',        discount: '20% OFF',     category: 'Electronics', expiryDate: '2025-12-31' },
  { brand: 'Flipkart',   code: 'FLIP500',   description: 'Flat ₹500 off on orders ₹2000+', discount: '₹500 OFF',  category: 'Electronics', expiryDate: '2025-11-30' },
  { brand: 'Myntra',     code: 'MYNTRA30',  description: '30% off on all clothing',        discount: '30% OFF',     category: 'Fashion',     expiryDate: '2025-10-15' },
  { brand: 'Zomato',     code: 'ZOMFREE',   description: 'Free delivery on first 3 orders', discount: 'Free Delivery', category: 'Food',    expiryDate: '2025-09-30' },
  { brand: 'MakeMyTrip', code: 'TRAVEL15',  description: '15% off on flight bookings',     discount: '15% OFF',     category: 'Travel',     expiryDate: '2025-12-31' },
  { brand: 'Nykaa',      code: 'BEAUTY25',  description: '25% off on beauty products',     discount: '25% OFF',     category: 'Beauty',     expiryDate: '2025-11-15' },
  { brand: 'Swiggy',     code: 'SWIGGY60',  description: '60% off on orders above ₹300',   discount: '60% OFF',     category: 'Food',       expiryDate: '2025-09-15' },
  { brand: 'AJIO',       code: 'AJIO40',    description: '40% off on ethnic wear',         discount: '40% OFF',     category: 'Fashion',    expiryDate: '2025-11-01' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Coupon.deleteMany({});
  await User.deleteMany({ role: 'admin' });
  await Coupon.insertMany(coupons);
  await User.create({ name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'admin' });
  console.log('Done! Admin: admin@test.com / admin123');
  process.exit();
});
