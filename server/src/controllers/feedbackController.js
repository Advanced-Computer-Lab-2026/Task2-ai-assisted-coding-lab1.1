import Feedback from '../models/Feedback.js';

// POST /api/feedback
export const createFeedback = async (req, res, next) => {
  try {
    const { workshopCode, score, comment, submittedBy } = req.body;

    const feedback = await Feedback.create({
      workshopCode,
      score,
      comment,
      submittedBy,
    });

    res.status(201).json({ feedback });
  } catch (err) {
    next(err);
  }
};

// GET /api/feedback
export const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json({ feedbacks });
  } catch (err) {
    next(err);
  }
};

// GET /api/feedback/:id
export const getFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ feedback });
  } catch (err) {
    next(err);
  }
};

// GET /api/feedback/summary?workshopCode=WS101
export const getFeedbackSummary = async (req, res, next) => {
  try {
    const { workshopCode } = req.query;

    if (!workshopCode) {
      return res.status(400).json({ message: 'workshopCode is required' });
    }

    const summary = await Feedback.aggregate([
      { $match: { workshopCode } },
      {
        $group: {
          _id: '$workshopCode',
          averageScore: { $avg: '$score' },
          feedbackCount: { $sum: 1 },
        },
      },
    ]);

    if (!summary || summary.length === 0) {
      return res.status(200).json({
        workshopCode,
        averageScore: 0,
        feedbackCount: 0,
      });
    }

    res.status(200).json({
      workshopCode,
      averageScore: summary[0].averageScore,
      feedbackCount: summary[0].feedbackCount,
    });
  } catch (err) {
    next(err);
  }
};