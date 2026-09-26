import { Router } from 'express';
import {
  getAllFeedbacks,
  getFeedback,
  createFeedback,
  getFeedbackSummary,
} from '../controllers/feedbackController.js';

const router = Router();


//Route: GET /api/feedback/summary
//Must be placed before /:id so that 'summary' is not treated as an ID.
router.get('/summary', getFeedbackSummary);


//Route: GET /api/feedback
//Retrieves all feedback records.
router.get('/', getAllFeedbacks);


//Route: POST /api/feedback
//Submits a new feedback record.
router.post('/', createFeedback);


//Route: GET /api/feedback/:id
//Retrieves a specific feedback record by its ID.
router.get('/:id', getFeedback);

export default router;
