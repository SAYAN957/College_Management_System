import {
  SET_ERRORS,
  UPDATE_PASSWORD,
  TEST_RESULT,
  STUDENT_LOGIN,
  ATTENDANCE,
  UPDATE_STUDENT,
  GET_SUBJECT,
  GET_SUBJECT_LIST,
} from "../actionTypes";
import * as api from "../api";

export const studentSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.studentSignIn(formData);
    dispatch({ type: STUDENT_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/student/home");
    else navigate("/student/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const studentUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      await api.studentUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigate("/student/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const updateStudent = (formData) => async (dispatch) => {
  try {
    await api.updateStudent(formData);
    dispatch({ type: UPDATE_STUDENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getSubject = (department, year) => async (dispatch) => {
  try {
    const formData = {
      department,
      year,
    };
    const { data } = await api.getSubject(formData);
    dispatch({ type: GET_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getSubjectList = () => async (dispatch) => {
  try {
    const { data } = await api.getSubjectList();
    dispatch({ type: GET_SUBJECT_LIST, payload: data.subjects });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getTestResult = (formData) => async (dispatch) => {
  try {
    console.log("Calling getTestResult API with:", formData);
    
    const { data } = await api.getTestResult(formData);
    console.log("API response:", data);
    
    dispatch({ type: TEST_RESULT, payload: data });
  } catch (error) {
    console.error("Error in getTestResult action:", error);
    
    if (error.response) {
      console.error("Error response data:", error.response.data);
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    } else if (error.request) {
      console.error("No response received:", error.request);
      dispatch({ 
        type: SET_ERRORS, 
        payload: { backendError: "No response from server. Please try again." } 
      });
    } else {
      console.error("Error message:", error.message);
      dispatch({ 
        type: SET_ERRORS, 
        payload: { backendError: "An error occurred. Please try again." } 
      });
    }
  }
};

export const getAttendance =
  (department, year, section) => async (dispatch) => {
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await api.getAttendance(formData);
      dispatch({ type: ATTENDANCE, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const getMarksByTestType = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getMarksByTestType(formData);
    dispatch({ type: TEST_RESULT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
