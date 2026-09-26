import express from 'express';
import * as feedbackController from '../controllers/feedbackController.js';

const router = express.Router();

// Route order is critical: /summary must come before /:id
router.get('/summary', feedbackController.getFeedbackSummary);
router.get('/', feedbackController.getAllFeedbacks);
router.post('/', feedbackController.createFeedback);
router.get('/:id', feedbackController.getFeedback);

export default router;
