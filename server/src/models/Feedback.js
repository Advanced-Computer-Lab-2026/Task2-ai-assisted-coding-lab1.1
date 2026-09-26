import mongoose from 'mongoose';

// TODO: define the Feedback schema per README.md section 1.

const feedbackSchema = new mongoose.Schema(
  {
    workshopCode: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ workshopCode: 1, submittedBy: 1 }, { unique: true });

export const Feedback = mongoose.model('Feedback', feedbackSchema);
// 1. The Model (Feedback.js)

// Mongoose needs a schema (the blueprint) before it can give you a model (the tool you actually use to query/create documents).