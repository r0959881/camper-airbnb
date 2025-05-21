const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Customer creates a review
router.post('/', auth('CUSTOMER'), reviewController.createReview);

// Owner deletes a review
router.delete('/:id', auth('OWNER'), reviewController.deleteReview);

// Get reviews for a camper
router.get('/camper/:camperId', reviewController.getReviewsForCamper);

module.exports = router;