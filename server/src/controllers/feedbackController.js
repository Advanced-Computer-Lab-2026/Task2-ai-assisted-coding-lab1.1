import { Feedback } from '../models/Feedback.js';

// GET /api/feedback
// TODO: implement per README.md section 2.
export async function getAllFeedbacks(req, res, next) {
  try {
    // TODO
    const feedbacks = await Feedback.find();
    res.status(200).json({ feedbacks });
    
  } catch (err) { next(err); }
}

// GET /api/feedback/:id
// TODO: implement per README.md section 2.
export async function getFeedback(req, res, next) {
  try {
    // TODO
     
     
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ feedback });
  } catch (err) { next(err); }
}

// POST /api/feedback
// TODO: implement per README.md section 2.
export async function createFeedback(req, res, next) {
  try {
    // TODO
    const { workshopCode, score, comment, submittedBy } = req.body;

    if (!workshopCode || !workshopCode.trim()) {
      return res.status(400).json({ message: 'workshopCode is required' });
    }

    if (score === undefined || score === null) {
      return res.status(400).json({ message: 'score is required' });
    }

    const feedback = await Feedback.create({
      workshopCode,
      score,
      comment,
      submittedBy,
    });

    res.status(201).json({ feedback });
  } catch (err) { next(err); }
}

// GET /api/feedback/summary?workshopCode=WS101
// TODO: implement per README.md section 3.
export async function getFeedbackSummary(req, res, next) {
  try {
    // TODO
  } catch (err) { next(err); }
}
