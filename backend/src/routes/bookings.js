const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth'); // Middleware for authentication

// Ensure the auth middleware is a valid function
if (typeof auth !== 'function') {
  throw new Error('The auth middleware must be a function');
}

// Fetch bookings for the logged-in owner
router.get('/owner', auth('OWNER'), bookingController.getBookingsForOwner);

// Update a booking
router.patch('/:id', auth('OWNER'), bookingController.updateBooking);

// Delete a booking
router.delete('/:id', auth('OWNER'), bookingController.deleteBooking);

// Create a booking for a customer
router.post('/customer', auth('CUSTOMER'), bookingController.createBooking);

// Fetch bookings for the logged-in customer
router.get('/customer', auth('CUSTOMER'), bookingController.getCustomerBookings);

// Fetch a booking by ID
router.get('/:id', auth(), bookingController.getBookingById);

module.exports = router;