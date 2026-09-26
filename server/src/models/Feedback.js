import mongoose from 'mongoose';

/**
 * Feedback Schema
 * Represents a user's feedback for a specific workshop.
 */
const feedbackSchema = new mongoose.Schema(
  {
    // The unique identifier for the workshop
    workshopCode: {
      type: String,
      required: true,
    },
    // The rating given to the workshop, must be between 1 and 5
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // Optional text feedback
    comment: {
      type: String,
    },
    // Optional reference to the User who submitted the feedback
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true
  }
);


// Compound Unique Index
// This ensures that a specific user (submittedBy) can only leave
// one piece of feedback for a specific workshop (workshopCode).
// If submittedBy is null, it still works as a unique constraint on workshopCode.
feedbackSchema.index({ workshopCode: 1, submittedBy: 1 }, { unique: true });

export const Feedback = mongoose.model('Feedback', feedbackSchema);
