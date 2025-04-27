const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { startDate, endDate, userId, camperId } = req.body;
    const ownerId = req.userId; // Extract owner ID from the authenticated token

    // Basic validation
    if (!startDate || !endDate || !userId || !camperId) {
      return res.status(400).json({ error: 'All fields are required: startDate, endDate, userId, camperId' });
    }

    // Check if the camper belongs to the authenticated owner
    const camper = await prisma.camper.findUnique({
      where: { id: camperId },
    });

    if (!camper || camper.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Unauthorized to add bookings for this camper' });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
        camperId,
      },
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error("🔥 Error creating booking:", error);
    res.status(500).json({ error: 'Error creating booking', details: error.message });
  }
};

// Get bookings for the logged-in owner
const getBookingsForOwner = async (req, res) => {
  const ownerId = req.userId; // Extract userId from the authenticated token

  try {
    // Ensure the user is an owner
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner || owner.role !== 'OWNER') {
      return res.status(403).json({ message: 'Access denied. Only owners can view bookings.' });
    }

    // Fetch bookings for the owner's campers
    const bookings = await prisma.booking.findMany({
      where: { camper: { ownerId } }, // Ensure the camper belongs to the owner
      include: {
        camper: true, // Include camper details
        user: true,   // Include user details
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("🔥 Error fetching bookings for owner:", error);
    res.status(500).json({ error: 'Error fetching bookings for owner', details: error.message });
  }
};

const deleteBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  const ownerId = req.userId; // Extract owner ID from the authenticated token

  try {
    // Check if the booking exists and belongs to the owner's camper
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { camper: true },
    });

    if (!booking || booking.camper.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized to delete this booking' });
    }

    // Delete the booking
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error("🔥 Error deleting booking:", error);
    res.status(500).json({ error: 'Error deleting booking', details: error.message });
  }
};

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
    console.error("🔥 Error fetching bookings:", error);
    res.status(500).json({ error: 'Error fetching bookings', details: error.message });
  }
};


// Update a booking


// Other functions (createBooking, getBookings, getBookingsForOwner)...

// Update a booking
const updateBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  const { status } = req.body; // Example: Update booking status
  const ownerId = req.userId; // Ensure the owner is authenticated

  try {
    // Check if the booking belongs to the owner's camper
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { camper: true },
    });

    if (!booking || booking.camper.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized to edit this booking' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error("🔥 Error updating booking:", error);
    res.status(500).json({ error: 'Error updating booking', details: error.message });
  }
};

// Export all functions
module.exports = {
  createBooking,
  getBookings,
  getBookingsForOwner,
  updateBooking,
  deleteBooking, // Ensure this is included
};