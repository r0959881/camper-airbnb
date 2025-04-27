const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCampers = async (req, res) => {
  try {
    const campers = await prisma.camper.findMany();
    res.status(200).json(campers);
  } catch (error) {
    console.error('Error fetching campers:', error);
    res.status(500).json({ error: 'Failed to fetch campers' });
  }
};

exports.createCamper = async (req, res) => {
  const ownerId = req.userId; // Extract owner ID from the authenticated token

  try {
    const { title, description, location, price } = req.body;

    // Validate required fields
    if (!title || !description || !location || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create camper listing
    const camper = await prisma.camper.create({
      data: {
        title,
        description,
        location,
        price: parseFloat(price),
        ownerId,
      },
    });

    res.status(201).json({ message: 'Camper created successfully', camper });
  } catch (error) {
    console.error('Error creating camper:', error);
    res.status(500).json({ error: 'Failed to create camper' });
  }
};