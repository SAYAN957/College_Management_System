import mongoose from "mongoose";

const testSchema = mongoose.Schema({
  test: {
    type: String,
    required: true,
    enum: ['Midterm1', 'Midterm2', 'End Sem', 'Assignment'],
    trim: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  totalMarks: {
    type: Number,
    default: 10,
  },
  year: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

testSchema.index({ subjectCode: 1, year: 1, section: 1, test: 1 }, { unique: true });
export default mongoose.model("test", testSchema);
