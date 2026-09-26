import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  getFeedback,
  getFeedbackSummary,
} from '../controllers/feedbackController.js';

const router = express.Router();

// Base collection routes
router.route('/')
  .post(createFeedback)
  .get(getAllFeedbacks);

// /summary must precede /:id to avoid collision
router.get('/summary', getFeedbackSummary);
router.get('/:id', getFeedback);

export default router;