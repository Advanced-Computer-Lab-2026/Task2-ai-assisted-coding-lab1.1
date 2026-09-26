import { Feedback } from '../models/Feedback.js';

// GET /api/feedback
// TODO: implement per README.md section 2.
export async function getAllFeedbacks(req, res, next) {
  try {
    const feedbacks = await Feedback.find()
    res.status(200).json({message:"Success",feedbacks})

  } catch (err) { next(err); }
}

// GET /api/feedback/:id
// TODO: implement per README.md section 2.
export async function getFeedback(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id)
    res.status(200).json({message:"Success",feedback})
  } catch (err) { next(err); }
}

// POST /api/feedback
// TODO: implement per README.md section 2.
export async function createFeedback(req, res, next) {
  try {
    const feedback = await Feedback.create({
      workshopCode: req.body.workshopCode,
      score: req.body.score,
      comment: req.body.comment,
      submittedBy: req.body.submittedBy
    });

    res.status(201).json({
      message: "Feedback created successfully",
      feedback
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/feedback/summary?workshopCode=WS101
// TODO: implement per README.md section 3.
export async function getFeedbackSummary(req, res, next) {
  try {
    const { workshopCode } = req.query;

    if (!workshopCode) {
      return res.status(400).json({
        message: "workshopCode is required"
      });
    }

    const result = await Feedback.aggregate([
      {
        $match: {
          workshopCode
        }
      },
      {
        $group: {
          _id: "$workshopCode",
          averageScore: { $avg: "$score" },
          feedbackCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        workshopCode,
        averageScore: 0,
        feedbackCount: 0
      });
    }

    res.status(200).json({
      workshopCode,
      averageScore: result[0].averageScore,
      feedbackCount: result[0].feedbackCount
    });
  } catch (err) {
    next(err);
  }
}
