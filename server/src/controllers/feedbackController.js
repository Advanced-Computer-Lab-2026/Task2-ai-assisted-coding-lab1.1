import { Feedback } from '../models/Feedback.js';
import mongoose from 'mongoose';

// GET /api/feedback
// TODO: implement per README.md section 2.
export async function getAllFeedbacks(req, res, next) {
   try {
    const feedbacks = await Feedback.find();
    res.status(200).json({ feedbacks });
  } catch (err) { next(err); }
}

// GET /api/feedback/:id
// TODO: implement per README.md section 2.
export async function getFeedback(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ feedback });
  } catch (err) { next(err); }
}

// POST /api/feedback
// TODO: implement per README.md section 2.
export async function createFeedback(req, res, next) {
  try {
    const { workshopCode, score, comment, submittedBy } = req.body;

    if (!workshopCode || score === undefined || score === null) {
      return res.status(400).json({ message: 'workshopCode and score are required' });
    }

    const feedback = await Feedback.create({ workshopCode, score, comment, submittedBy });

    res.status(201).json({ feedback });
  } catch (err) { next(err); }
}

// GET /api/feedback/summary?workshopCode=WS101
// TODO: implement per README.md section 3.
export async function getFeedbackSummary(req, res, next) {
  try {
    const { workshopCode } = req.query;

    if (!workshopCode) {
      return res.status(400).json({ message: 'workshopCode is required' });
    }

    const [summary] = await Feedback.aggregate([
      { $match: { workshopCode } },
      {
        $group: {
          _id: '$workshopCode',
          averageScore: { $avg: '$score' },
          feedbackCount: { $sum: 1 },
        },
      },
    ]);

    if (!summary) {
      return res.status(200).json({
        workshopCode,
        averageScore: 0,
        feedbackCount: 0,
      });
    }

    res.status(200).json({
      workshopCode,
      averageScore: summary.averageScore,
      feedbackCount: summary.feedbackCount,
    });
  } catch (err) { next(err); }
}
