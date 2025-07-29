import express from "express";
import {
  studentLogin,
  updatedPassword,
  updateStudent,
  testResult,
  attendance,
  getSubjectList,
} from "../controller/studentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", studentLogin);
router.post("/updatepassword", auth, updatedPassword);
router.post("/updateprofile", auth, updateStudent);
router.post("/testresult", auth, testResult);
router.post("/attendance", auth, attendance);
router.get("/subject-list", auth, getSubjectList);

export default router;
