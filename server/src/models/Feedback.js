import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    workshopCode: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// One feedback per user per workshop. The partial filter lets several
// anonymous feedbacks (no submittedBy) exist for the same workshop.
feedbackSchema.index(
  { workshopCode: 1, submittedBy: 1 },
  { unique: true, partialFilterExpression: { submittedBy: { $exists: true } } }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);