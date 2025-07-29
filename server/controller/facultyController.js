import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import FacultySubject from "../models/facultySubject.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingFaculty = await Faculty.findOne({ username });
    if (!existingFaculty) {
      errors.usernameError = "Faculty doesn't exist.";
      return res.status(404).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingFaculty.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingFaculty.email,
        id: existingFaculty._id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingFaculty, token: token });
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

    const faculty = await Faculty.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    faculty.password = hashedPassword;
    await faculty.save();
    if (faculty.passwordUpdated === false) {
      faculty.passwordUpdated = true;
      await faculty.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: faculty,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getFacultyDashboardStats = async (req, res) => {
  try {
    const facultyId = req.userId; // Get faculty ID from auth middleware
    const errors = { backendError: String, facultyNotFound: String, noData: String };

    // Find the faculty member to get their department
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      errors.facultyNotFound = "Faculty not found.";
      return res.status(404).json(errors);
    }
    const department = faculty.department;

    // 1. Count Subjects in the faculty's department
    const subjectCount = await Subject.countDocuments({ department });

    // 2. Count Tests created for the faculty's department (across all years/sections for simplicity)
    //    Alternatively, could filter by subjects taught by this specific faculty if that link existed.
    const testCount = await Test.countDocuments({ department });

    // 3. Count Students enrolled in subjects within the faculty's department
    //    Find subjects in the department first
    const subjectsInDept = await Subject.find({ department }).select('_id');
    const subjectIds = subjectsInDept.map(sub => sub._id);

    //    Count unique students in the department enrolled in these subjects
    //    We use distinct count on the 'student' field in the Marks or Attendance model if available,
    //    or count distinct students having these subjects in their profile.
    //    Let's count distinct students directly from the Student model who have these subjects.
    const studentCount = await Student.countDocuments({
        department,
        subjects: { $in: subjectIds }
    });

    // Note: The 'Class' count seems ambiguous. We'll omit it for now,
    // returning student, subject, and test counts. The frontend can adapt.

    res.status(200).json({
        success: true,
        result: {
            studentCount,
            subjectCount,
            testCount,
            // We could add more stats here if needed, e.g., sections taught
        },
    });

  } catch (error) {
    console.error("Error fetching faculty dashboard stats:", error);
    errors.backendError = error.message || "Internal Server Error";
    res.status(500).json(errors);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, designation } =
      req.body;
    const updatedFaculty = await Faculty.findOne({ email });
    if (name) {
      updatedFaculty.name = name;
      await updatedFaculty.save();
    }
    if (dob) {
      updatedFaculty.dob = dob;
      await updatedFaculty.save();
    }
    if (department) {
      updatedFaculty.department = department;
      await updatedFaculty.save();
    }
    if (contactNumber) {
      updatedFaculty.contactNumber = contactNumber;
      await updatedFaculty.save();
    }
    if (designation) {
      updatedFaculty.designation = designation;
      await updatedFaculty.save();
    }
    if (avatar) {
      updatedFaculty.avatar = avatar;
      await updatedFaculty.save();
    }
    res.status(200).json(updatedFaculty);
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const createTest = async (req, res) => {
  try {
    const { subjectCode, department, year, section, date, test, totalMarks } = req.body;
    const errors = { testError: String, authError: String };
    
    // Get faculty ID from authenticated user
    const facultyId = req.userId;
    
    // Find the subject by subjectCode
    const subject = await Subject.findOne({ subjectCode });
    if (!subject) {
      errors.testError = "Subject not found";
      return res.status(404).json(errors);
    }
    
    // Check if faculty is assigned to this subject
    const assignment = await FacultySubject.findOne({
      faculty: facultyId,
      subject: subject._id,
      department
    });
    
    if (!assignment) {
      errors.authError = "You are not authorized to create tests for this subject";
      return res.status(403).json(errors);
    }
    
    // Check if test already exists with same parameters including date
    // Allow multiple tests of same type with different dates
    const existingTest = await Test.findOne({
      subjectCode,
      department,
      year,
      section,
      test,
      date,
    });
    
    if (existingTest) {
      errors.testError = "Test with same parameters already exists";
      return res.status(400).json(errors);
    }

    // Create new test
    const newTest = await new Test({
      totalMarks,
      section,
      test,
      date,
      department,
      subjectCode,
      year,
      createdBy: facultyId // Add the faculty who created the test
    });

    await newTest.save();
    
    // Find students for notification purposes (if needed)
    const students = await Student.find({ department, year, section });
    
    return res.status(200).json({
      success: true,
      message: "Test added successfully",
      response: newTest,
    });
  } catch (error) {
    console.error("Error creating test:", error);
    const errors = { backendError: String };
    errors.backendError = error.message || "Something went wrong";
    res.status(500).json(errors);
  }
};

export const getTest = async (req, res) => {
  try {
    const { department, year, section, date, subjectName } = req.body;
    
    // Validate required parameters
    if (!department || !year || !section) {
      return res.status(400).json({
        success: false,
        error: "Department, year, and section are required parameters"
      });
    }
    
    // Build query object dynamically based on provided parameters
    const query = { department, year, section };
    if (date) {
      query.date = date;
    }
    if (subjectName) {
      // Find the subject by subjectName
      const subject = await Subject.findOne({ subjectName });
      if (!subject) {
        return res.status(404).json({
          success: false,
          error: `Subject with name '${subjectName}' not found`
        });
      }
      query.subjectCode = subject.subjectCode;
    }

    const tests = await Test.find(query);

    res.status(200).json({ 
      success: true,
      result: tests 
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch tests"
    });
  }
};

export const getStudent = async (req, res) => {
  try {
    // Log the request body for debugging
    console.log("Get student request:", req.body);
    
    // Extract parameters from request
    const { department, year, section, test, subjectName } = req.body;
    const errors = { noStudentError: String };

    // Find the test to get the actual subject code
    let testDoc = await Test.findOne({ 
      department, 
      year, 
      section, 
      test 
    }).sort({ date: -1 }); // Get the latest test
    
    if (!testDoc) {
        // If test not found, try to find the test by subjectName
        const subject = await Subject.findOne({ subjectName: subjectName });
        if (!subject) {
            errors.noStudentError = `Subject '${subjectName}' not found.`;
            return res.status(404).json(errors);
        }
        
        testDoc = await Test.findOne({ 
            department, 
            year, 
            section,
            subjectCode: subject.subjectCode
        }).sort({ date: -1 });
        
        if (!testDoc) {
errors.noStudentError = `Student not found for subject '${subjectName}'.`;
            return res.status(404).json(errors);
        }
    }
    
    // Find the subject using the subject code from the test
    const subject = await Subject.findOne({ subjectCode: testDoc.subjectCode });
    if (!subject) {
      errors.noStudentError = `Subject with code '${testDoc.subjectCode}' not found.`;
      return res.status(404).json(errors);
    }

    // Find students matching the criteria
    const students = await Student.find({ department, year, section, subjects: { $in: [subject._id] } });
    console.log(`Found ${students.length} students for dept: ${department}, year: ${year}, section: ${section}, subject: ${subject.subjectName}`);

    if (students.length === 0) {
      errors.noStudentError = "No Students Found matching the criteria.";
      return res.status(404).json({errors});
    }

    // Return the students
    res.status(200).json({ result: students });
  } catch (error) {
    console.error("Error fetching students:", error); // Log the actual error
    const errors = { backendError: String };
    errors.backendError = error.message || "An error occurred while fetching students";
    res.status(500).json(errors);
  }
};


export const uploadMarks = async (req, res) => {
  try {
    const { department, year, section, test, marks, date, subjectCode } = req.body;
    const facultyId = req.userId;

    console.log("uploadMarks function called");
    console.log("uploadMarks req.body:", req.body);
    
    // Validate required parameters including subjectCode
    if (!department || !year || !section || !test || !marks || marks.length === 0 || !date || !subjectCode) {
      return res.status(400).json({
        success: false,
        error: "All fields including department, year, section, test, date, subjectCode, and marks are required"
      });
    }
    
    // Find the test with exact parameters including subjectCode
    const existingTest = await Test.findOne({
      department,
      year,
      section,
      test,
      date,
      subjectCode
    });

    console.log("existingTest:", existingTest);

    if (!existingTest) {
      return res.status(404).json({
        success: false,
        error: "Test not found with the specified parameters. Ensure test type, date, and subject code match exactly."
      });
    }
    
    // Get the subject for this test
    // Use subjectCode from request body instead of test document
    const subject = await Subject.findOne({ subjectCode });
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: `Subject with code '${subjectCode}' not found`
      });
    }
    
    // Check if faculty is assigned to this subject with matching year and section
    const assignment = await FacultySubject.findOne({
      faculty: facultyId,
      subject: subject._id,
      department,
      year,
      section
    });
    
    if (!assignment) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to upload marks for this subject, year, and section combination"
      });
    }
    
    // Check if marks are already uploaded
    const isAlready = await Marks.find({
      exam: existingTest._id,
    });

    if (isAlready.length !== 0) {
      return res.status(400).json({
        success: false,
        error: "Marks for this exam have already been uploaded"
      });
    }

    // Upload marks using bulk write for better performance
    const markDocuments = marks.map(mark => ({
      student: mark._id,
      exam: existingTest._id,
      marks: mark.value,
    }));
    
    await Marks.insertMany(markDocuments);
    
    res.status(200).json({ 
      success: true,
      message: "Marks uploaded successfully" 
    });
  } catch (error) {
    console.error("Error uploading marks:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to upload marks"
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    console.log("Mark attendance request:", req.body);
    const { selectedStudents, subjectName, department, year, section } = req.body;

    // Find the subject
    const sub = await Subject.findOne({ subjectName });
    if (!sub) {
      return res.status(404).json({ error: "Subject not found" });
    }
    console.log("Found subject:", sub);

    // Find all students in the specified department, year, section
    const allStudents = await Student.find({ department, year, section });
    console.log(`Found ${allStudents.length} students for attendance`);

    // Update total lectures for all students
    for (let i = 0; i < allStudents.length; i++) {
      const pre = await Attendence.findOne({
        student: allStudents[i]._id,
        subject: sub._id,
      });
      
      if (!pre) {
        console.log(`Creating new attendance record for student ${allStudents[i]._id}`);
        const attendence = new Attendence({
          student: allStudents[i]._id,
          subject: sub._id,
        });
        attendence.totalLecturesByFaculty += 1;
        await attendence.save();
      } else {
        console.log(`Updating existing attendance record for student ${allStudents[i]._id}`);
        pre.totalLecturesByFaculty += 1;
        await pre.save();
      }
    }

    // Mark attendance for selected students
    console.log(`Marking attendance for ${selectedStudents.length} selected students`);
    for (var a = 0; a < selectedStudents.length; a++) {
      const pre = await Attendence.findOne({
        student: selectedStudents[a],
        subject: sub._id,
      });
      
      if (!pre) {
        console.log(`Creating new attendance record with present for student ${selectedStudents[a]}`);
        const attendence = new Attendence({
          student: selectedStudents[a],
          subject: sub._id,
        });
        attendence.lectureAttended += 1;
        await attendence.save();
      } else {
        console.log(`Updating attendance with present for student ${selectedStudents[a]}`);
        pre.lectureAttended += 1;
        await pre.save();
      }
    }
    
    res.status(200).json({ message: "Attendance Marked successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    const errors = { backendError: String };
    errors.backendError = error.message || "An error occurred while marking attendance";
    res.status(500).json(errors);
  }
};
