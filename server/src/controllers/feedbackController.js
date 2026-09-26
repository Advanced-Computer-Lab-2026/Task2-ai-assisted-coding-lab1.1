import { Feedback } from '../models/Feedback.js';

// @desc    Create new feedback
// @route   POST /api/feedback
export const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ feedback });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all feedback entries
// @route   GET /api/feedback
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single feedback by ID
// @route   GET /api/feedback/:id
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json({ feedback });
  } catch (error) {
    res.status(404).json({ message: 'Feedback not found' });
  }
};

// @desc    Get feedback summary aggregation
// @route   GET /api/feedback/summary
export const getFeedbackSummary = async (req, res) => {
  try {
    const { workshopCode } = req.query;
    if (!workshopCode) {
      return res.status(400).json({ message: 'workshopCode is required' });
    }

    const stats = await Feedback.aggregate([
      { $match: { workshopCode } },
      {
        $group: {
          _id: '$workshopCode',
          averageScore: { $avg: '$score' },
          feedbackCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        workshopCode,
        averageScore: 0,
        feedbackCount: 0
      });
    }

    res.status(200).json({
      workshopCode,
      averageScore: stats[0].averageScore,
      feedbackCount: stats[0].feedbackCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
