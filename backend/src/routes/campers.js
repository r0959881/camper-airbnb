
const express = require('express');
const router = express.Router();
const campersController = require('../controllers/campersController');

// Define your routes here
router.get('/', campersController.getAllCampers);
router.post('/', campersController.createCamper);

module.exports = router;
