import Joi from 'joi';
import { Feedback } from '../models/Feedback.js';

const createSchema = Joi.object({
  workshopCode: Joi.string().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('', null),
  submittedBy: Joi.string().hex().length(24)
});

function publicFeedback(f) {
  return {
    id: f._id.toString(),
    workshopCode: f.workshopCode,
    score: f.score,
    comment: f.comment,
    submittedBy: f.submittedBy,
    createdAt: f.createdAt
  };
}

// POST /api/feedback
export async function createFeedback(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    if (value.submittedBy) {
      const existing = await Feedback.findOne({
        workshopCode: value.workshopCode,
        submittedBy: value.submittedBy
      });
      if (existing) {
        return res.status(409).json({ message: 'Feedback already submitted for this workshop' });
      }
    }

    const feedback = await Feedback.create(value);
    res.status(201).json({ feedback: publicFeedback(feedback) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Feedback already submitted for this workshop' });
    }
    next(err);
  }
}

// GET /api/feedback
export async function getAllFeedbacks(req, res, next) {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json({ feedbacks: feedbacks.map(publicFeedback) });
  } catch (err) {
    next(err);
  }
}

// GET /api/feedback/summary?workshopCode=WS101
export async function getFeedbackSummary(req, res, next) {
  try {
    const { workshopCode } = req.query;
    if (!workshopCode) {
      return res.status(400).json({ message: 'workshopCode is required' });
    }

    const [result] = await Feedback.aggregate([
      { $match: { workshopCode } },
      {
        $group: {
          _id: '$workshopCode',
          averageScore: { $avg: '$score' },
          feedbackCount: { $sum: 1 }
        }
      }
    ]);

    if (!result) {
      return res.json({ workshopCode, averageScore: 0, feedbackCount: 0 });
    }

    res.json({
      workshopCode,
      averageScore: result.averageScore,
      feedbackCount: result.feedbackCount
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/feedback/:id
export async function getFeedback(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ feedback: publicFeedback(feedback) });
  } catch (err) {
    next(err);
  }
}