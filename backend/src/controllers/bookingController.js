const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { startDate, endDate, camperId } = req.body;
    const userId = req.userId; // Extract customer ID from the authenticated token

    // Validate required fields
    if (!startDate || !endDate || !camperId) {
      return res.status(400).json({ error: 'All fields are required: startDate, endDate, camperId' });
    }

    // Convert camperId to an integer
    const camperIdInt = parseInt(camperId, 10);

    // Normalize today's date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate that the start date is not in the past
    if (start < today) {
      return res.status(400).json({ error: 'Start date cannot be in the past' });
    }

    // Validate that the end date is after the start date
    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after the start date' });
    }

    // Check if the camper exists
    const camper = await prisma.camper.findUnique({
      where: { id: camperIdInt },
    });

    if (!camper) {
      return res.status(404).json({ error: 'Camper not found' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        camperId: camperIdInt,
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'Camper is already booked for the selected dates' });
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        camperId: camperIdInt,
        userId,
        startDate: start,
        endDate: end,
      },
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get bookings for the logged-in owner
const getBookingsForOwner = async (req, res) => {
  const ownerId = req.userId; // Extract owner ID from the authenticated token

  try {
    // Fetch bookings for the owner's campers
    const bookings = await prisma.booking.findMany({
      where: {
        camper: {
          ownerId, // Ensure the camper belongs to the owner
        },
      },
      include: {
        camper: true, // Include camper details
        user: true,   // Include user details
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings for owner:', error);
    res.status(500).json({ error: 'Failed to fetch bookings for owner' });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        camper: true, // Include camper details
        user: true,   // Include user details
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Update a booking
const updateBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10); // Get booking ID from the route parameter
  const { startDate, endDate } = req.body; // Accept startDate and endDate for updates
  const ownerId = req.userId; // Ensure the owner is authenticated

  try {
    // Check if the booking exists and belongs to the owner's camper
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { camper: true },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.camper.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized to edit this booking' });
    }

    // Validate the new dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after the start date' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        camperId: booking.camperId,
        id: { not: bookingId }, // Exclude the current booking
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'The camper is already booked for the selected dates' });
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { startDate: start, endDate: end },
    });

    res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10); // Get booking ID from the route parameter
  const ownerId = req.userId; // Extract owner ID from the authenticated token

  try {
    // Check if the booking exists and belongs to the owner's camper
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { camper: true }, // Include camper details to verify ownership
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.camper.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized to delete this booking' });
    }

    // Delete the booking
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

// Get a booking by ID
const getBookingById = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10); // Get booking ID from the route parameter

  try {
    // Fetch the booking by ID
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        camper: true, // Include camper details
        user: true,   // Include user details
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Get customer bookings
const getCustomerBookings = async (req, res) => {
  const userId = req.userId; // Extract customer ID from the authenticated token

  try {
    // Fetch bookings for the logged-in customer
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        camper: true, // Include camper details
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Export all functions
module.exports = {
  createBooking,
  getBookings,
  getBookingsForOwner,
  updateBooking,
  deleteBooking,
  getBookingById,
  getCustomerBookings,
};