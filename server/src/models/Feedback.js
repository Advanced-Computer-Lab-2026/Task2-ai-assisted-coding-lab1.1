import mongoose from 'mongoose';

// TODO: define the Feedback schema per README.md section 1.

const feedbackSchema = new mongoose.Schema(
  {
    // TODO
    workshopCode: { type: String, required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String},
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.
feedbackSchema.index(
  { workshopCode: 1, submittedBy: 1 },
  { unique: true }
);
//the same user cannot submit feedback for the same workshop more than once.
export const Feedback = mongoose.model('Feedback', feedbackSchema);
