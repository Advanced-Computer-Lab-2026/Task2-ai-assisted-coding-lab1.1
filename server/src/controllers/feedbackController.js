import Joi from 'joi';
import mongoose from 'mongoose';
import { Feedback } from '../models/Feedback.js';

const createSchema = Joi.object({
  workshopCode: Joi.string().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('').optional(),
  submittedBy: Joi.string().hex().length(24).optional()
});

// GET /api/feedback
// TODO: implement per README.md section 2.
export async function getAllFeedbacks(req, res, next) {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json({ feedbacks });
  } catch (err) {
    next(err);
  }
}


// GET /api/feedback/:id
// TODO: implement per README.md section 2.
export async function getFeedback(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid feedback ID'
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: 'Feedback not found'
      });
    }

    res.status(200).json({ feedback });
  } catch (err) {
    next(err);
  }
}

// POST /api/feedback
// TODO: implement per README.md section 2.
export async function createFeedback(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    const feedback = await Feedback.create(value);
    res.status(201).json({ feedback });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'Feedback already submitted'
      });
    }

    next(err);
  }
}

// GET /api/feedback/summary?workshopCode=WS101
// TODO: implement per README.md section 3.
export async function getFeedbackSummary(req, res, next) {
  try {
    const { workshopCode } = req.query;

    if (typeof workshopCode !== 'string' || !workshopCode.trim()) {
      return res.status(400).json({
        message: 'workshopCode is required'
      });
    }

    const result = await Feedback.aggregate([
      { $match: { workshopCode } },
      {
        $group: {
          _id: '$workshopCode',
          averageScore: { $avg: '$score' },
          feedbackCount: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      workshopCode,
      averageScore: result[0]?.averageScore ?? 0,
      feedbackCount: result[0]?.feedbackCount ?? 0
    });
  } catch (err) {
    next(err);
  }
}