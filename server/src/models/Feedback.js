import mongoose from 'mongoose';

// TODO: define the Feedback schema per README.md section 1.

const feedbackSchema = new mongoose.Schema(
  {
     workshopCode: {type: String,required: true},
    score: {type: Number,required: true,min: 1,max: 5,},
    comment: {type: String,required: false,},
    submittedBy: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: false,},
  },
  {timestamps: true,},
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.

export const Feedback = mongoose.model('Feedback', feedbackSchema);
