// server.js — Entry point for the backend

require('dotenv').config();           // Load .env variables
const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');

const app = express();
connectDB(); // Connect to MongoDB

// Middleware
app.use(cors());           // Allow requests from the frontend
app.use(express.json());   // Parse JSON request bodies

// Routes
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/users',   require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

