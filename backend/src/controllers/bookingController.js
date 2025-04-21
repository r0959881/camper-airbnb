// src/controllers/bookingController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { startDate, endDate, userId, camperId } = req.body;

    // Basic validation
    if (!startDate || !endDate || !userId || !camperId) {
      return res.status(400).json({ error: 'All fields are required: startDate, endDate, userId, camperId' });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if the camper exists
    const camper = await prisma.camper.findUnique({ where: { id: camperId } });
    if (!camper) return res.status(404).json({ error: 'Camper not found' });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
        camperId,
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("🔥 Error creating booking:", error);
    res.status(500).json({ error: 'Error creating booking', details: error.message });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        camper: true,
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("🔥 Error fetching bookings:", error);
    res.status(500).json({ error: 'Error fetching bookings', details: error.message });
  }
};

module.exports = { createBooking, getBookings };
