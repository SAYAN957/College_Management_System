import axios from "axios";

// const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });
const API = axios.create({ baseURL: "http://localhost:5001/" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return req;
});

// Admin

export const adminSignIn = (formData) => API.post("/api/admin/login", formData);

export const adminUpdatePassword = (updatedPassword) =>
  API.post("/api/admin/updatepassword", updatedPassword);

export const getAllStudent = () => API.get("/api/admin/getallstudent");

export const getAllFaculty = () => API.get("/api/admin/getallfaculty");

export const getAllAdmin = () => API.get("/api/admin/getalladmin");

export const getAllDepartment = () => API.get("/api/admin/getalldepartment");
export const getAllSubject = () => API.get("/api/admin/getallsubject");

export const updateAdmin = (updatedAdmin) =>
  API.post("/api/admin/updateprofile", updatedAdmin);

export const addAdmin = (admin) => API.post("/api/admin/addadmin", admin);
export const createNotice = (notice) =>
  API.post("/api/admin/createnotice", notice);
export const deleteAdmin = (data) => API.post("/api/admin/deleteadmin", data);
export const deleteFaculty = (data) =>
  API.post("/api/admin/deletefaculty", data);
export const deleteStudent = (data) =>
  API.post("/api/admin/deletestudent", data);
export const deleteSubject = (data) =>
  API.post("/api/admin/deletesubject", data);
export const deleteDepartment = (data) =>
  API.post("/api/admin/deletedepartment", data);

export const getAdmin = (admin) => API.post("/api/admin/getadmin", admin);

export const addDepartment = (department) =>
  API.post("/api/admin/adddepartment", department);

export const addFaculty = (faculty) =>
  API.post("/api/admin/addfaculty", faculty);

export const getFaculty = (department) =>
  API.post("/api/admin/getfaculty", department);

export const addSubject = (subject) =>
  API.post("/api/admin/addsubject", subject);
export const getSubject = (subject) =>
  API.post("/api/admin/getsubject", subject);

export const addStudent = (student) =>
  API.post("/api/admin/addstudent", student);

export const getStudent = (student) =>
  API.post("/api/admin/getstudent", student);
export const getNotice = (notice) => API.post("/api/admin/getnotice", notice);

export const assignSubjectToFaculty = (formData) =>
  API.post("/api/admin/assignsubject", formData);

export const removeSubjectFromFaculty = (formData) =>
  API.post("/api/admin/removesubject", formData);

export const getFacultySubjects = (formData) =>
  API.post("/api/admin/getfacultysubjects", formData);

export const getSubjectFaculty = (formData) =>
  API.post("/api/admin/getsubjectfaculty", formData);


// Faculty

export const facultySignIn = (formData) =>
  API.post("/api/faculty/login", formData);

export const facultyUpdatePassword = (updatedPassword) =>
  API.post("/api/faculty/updatepassword", updatedPassword);

export const updateFaculty = (updatedFaculty) =>
  API.post("/api/faculty/updateprofile", updatedFaculty);

export const createTest = (test) => API.post("/api/faculty/createtest", test);
export const getTest = (test) => API.post("/api/faculty/gettest", test);
export const getMarksStudent = (student) =>
  API.post("/api/faculty/getstudent", student);
export const uploadMarks = (data) => API.post("/api/faculty/uploadmarks", data);
export const markAttendance = (data) =>
  API.post("/api/faculty/markattendance", data);
export const getFacultyDashboardStats = () => API.get("/api/faculty/dashboard-stats"); // Add API call for dashboard stats

// Student

export const studentSignIn = (formData) =>
  API.post("/api/student/login", formData);

export const studentUpdatePassword = (updatedPassword) =>
  API.post("/api/student/updatepassword", updatedPassword);

export const updateStudent = (updatedStudent) =>
  API.post("/api/student/updateprofile", updatedStudent);

export const getTestResult = (formData) => API.post("/api/student/testresult", formData);

export const getAttendance = (attendance) =>
  API.post("/api/student/attendance", attendance);

export const assignSubjectApi = (data) => API.post("/api/admin/assignsubject", data);
export const removeSubjectApi = (data) => API.post("/api/admin/removesubject", data);
export const getFacultySubjectsApi = (data) => API.post("/api/admin/getfacultysubjects", data);
export const getSubjectFacultyApi = (data) => API.post("/api/admin/getsubjectfaculty", data);

// Add this function to fetch marks by test type
export const getSubjectList = () => API.get("/api/student/subject-list");
export const getMarksByTestType = (data) => API.post("/api/student/marks-by-test", data);
