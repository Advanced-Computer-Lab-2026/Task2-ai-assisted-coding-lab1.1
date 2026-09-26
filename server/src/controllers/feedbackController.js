import { Feedback } from '../models/Feedback.js';

// GET /api/feedback
// TODO: implement per README.md section 2.
export async function getAllFeedbacks(req, res, next) {
  try {
    const feedbacks = await Feedback.find();
    return res.status(200).json({ feedbacks });
    
  } catch (err) { next(err); }
}

// GET /api/feedback/:id
// TODO: implement per README.md section 2.
export async function getFeedback(req, res, next) {
  try {const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
  } return res.status(200).json({ feedback });
  } 
  
  catch (err) { next(err); }
}

// POST /api/feedback
// TODO: implement per README.md section 2.
export async function createFeedback(req, res, next) {
  try {
    const { workshopCode, score, comment, submittedBy } = req.body;

    const feedback = await Feedback.create({
      workshopCode,
      score,
      comment,
      submittedBy,
    });

    return res.status(201).json({ feedback });
  } catch (err) { next(err); }
}

// GET /api/feedback/summary?workshopCode=WS101
// TODO: implement per README.md section 3.
export async function getFeedbackSummary(req, res, next) {
  try {
    const { workshopCode } = req.query;

    if (!workshopCode) {
      return res.status(400).json({ message: 'workshopCode query param is required' });
    }

    const [summary] = await Feedback.aggregate([
      { $match: { workshopCode } },
      {
        $group: {
          _id: '$workshopCode',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' },
        },
      },
    ]);

    return res.status(200).json({
      workshopCode,
      count: summary?.count ?? 0,
      averageScore: summary?.averageScore ?? null,
    });
  } catch (err) { next(err); }
}
