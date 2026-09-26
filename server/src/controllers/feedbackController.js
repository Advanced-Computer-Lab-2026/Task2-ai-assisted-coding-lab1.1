import Joi from 'joi';
import { Feedback } from '../models/Feedback.js';


//Validation Schema for creating feedback.
//Ensures the request body contains the correct types and constraints before hitting the DB.
const createSchema = Joi.object({
  workshopCode: Joi.string().required(),
  score: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional(),
  // Validates that submittedBy is a 24-character hex string (standard MongoDB ObjectId format)
  submittedBy: Joi.string().hex().length(24).optional(),
});


 //GET /api/feedback
 //Retrieves all feedback entries from the database.
export async function getAllFeedbacks(req, res, next) {
  try {
    // .lean() is used here to return plain JavaScript objects instead of Mongoose documents,
    // which is faster and uses less memory for read-only operations.
    const feedbacks = await Feedback.find().lean();
    res.json({ feedbacks });
  } catch (err) {
    // Pass errors to the global error handling middleware in app.js
    next(err);
  }
}


 //GET /api/feedback/:id
 //Retrieves a single feedback entry by its unique MongoDB ID.
export async function getFeedback(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id).lean();

    // If no document is found with the provided ID, return a 404 Not Found response.
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ feedback });
  } catch (err) {
    next(err);
  }
}


 //POST /api/feedback
 //Creates a new feedback entry after validating the request body.
export async function createFeedback(req, res, next) {
  try {
    // 1. Validate the incoming request body against the Joi schema.
    const { value, error } = createSchema.validate(req.body);
    if (error) {
      // Return 400 Bad Request if validation fails, including the specific Joi error message.
      return res.status(400).json({ message: error.message });
    }

    // 2. Save the validated data to MongoDB.
    const feedback = await Feedback.create(value);

    // Return 201 Created and the created document.
    res.status(201).json({ feedback });
  } catch (err) {
    next(err);
  }
}


 //GET /api/feedback/summary?workshopCode=WS101
 //Calculates the average score and total count for a specific workshop using MongoDB Aggregation.
export async function getFeedbackSummary(req, res, next) {
  try {
    const { workshopCode } = req.query;

    // Ensure the workshopCode query parameter is provided.
    if (!workshopCode) {
      return res.status(400).json({ message: 'workshopCode is required' });
    }

     //MongoDB Aggregation Pipeline:
     //1. $match: Filter documents to only include those matching the requested workshopCode.
     //2. $group: Group all matching documents together (_id: null) and calculate:
     //   - averageScore: The mathematical average of the 'score' field.
     //   - feedbackCount: The total number of documents matched.
    const stats = await Feedback.aggregate([
      { $match: { workshopCode } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          feedbackCount: { $sum: 1 },
        },
      },
    ]);

    // If no feedback exists for the workshop, the stats array will be empty.
    if (stats.length === 0) {
      return res.json({
        workshopCode,
        averageScore: 0,
        feedbackCount: 0,
      });
    }

    // Extract results from the first element of the aggregation array.
    const { averageScore, feedbackCount } = stats[0];
    res.json({
      workshopCode,
      averageScore,
      feedbackCount,
    });
  } catch (err) {
    next(err);
  }
}
