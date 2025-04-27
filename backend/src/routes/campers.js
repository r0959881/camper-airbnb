const express = require('express');
const router = express.Router();
const campersController = require('../controllers/campersController');
const auth = require('../middleware/auth'); // Middleware to authenticate and authorize

// Fetch all campers (accessible to all authenticated users)
router.get('/', auth(), campersController.getAllCampers);

// Add a new camper (only for owners)
router.post('/', auth('OWNER'), campersController.createCamper);

module.exports = router;