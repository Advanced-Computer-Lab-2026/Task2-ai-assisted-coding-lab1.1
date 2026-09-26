import { Router } from 'express';
import {
  getAllFeedbacks,
  getFeedbackSummary,
  getFeedback,
  createFeedback
} from '../controllers/feedbackController.js';

const router = Router();

router.get('/', getAllFeedbacks);
router.get('/summary', getFeedbackSummary);
router.get('/:id', getFeedback);
router.post('/', createFeedback);

export default router;