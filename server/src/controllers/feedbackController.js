import Joi from 'joi';
import mongoose from 'mongoose';
import Feedback from '../models/Feedback.js';

const feedbackSchema = Joi.object({
  workshopCode: Joi.string().required(),

  score: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),

  comment: Joi.string().allow('').optional(),

  submittedBy: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }

      return value;
    })
    .optional(),
});

export const createFeedback = async (req, res, next) => {
  try {
    const { error, value } = feedbackSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const feedback = await Feedback.create(value);

    return res.status(201).json({
      feedback,
    });
  } catch (err) {
    return next(err);
  }
};

export const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find();

    return res.status(200).json({
      feedbacks,
    });
  } catch (err) {
    return next(err);
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: 'Feedback not found',
      });
    }

    return res.status(200).json({
      feedback,
    });
  } catch (err) {
    return next(err);
  }
};

export const getFeedbackSummary = async (req, res, next) => {
  try {
    const { workshopCode } = req.query;

    if (!workshopCode) {
      return res.status(400).json({
        message: 'workshopCode is required',
      });
    }

    const result = await Feedback.aggregate([
      {
        $match: {
          workshopCode,
        },
      },
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: '$score',
          },
          feedbackCount: {
            $sum: 1,
          },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        workshopCode,
        averageScore: 0,
        feedbackCount: 0,
      });
    }

    return res.status(200).json({
      workshopCode,
      averageScore: result[0].averageScore,
      feedbackCount: result[0].feedbackCount,
    });
  } catch (err) {
    return next(err);
  }
};