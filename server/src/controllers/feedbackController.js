import Joi from 'joi';
import { Feedback } from '../models/Feedback.js';

const createSchema = Joi.object({
  workshopCode: Joi.string().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('').optional(),
  submittedBy: Joi.alternatives().try(Joi.string(), Joi.object()).optional()
});

// GET /api/feedback
export async function getAllFeedbacks(req, res, next) {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ feedbacks });
  } catch (err) { next(err); }
}

// GET /api/feedback/:id
export async function getFeedback(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id).lean();
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.status(200).json({ feedback });
  } catch (err) { next(err); }
}

// POST /api/feedback
export async function createFeedback(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const feedback = await Feedback.create(value);
    res.status(201).json({ feedback: feedback.toObject ? feedback.toObject() : feedback });
  } catch (err) { next(err); }
}

// GET /api/feedback/summary?workshopCode=WS101
export async function getFeedbackSummary(req, res, next) {
  try {
    const workshopCode = req.query.workshopCode;
    if (!workshopCode) return res.status(400).json({ message: 'workshopCode is required' });

    const [summary] = await Feedback.aggregate([
      { $match: { workshopCode: String(workshopCode) } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          feedbackCount: { $sum: 1 }
        }
      }
    ]);

    if (!summary) {
      return res.status(200).json({ workshopCode: String(workshopCode), averageScore: 0, feedbackCount: 0 });
    }

    return res.status(200).json({
      workshopCode: String(workshopCode),
      averageScore: Number(summary.averageScore),
      feedbackCount: summary.feedbackCount
    });
  } catch (err) { next(err); }
}
