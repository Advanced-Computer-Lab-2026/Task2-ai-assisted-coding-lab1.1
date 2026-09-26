import { Feedback } from '../models/Feedback.js';

export const createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ feedback });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json({ feedback });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbackSummary = async (req, res) => {
  const { workshopCode } = req.query;
  if (!workshopCode) {
    return res.status(400).json({ message: 'workshopCode is required' });
  }

  try {
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

    if (summary.length === 0) {
      return res.status(200).json({ averageScore: 0, feedbackCount: 0 });
    }

    res.status(200).json(summary[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
