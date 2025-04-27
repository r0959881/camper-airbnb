const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth'); // Combined middleware

// Fetch bookings for the logged-in owner
router.get('/owner', auth('OWNER'), bookingController.getBookingsForOwner);

// Update a booking (e.g., status)
router.patch('/:id', auth('OWNER'), bookingController.updateBooking);

// Delete a booking
router.delete('/:id', auth('OWNER'), bookingController.deleteBooking); // Ensure this is correct

router.post('/', auth('OWNER'), bookingController.createBooking);

module.exports = router;