import Joi from 'joi';
import { Feedback } from '../models/Feedback.js';

const feedbackSchema = Joi.object({
  workshopCode: Joi.string().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
  submittedBy: Joi.string().optional()
});

// GET /api/feedback
export async function getAllFeedbacks(req, res, next) {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json({ feedbacks });
  } catch (err) { next(err); }
}

// GET /api/feedback/:id
export async function getFeedback(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ feedback });
  } catch (err) { next(err); }
}

// POST /api/feedback
export async function createFeedback(req, res, next) {
  try {
    const { value, error } = feedbackSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const feedback = await Feedback.create(value);
    res.status(201).json({ feedback });
  } catch (err) { next(err); }
}

// GET /api/feedback/summary?workshopCode=WS101
export async function getFeedbackSummary(req, res, next) {
  try {
    const workshopCode = req.query.workshopCode;
    if (!workshopCode) return res.status(400).json({ message: 'workshopCode is required' });

    const [summary] = await Feedback.aggregate([
      { $match: { workshopCode } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          feedbackCount: { $sum: 1 }
        }
      }
    ]);

    return res.json({
      workshopCode,
      averageScore: summary ? Number(summary.averageScore) : 0,
      feedbackCount: summary ? summary.feedbackCount : 0
    });
  } catch (err) { next(err); }
}
