import student from "../models/student.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const studentLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingStudent = await Student.findOne({ username });
    if (!existingStudent) {
      errors.usernameError = "Student doesn't exist.";
      return res.status(404).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingStudent.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingStudent.email,
        id: existingStudent._id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingStudent, token: token });
  } catch (error) {
    console.log(error);
  }
};

export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const student = await Student.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();
    if (student.passwordUpdated === false) {
      student.passwordUpdated = true;
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: student,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSubjectList = async (req, res) => {
  try {
    console.log("Fetching subject list for student ID:", req.userId);
    const errors = { noSubjectsError: String };
    const studentId = req.userId; // from auth middleware
    
    const student = await Student.findById(studentId);
    if (!student) {
      console.error("Student not found with ID:", studentId);
      errors.noSubjectsError = "Student not found";
      return res.status(404).json(errors);
    }
    
    const { department, year, section } = student;
    console.log(`Student details - Department: ${department}, Year: ${year}, Section: ${section}`);
    
    // Find subjects for the student's department, year, and section
    const subjects = await Subject.find({ 
      department, 
      year, 
      section 
    });
    
    console.log(`Found ${subjects.length} subjects matching the criteria`);
    
    if (subjects.length === 0) {
      console.error("No subjects found for student:", studentId);
      errors.noSubjectsError = "No subjects found for your department, year, and section";
      return res.status(404).json(errors);
    }
    
    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error in getSubjectList:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      batch,
      section,
      year,
      fatherName,
      motherName,
      fatherContactNumber,
    } = req.body;
    const updatedStudent = await Student.findOne({ email });
    if (name) {
      updatedStudent.name = name;
      await updatedStudent.save();
    }
    if (dob) {
      updatedStudent.dob = dob;
      await updatedStudent.save();
    }
    if (department) {
      updatedStudent.department = department;
      await updatedStudent.save();
    }
    if (contactNumber) {
      updatedStudent.contactNumber = contactNumber;
      await updatedStudent.save();
    }
    if (batch) {
      updatedStudent.batch = batch;
      await updatedStudent.save();
    }
    if (section) {
      updatedStudent.section = section;
      await updatedStudent.save();
    }
    if (year) {
      updatedStudent.year = year;
      await updatedStudent.save();
    }
    if (motherName) {
      updatedStudent.motherName = motherName;
      await updatedStudent.save();
    }
    if (fatherName) {
      updatedStudent.fatherName = fatherName;
      await updatedStudent.save();
    }
    if (fatherContactNumber) {
      updatedStudent.fatherContactNumber = fatherContactNumber;
      await updatedStudent.save();
    }
    if (avatar) {
      updatedStudent.avatar = avatar;
      await updatedStudent.save();
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json(error);
  }
};

// In studentController.js - testResult function
export const testResult = async (req, res) => {
  try {
    console.log("Test Result API called with:", req.body);
    console.log("User ID from token:", req.userId);
    
    const errors = { noMarksError: String };
    
    // Find the student
    const student = await Student.findById(req.userId);
    if (!student) {
      console.log("Student not found with ID:", req.userId);
      errors.noMarksError = "Student not found";
      return res.status(404).json(errors);
    }
    
    console.log("Found student:", student.name);
    
    // Use student's own department/year/section if not provided in request
    const { department, year, section } = req.body || {};
    const effectiveDepartment = department || student.department;
    const effectiveYear = year || student.year;
    const effectiveSection = section || student.section;
    
    console.log("Using effective criteria:", { 
      department: effectiveDepartment, 
      year: effectiveYear, 
      section: effectiveSection 
    });
    
    // Find tests for this department, year, section
    const tests = await Test.find({ 
      department: effectiveDepartment, 
      year: effectiveYear, 
      section: effectiveSection 
    });
    if (tests.length === 0) {
      console.log("No tests found for:", { department, year, section });
      errors.noMarksError = "No tests found";
      return res.status(404).json(errors);
    }
    
    console.log(`Found ${tests.length} tests`);
    
    // Get test IDs
    const testIds = tests.map(test => test._id);
    
    // Find marks for this student and these tests
    const marks = await Marks.find({
      student: student._id,
      exam: { $in: testIds }
    }).populate('exam');
    
    if (marks.length === 0) {
      console.log("No marks found for student:", student._id);
      errors.noMarksError = "No marks found";
      return res.status(404).json(errors);
    }
    
    console.log(`Found ${marks.length} marks entries`);
    
    res.status(200).json({ result: marks });
  } catch (error) {
    console.error("Error in testResult controller:", error);
    const errors = { backendError: String };
    errors.backendError = error.message;
    res.status(500).json(errors);
  }
};



export const attendance = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { notestError: String };
    const student = await Student.findOne({ department, year, section });

    const attendence = await Attendence.find({
      student: student._id,
    }).populate("subject");
    if (!attendence) {
      res.status(400).json({ message: "Attendence not found" });
    }

    res.status(200).json({
      result: attendence.map((att) => {
        let res = {};
        res.percentage = (
          (att.lectureAttended / att.totalLecturesByFaculty) *
          100
        ).toFixed(2);
        res.subjectCode = att.subject.subjectCode;
        res.subjectName = att.subject.subjectName;
        res.attended = att.lectureAttended;
        res.total = att.totalLecturesByFaculty;
        return res;
      }),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMarksByTestType = async (req, res) => {
  try {
    const { department, year, section, studentId } = req.body;
    const errors = { noMarksError: String };
    
    // Find the student
    const student = await Student.findById(studentId || req.userId);
    if (!student) {
      errors.noMarksError = "Student not found";
      return res.status(404).json(errors);
    }
    
    // Find tests for this department, year, section
    const tests = await Test.find({ department, year, section });
    if (tests.length === 0) {
      errors.noMarksError = "No tests found";
      return res.status(404).json(errors);
    }
    
    // Get test IDs
    const testIds = tests.map(test => test._id);
    
    // Find marks for this student and these tests
    const marks = await Marks.find({
      student: student._id,
      exam: { $in: testIds }
    }).populate({
      path: 'exam',
      select: 'test subjectCode totalMarks date'
    });
    
    if (marks.length === 0) {
      errors.noMarksError = "No marks found";
      return res.status(404).json(errors);
    }
    
    // Group marks by test type
    const marksByTestType = {};
    marks.forEach(mark => {
      const testType = mark.exam.test;
      if (!marksByTestType[testType]) {
        marksByTestType[testType] = [];
      }
      marksByTestType[testType].push(mark);
    });
    
    res.status(200).json({ result: marksByTestType });
  } catch (error) {
    console.error("Error fetching marks by test type:", error);
    const errors = { backendError: String };
    errors.backendError = error.message;
    res.status(500).json(errors);
  }
};
