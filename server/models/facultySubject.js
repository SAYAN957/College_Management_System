import mongoose from "mongoose";

const facultySubjectSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "faculty",
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true
  },
  department: {
    type: String,
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
});

const FacultySubject = mongoose.model("facultySubject", facultySubjectSchema);

export default FacultySubject;