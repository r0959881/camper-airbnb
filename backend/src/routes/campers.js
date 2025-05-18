const express = require('express');
const router = express.Router();
const campersController = require('../controllers/campersController'); // Ensure this path is correct
const auth = require('../middleware/auth'); // Middleware to authenticate and authorize

// Fetch all campers (accessible to all authenticated users)
// router.get('/', auth(), campersController.getAllCampers);

// Fetch all campers (accessible to everyone)
router.get('/', campersController.getAllCampers);

// Fetch campers for the logged-in owner (only for owners)
router.get('/owner', campersController.getCampersForOwner);

// Fetch camper details by ID (accessible to all authenticated users)
router.get('/:id', auth(), campersController.getCamperById);



// Add a new camper (only for owners)
router.post('/', auth('OWNER'), campersController.createCamper);

// Update a camper (only for owners)
router.patch('/:id', auth('OWNER'), campersController.updateCamper);

// Delete a camper (only for owners)
router.delete('/:id', auth('OWNER'), campersController.deleteCamper);

module.exports = router;