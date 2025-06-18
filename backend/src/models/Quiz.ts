import mongoose, { Document, Schema } from "mongoose";

// TypeScript interfaces
export interface IQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuiz extends Document {
  quizId: string;
  topic: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const QuestionSchema = new Schema<IQuestion>({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const QuizSchema = new Schema<IQuiz>(
  {
    quizId: { type: String, required: true, unique: true },
    topic: { type: String, required: true },
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

// Create indexes for better query performance
QuizSchema.index({ quizId: 1 });
QuizSchema.index({ topic: 1 });
QuizSchema.index({ createdAt: -1 });

export const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);
