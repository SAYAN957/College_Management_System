import {
  SET_ERRORS,
  FACULTY_LOGIN,
  UPDATE_PASSWORD,
  UPDATE_FACULTY,
  ADD_TEST,
  GET_TEST,
  GET_STUDENT,
  MARKS_UPLOADED,
  ATTENDANCE_MARKED,
  GET_FACULTY_DASHBOARD_STATS, // Import the new action type
} from "../actionTypes";
import * as api from "../api"; // Assuming getFacultyDashboardStats is exported from here

export const facultySignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.facultySignIn(formData);
    dispatch({ type: FACULTY_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/faculty/home");
    else navigate("/faculty/password");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

// Action creator for fetching dashboard stats
export const getFacultyDashboardStatsAction = () => async (dispatch) => {
  try {
    const { data } = await api.getFacultyDashboardStats(); // Call the new API function
    dispatch({ type: GET_FACULTY_DASHBOARD_STATS, payload: data.result }); // Dispatch the action with payload
  } catch (error) {
    console.error("Error fetching faculty dashboard stats:", error); // Log error
    // Optionally dispatch an error action
    // dispatch({ type: SET_ERRORS, payload: error.response?.data || { message: "Failed to fetch dashboard stats" } });
  }
};

export const facultyUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      await api.facultyUpdatePassword(formData); // Removed unused 'data'
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigate("/faculty/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };
  export const updateFaculty = (formData) => async (dispatch) => {
    try {
      await api.updateFaculty(formData); // Removed unused 'data'
      dispatch({ type: UPDATE_FACULTY, payload: true });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };
  
  export const createTest = (formData) => async (dispatch) => {
    try {
      await api.createTest(formData); // Removed unused 'data'
      alert("Test Created Successfully");
      dispatch({ type: ADD_TEST, payload: true });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const getTest = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getTest(formData);
    dispatch({ type: GET_TEST, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getStudent = (formData) => async (dispatch) => {
  try {
    console.log("Fetching students with data:", formData);
    const { data } = await api.getMarksStudent(formData);
    console.log("Student data received:", data);
    
    if (data && data.result) {
      dispatch({ type: GET_STUDENT, payload: data.result });
    } else {
      console.error("Invalid response format:", data);
      dispatch({ type: SET_ERRORS, payload: { noStudentError: "No students found" } });
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    dispatch({ 
      type: SET_ERRORS, 
      payload: error.response?.data || { backendError: "Failed to fetch students" } 
    });
  }
};



export const uploadMarks = (marks, department, section, year, test, date, subjectCode) => async (dispatch) => {
  try {
    const formData = {
      marks,
      department,
      section,
      year,
      test,
      date,
      subjectCode,
    };
    await api.uploadMarks(formData); // Removed unused 'data'
    alert("Marks Uploaded Successfully");
    dispatch({ type: MARKS_UPLOADED, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};


export const markAttendance = (checkedValue, subjectName, department, year, section) => async (dispatch) => {
  try {
    console.log("Marking attendance with data:", {
      selectedStudents: checkedValue,
      subjectName,
      department,
      year,
      section
    });
    
    const formData = {
      selectedStudents: checkedValue,
      subjectName,
      department,
      year,
      section,
    };
    
    const { data } = await api.markAttendance(formData);
    console.log("Attendance response:", data);
    
    alert("Attendance Marked Successfully");
    dispatch({ type: ATTENDANCE_MARKED, payload: true });
  } catch (error) {
    console.error("Error marking attendance:", error);
    dispatch({ 
      type: SET_ERRORS, 
      payload: error.response?.data || { backendError: "Failed to mark attendance" } 
    });
  }
};
