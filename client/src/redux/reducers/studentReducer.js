import {
  LOGOUT,
  STUDENT_LOGIN,
  UPDATE_STUDENT,
  UPDATE_PASSWORD,
  TEST_RESULT,
  ATTENDANCE,
  GET_SUBJECT_LIST,
} from "../actionTypes";

const initialState = {
  authData: null,
  updatedPassword: false,
  updatedStudent: false,
  testAdded: false,
  marksUploaded: false,
  attendanceUploaded: false,
  testResult: [],
  tests: [],
  attendance: [],
  subjects: [],
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case STUDENT_LOGIN:
      localStorage.setItem("user", JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    case UPDATE_PASSWORD:
      return {
        ...state,
        updatedPassword: action.payload,
      };
    case UPDATE_STUDENT:
      return {
        ...state,
        updatedStudent: action.payload,
      };
      case TEST_RESULT:
        return {
          ...state,
          testResult: action.payload,
          // Add this flag to indicate data has been loaded
          testResultLoaded: true
        };
    case ATTENDANCE:
      return {
        ...state,
        attendance: action.payload,
      };
    case GET_SUBJECT_LIST:
      return {
        ...state,
        subjects: action.payload, // Ensure this is a new array
      };
    default:
      return state;
  }
};

export default studentReducer;
