require('dotenv').config(); // Load environment variables
const express = require("express");
const cors = require("cors");

const camperRoutes = require('./routes/campers');
const bookingRoutes = require('./routes/bookings');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const reviewRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "uploads" directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Register routes
app.use('/auth', authRoutes); // All routes in authRoutes.js will be prefixed with /auth
app.use('/campers', camperRoutes);
app.use('/bookings', bookingRoutes);

app.use('/reviews', reviewRoutes); // Register review routes

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Camper Airbnb API!");
});

module.exports = app;