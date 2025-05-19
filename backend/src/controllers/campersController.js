const multer = require('multer');
const path = require('path');
const prisma = require('../utils/prisma');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
  },
});
const upload = multer({ storage }); // Initialize multer with the storage configuration

// Fetch all campers
exports.getAllCampers = async (req, res) => {
  try {
    const campers = await prisma.camper.findMany({
      where: {
        deletedAt: null, // Exclude soft-deleted campers
      },
      include: {
        owner: true, // Include owner details
        bookings: true, // Include bookings for each camper
      },
    });
    res.status(200).json(campers);
  } catch (error) {
    console.error('Error fetching campers:', error);
    res.status(500).json({ error: 'Failed to fetch campers' });
  }
};

// Create a new camper
exports.createCamper = [
  upload.single('image'), // If you use multer for image upload
  async (req, res) => {
    const ownerId = req.userId; // Extract owner ID from the authenticated token

    try {
      // Destructure latitude and longitude from req.body
      const { title, description, location, price, latitude, longitude } = req.body;

      // Get the uploaded image file path
      const image = req.file
        ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        : null;

      // Create camper listing with coordinates
      const camper = await prisma.camper.create({
        data: {
          title,
          description,
          location,
          price: parseFloat(price),
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          ownerId,
          image,
        },
      });

      res.status(201).json({ message: 'Camper created successfully', camper });
    } catch (error) {
      console.error('Error creating camper:', error);
      res.status(500).json({ error: 'Failed to create camper' });
    }
  },
];

exports.deleteCamper = async (req, res) => {
  const camperId = parseInt(req.params.id, 10);
  const ownerId = req.userId; // Extract owner ID from the authenticated token

  try {
    // Check if the camper exists and belongs to the owner
    const camper = await prisma.camper.findUnique({
      where: { id: camperId },
    });

    if (!camper || camper.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized to delete this camper' });
    }

    // Soft delete the camper by setting the deletedAt column
    await prisma.camper.update({
      where: { id: camperId },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({ message: 'Camper deleted successfully' });
  } catch (error) {
    console.error('Error deleting camper:', error);
    res.status(500).json({ error: 'Failed to delete camper' });
  }
};

// Fetch campers for the logged-in owner
exports.getCampersForOwner = async (req, res) => {
  // Try to get ownerId from token, fallback to query param
  let ownerId = req.userId;
  if (!ownerId) {
    ownerId = parseInt(req.query.ownerId, 10);
  }
  if (!ownerId || isNaN(ownerId)) {
    return res.status(400).json({ error: 'Missing or invalid owner ID' });
  }

  try {
    const campers = await prisma.camper.findMany({
      where: { ownerId, deletedAt: null },
      include: {
        bookings: true,
      },
    });

    res.status(200).json(campers);
  }catch (error) {
    console.error('Error fetching campers for owner:', error);
    res.status(500).json({ error: 'Failed to fetch campers for owner', details: error.message });
  }
  
};

exports.updateCamper = async (req, res) => {
  const camperId = parseInt(req.params.id, 10);
  const ownerId = req.userId; // Extract owner ID from the authenticated token

  try {
    // Check if the camper exists and belongs to the owner
    const camper = await prisma.camper.findUnique({
      where: { id: camperId },
    });

    if (!camper || camper.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized to edit this camper' });
    }

    const { title, description, location, price } = req.body;

    // Update the camper details
    const updatedCamper = await prisma.camper.update({
      where: { id: camperId },
      data: {
        title,
        description,
        location,
        price: parseFloat(price),
      },
    });

    res.status(200).json({ message: 'Camper updated successfully', camper: updatedCamper });
  } catch (error) {
    console.error('Error updating camper:', error);
    res.status(500).json({ error: 'Failed to update camper' });
  }
};
exports.getCamperById = async (req, res) => {
  const camperId = parseInt(req.params.id, 10); // Parse camper ID as an integer

  if (isNaN(camperId)) {
    return res.status(400).json({ error: 'Invalid camper ID' }); // Handle invalid ID
  }

  try {
    // Fetch the camper by ID
    const camper = await prisma.camper.findUnique({
      where: { id: camperId },
      include: {
        owner: true, // Include owner details
        bookings: true, // Include bookings for the camper
      },
    });

    if (!camper) {
      return res.status(404).json({ error: 'Camper not found' }); // Handle camper not found
    }

    res.status(200).json(camper); // Return the camper details
  } catch (error) {
    console.error('Error fetching camper:', error);
    res.status(500).json({ error: 'Failed to fetch camper' }); // Handle server errors
  }
};