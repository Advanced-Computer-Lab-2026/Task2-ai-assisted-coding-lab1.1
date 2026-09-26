import { Router } from 'express';
import {
  getAllFeedbacks,
  getFeedback,
  createFeedback,
  getFeedbackSummary
} from '../controllers/feedbackController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

export default router;
import { Router } from 'express';
import {
  getAllFeedbacks,
  getFeedbackSummary,
  createFeedback,
  getFeedback
} from '../controllers/feedbackController.js';

const router = Router();

router.get('/', getAllFeedbacks);
router.get('/summary', getFeedbackSummary); // must come before /:id
router.post('/', createFeedback);
router.get('/:id', getFeedback);

export default router;