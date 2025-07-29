import express from "express";
import {
  facultyLogin,
  updatedPassword,
  updateFaculty,
  createTest,
  getTest,
  getStudent,
  uploadMarks,
  markAttendance,
  getFacultyDashboardStats, // Import the new controller function
} from "../controller/facultyController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", facultyLogin);
router.post("/updatepassword", auth, updatedPassword);
router.post("/updateprofile", auth, updateFaculty);
router.post("/createtest", auth, createTest);
router.post("/gettest", auth, getTest);
router.post("/getstudent", auth, getStudent);
router.post("/uploadmarks", auth, uploadMarks);
router.post("/markattendance", auth, markAttendance);
router.get("/dashboard-stats", auth, getFacultyDashboardStats); // Add route for dashboard stats

export default router;
