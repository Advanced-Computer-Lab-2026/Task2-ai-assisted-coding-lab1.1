import { Router } from 'express';
import {
  getAllFeedbacks,
  getFeedback,
  createFeedback,
  getFeedbackSummary
} from '../controllers/feedbackController.js';

const router = Router();



router.post('/', createFeedback);
router.get('/', getAllFeedbacks);
router.get('/summary', getFeedbackSummary); // must come before '/:id'
router.get('/:id', getFeedback);

export default router;
