import {
  ADMIN_LOGIN,
  UPDATE_ADMIN,
  ADD_ADMIN,
  ADD_DEPARTMENT,
  ADD_FACULTY,
  GET_ALL_FACULTY,
  ADD_SUBJECT,
  ADD_STUDENT,
  GET_ALL_STUDENT,
  GET_FACULTY,
  GET_SUBJECT,
  GET_STUDENT,
  GET_ALL_ADMIN,
  GET_ALL_DEPARTMENT,
  SET_ERRORS,
  UPDATE_PASSWORD,
  GET_ALL_SUBJECT,
  DELETE_ADMIN,
  DELETE_DEPARTMENT,
  DELETE_FACULTY,
  DELETE_STUDENT,
  DELETE_SUBJECT,
  CREATE_NOTICE,
  GET_NOTICE,
  ASSIGN_SUBJECT,
  REMOVE_SUBJECT,
  GET_FACULTY_SUBJECTS,
  GET_SUBJECT_FACULTY,
} from "../actionTypes";
import * as api from "../api";

export const adminSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.adminSignIn(formData);
    dispatch({ type: ADMIN_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/admin/home");
    else navigate("/admin/update/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const adminUpdatePassword = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.adminUpdatePassword(formData);
    dispatch({ type: UPDATE_PASSWORD, payload: true });
    alert("Password Updated");
    navigate("/admin/home");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getAllStudent = () => async (dispatch) => {
  try {
    const { data } = await api.getAllStudent();
    dispatch({ type: GET_ALL_STUDENT, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};
export const getAllFaculty = () => async (dispatch) => {
  try {
    const { data } = await api.getAllFaculty();
    dispatch({ type: GET_ALL_FACULTY, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};
export const getAllAdmin = () => async (dispatch) => {
  try {
    const { data } = await api.getAllAdmin();
    dispatch({ type: GET_ALL_ADMIN, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};

export const getAllDepartment = () => async (dispatch) => {
  try {
    const { data } = await api.getAllDepartment();
    dispatch({ type: GET_ALL_DEPARTMENT, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};

export const getAllSubject = () => async (dispatch) => {
  try {
    const { data } = await api.getAllSubject();
    dispatch({ type: GET_ALL_SUBJECT, payload: data });
  } catch (error) {
    console.log("Redux Error", error);
  }
};

export const updateAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateAdmin(formData);
    dispatch({ type: UPDATE_ADMIN, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const addAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.addAdmin(formData);
    alert("Admin Added Successfully");
    dispatch({ type: ADD_ADMIN, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const createNotice = (formData) => async (dispatch) => {
  try {
    const { data } = await api.createNotice(formData);
    alert("Notice Created Successfully");
    dispatch({ type: CREATE_NOTICE, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const getAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getAdmin(formData);
    dispatch({ type: GET_STUDENT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteAdmin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteAdmin(formData);
    alert("Admin Deleted");
    dispatch({ type: DELETE_ADMIN, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteFaculty = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteFaculty(formData);
    alert("Faculty Deleted");
    dispatch({ type: DELETE_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteStudent(formData);
    alert("Student Deleted");
    dispatch({ type: DELETE_STUDENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteSubject = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteSubject(formData);
    alert("Subject Deleted");
    dispatch({ type: DELETE_SUBJECT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const deleteDepartment = (formData) => async (dispatch) => {
  try {
    const { data } = await api.deleteDepartment(formData);
    alert("Department Deleted");
    dispatch({ type: DELETE_DEPARTMENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const addDepartment = (formData) => async (dispatch) => {
  try {
    const { data } = await api.addDepartment(formData);
    alert("Department Added Successfully");
    dispatch({ type: ADD_DEPARTMENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const addFaculty = (formData) => async (dispatch) => {
  try {
    const { data } = await api.addFaculty(formData);
    alert("Faculty Added Successfully");
    dispatch({ type: ADD_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getFaculty = (department) => async (dispatch) => {
  try {
    const { data } = await api.getFaculty(department);
    dispatch({ type: GET_FACULTY, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const addSubject = (formData) => async (dispatch) => {
  try {
    const { data } = await api.addSubject(formData);
    alert("Subject Added Successfully");
    dispatch({ type: ADD_SUBJECT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response?.data.errors });
  }
};

export const getSubject = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getSubject(formData);
    dispatch({ type: GET_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const addStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.addStudent(formData);
    alert("Student Added Successfully");
    dispatch({ type: ADD_STUDENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getStudent(formData);
    dispatch({ type: GET_STUDENT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getNotice = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getNotice(formData);
    dispatch({ type: GET_NOTICE, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
// Update these action creators to use the renamed API functions
export const assignSubjectToFaculty = (formData) => async (dispatch) => {
  try {
    const { data } = await api.assignSubjectApi(formData);
    dispatch({ type: ASSIGN_SUBJECT, payload: true });
    alert("Subject assigned successfully");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const removeSubjectFromFaculty = (formData) => async (dispatch) => {
  try {
    const { data } = await api.removeSubjectApi(formData);
    dispatch({ type: REMOVE_SUBJECT, payload: true });
    alert("Subject removed successfully");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getFacultySubjectsAction = (formData) => async (dispatch) => {
  try {
    console.log("Fetching faculty subjects for:", formData);
    const { data } = await api.getFacultySubjectsApi(formData);
    console.log("Faculty subjects response:", data);
    
    // Check if data.result exists before dispatching
    if (data && data.result) {
      dispatch({ type: GET_FACULTY_SUBJECTS, payload: data.result });
    } else {
      console.error("Invalid response format:", data);
      dispatch({ type: GET_FACULTY_SUBJECTS, payload: [] });
    }
  } catch (error) {
    console.error("Error fetching faculty subjects:", error);
    dispatch({ type: SET_ERRORS, payload: error.response?.data || { message: "Failed to fetch subjects" } });
  }
};


export const getSubjectFacultyAction = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getSubjectFacultyApi(formData);
    dispatch({ type: GET_SUBJECT_FACULTY, payload: data.result });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
