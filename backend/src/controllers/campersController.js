
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all campers
const getAllCampers = async (req, res) => {
  try {
    const campers = await prisma.camper.findMany();
    res.status(200).json(campers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching campers' });
  }
};

// Create a new camper
const createCamper = async (req, res) => {
  const { name, location, availability, price } = req.body;

  try {
    const newCamper = await prisma.camper.create({
      data: {
        name,
        location,
        availability,
        price,
        ownerId: req.user.id,  // assuming the user is authenticated
      },
    });
    res.status(201).json(newCamper);
  } catch (error) {
    res.status(500).json({ error: 'Error creating camper' });
  }
};

module.exports = { getAllCampers, createCamper };
