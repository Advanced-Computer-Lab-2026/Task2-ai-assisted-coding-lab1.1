const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/', feedbackController.createFeedback);
router.get('/', feedbackController.getAllFeedbacks);
router.get('/summary', feedbackController.getFeedbackSummary);
router.get('/:id', feedbackController.getFeedback);

module.exports = router;
