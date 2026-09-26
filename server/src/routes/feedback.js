import express from 'express';
import {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  getFeedbackSummary
} from '../controllers/feedbackController.js';

const router = express.Router();

router.get('/summary', getFeedbackSummary);
router.route('/').get(getFeedbacks).post(createFeedback);
router.route('/:id').get(getFeedbackById);

export default router;
