import { Router } from 'express';
import {
  getAllFeedbacks,
  getFeedback,
  createFeedback,
  getFeedbackSummary
} from '../controllers/feedbackController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.\
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  workshopcode: { type: String, required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',},
},
{timestamps: true }
);

export default router;
