import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudent,
  markAttendance,
} from "../../../redux/actions/facultyActions";
import { getFacultySubjectsAction } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { ATTENDANCE_MARKED, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [checkedValue, setCheckedValue] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const store = useSelector((state) => state);
  // Maps chosen year to the semesters you want to show
const semesterMap = {
  "1": ["1", "2"],
  "2": ["3", "4"],
  "3": ["5", "6"],
  "4": ["7", "8"],
};
  const user = JSON.parse(localStorage.getItem("user"));
  const [value, setValue] = useState({
    department: user.result.department,
    year: "",
    section: "",
    subjectName: "",
  });

  // Fetch assigned subjects when component mounts
  useEffect(() => {
    dispatch(getFacultySubjectsAction({ facultyId: user.result._id }));
  }, [dispatch, user.result._id]);

  // Update assigned subjects when data is fetched
  useEffect(() => {
    if (store.admin && store.admin.facultySubjects) {
      console.log("Assigned subjects:", store.admin.facultySubjects);
      setAssignedSubjects(store.admin.facultySubjects);
    }
  }, [store.admin.facultySubjects]);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    setSearchClicked(true);
    setStudentsData([]); // Clear studentsData before dispatching getStudent
    dispatch(getStudent(value));
  };

  // Get students from Redux store
  const students = useSelector((state) => state.faculty.students);

  // Update local state when students data changes
  useEffect(() => {
    // Add console logs to debug
    console.log("Students from Redux store:", students);
    console.log("studentsData:", studentsData);
    console.log("searchClicked:", searchClicked);
    console.log("loading:", loading);

    if (students && students.length > 0) {
      console.log("Students found, updating studentsData");
      setStudentsData(students); // Update studentsData with the data from the Redux store
      setLoading(false);
    } else if (students && students.length === 0) {
      console.log("No students found, stopping loading");
      setStudentsData([]); // Ensure studentsData is empty when no students are found
      setLoading(false);
    }
  }, [students]);

  const handleInputChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckedValue([...checkedValue, value]);
    } else {
      setCheckedValue(checkedValue.filter((e) => e !== value));
    }
  };

  const handleAttendance = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    dispatch(
      markAttendance(
        checkedValue,
        value.subjectName,
        value.department,
        value.year,
        value.section
      )
    );
  };

  useEffect(() => {
    if (store.faculty.attendanceUploaded) {
      setLoading(false);
      setValue({
        department: user.result.department,
        year: "",
        section: "",
        subjectName: "",
      });
      setCheckedValue([]);
      setStudentsData([]);
      setSearchClicked(false);
      dispatch({ type: ATTENDANCE_MARKED, payload: false });
    }
  }, [store.faculty.attendanceUploaded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <h1>Mark Attendance</h1>
        </div>
        <div className="mr-10 bg-white flex flex-col rounded-xl p-4">
          {assignedSubjects && assignedSubjects.length > 0 ? (
            <>
              <form
                className="flex flex-col space-y-2 p-2"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <h1 className="text-[#515966] font-bold">Department</h1>
                    <input
                      disabled
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                      value={value.department}
                    />
                  </div>
                  <div>
                    <h1 className="text-[#515966] font-bold">Year</h1>
                    <Select
  required
  displayEmpty
  sx={{ height: 36, width: "100%" }}
  value={value.year}
  onChange={(e) =>
    setValue({ ...value, year: e.target.value, section: "" })  // ← reset section
}
>
  <MenuItem value="">None</MenuItem>
  <MenuItem value="1">1</MenuItem>
  <MenuItem value="2">2</MenuItem>
  <MenuItem value="3">3</MenuItem>
  <MenuItem value="4">4</MenuItem>
</Select>

                  </div>
                  <div>
                    <h1 className="text-[#515966] font-bold">Section</h1>
                    <Select
  required
  displayEmpty
  sx={{ height: 36, width: "100%" }}
  value={value.section}
  onChange={(e) =>
    setValue({ ...value, section: e.target.value })
  }
  disabled={!value.year}   // disable until a year is picked
>
  <MenuItem value="">None</MenuItem>

  {(semesterMap[value.year] || []).map((sem) => (
    <MenuItem key={sem} value={sem}>
      {sem}
    </MenuItem>
  ))}
</Select>

                  </div>
                  <div>
                    <h1 className="text-[#515966] font-bold">Subject</h1>
                    <Select
                      required
                      displayEmpty
                      sx={{ height: 36, width: '100%' }}
                      inputProps={{ "aria-label": "Without label" }}
                      value={value.subjectName}
                      onChange={(e) =>
                        setValue({ ...value, subjectName: e.target.value })
                      }
                    >
                      <MenuItem value="">None</MenuItem>
                      {assignedSubjects.map((subject, idx) => (
                        <MenuItem key={idx} value={subject.subject?.subjectName}>
                          {subject.subject?.subjectName}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className={classes.adminFormSubmitButton}
                    type="submit"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className={classes.loadingAndError}>
                {loading && (
                  <Spinner
                    message="Loading"
                    height={50}
                    width={150}
                    color="#111111"
                    messageColor="blue"
                  />
                )}
                {error.noStudentError || error.backendError ? (
                  <p className="text-red-500 text-2xl font-bold">
                    {error.noStudentError || error.backendError}
                  </p>
                ) : null}
              </div>

              {searchClicked && !loading && studentsData.length > 0 ? (
                <form
                  className="flex flex-col space-y-2 p-2 mt-4"
                  onSubmit={handleAttendance}
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 border-b border-gray-300 text-left">
                            S.No
                          </th>
                          <th className="py-2 px-4 border-b border-gray-300 text-left">
                            Name
                          </th>
                          <th className="py-2 px-4 border-b border-gray-300 text-center">
                            Present
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsData && studentsData.length > 0 ? (
                          studentsData.map((student, idx) => (
                            <tr
                              key={idx}
                              className={`${idx % 2 === 0 ? "bg-gray-50" : ""} ${
                                checkedValue.includes(student._id)
                                  ? "bg-green-100"
                                  : ""
                              }`}
                            >
                              <td className="py-2 px-4 border-b border-gray-300 text-center">
                                {idx + 1}
                              </td>
                              <td className="py-2 px-4 border-b border-gray-300 text-left">
                                {student.name}
                              </td>
                              <td className="py-2 px-4 border-b border-gray-300 text-center">
                                <input
                                  type="checkbox"
                                  value={student._id}
                                  onChange={handleInputChange}
                                  checked={checkedValue.includes(student._id)}
                                  className="w-5 h-5"
                                />
                              </td>
                            </tr>
                          ))
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      className={classes.adminFormSubmitButton}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              ) : searchClicked && !loading ? (
                <div className="p-4 text-center">
                  {/* <p className="text-yellow-500">No students found for the selected criteria.</p> */}
                </div>
              ) : null}
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-yellow-500 text-lg">
                You don't have any subjects assigned. Please contact the administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
