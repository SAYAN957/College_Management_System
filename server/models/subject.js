import mongoose from "mongoose";
const { Schema } = mongoose;
const subjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
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
  totalLectures: {
    type: Number,
    default: 10,
  },
  year: {
    type: String,
    required: true,
  },
 section: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  attendence: {
    type: Schema.Types.ObjectId,
    ref: "attendence",
  },
});

export default mongoose.model("subject", subjectSchema);
