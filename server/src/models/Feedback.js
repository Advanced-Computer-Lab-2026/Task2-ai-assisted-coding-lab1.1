import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
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
    optional: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    optional: true,
  },
}, {
  timestamps: true,
});

// Compound unique index on workshopCode and submittedBy
feedbackSchema.index({ workshopCode: 1, submittedBy: 1 }, { unique: true });

export const Feedback = mongoose.model('Feedback', feedbackSchema);
