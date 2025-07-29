import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudent, getTest, uploadMarks } from "../../../redux/actions/facultyActions";
import { getFacultySubjectsAction } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { MARKS_UPLOADED, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [marks, setMarks] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [availableTests, setAvailableTests] = useState([]);
  
  const store = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("user"));
  const semesterMap = {
  "1": ["1", "2"],
  "2": ["3", "4"],
  "3": ["5", "6"],
  "4": ["7", "8"],
};
  const [value, setValue] = useState({
    department: user.result.department,
    year: "",
    section: "",
    test: "",
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

  // Fetch available tests when department, year, and section are selected
  useEffect(() => {
    if (value.department && value.year && value.section) {
      dispatch(getTest({
        department: value.department,
        year: value.year,
        section: value.section
      }));
    }
  }, [value.department, value.year, value.section, dispatch]);

  // Update available tests when tests data is fetched
  useEffect(() => {
    if (store.faculty && store.faculty.tests && store.faculty.tests.result) {
      console.log("Available tests:", store.faculty.tests.result);
      setAvailableTests(store.faculty.tests.result);
    }
  }, [store.faculty.tests]);

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
    setMarks([]); // Clear previous marks
    console.log("Submitting search with:", value);
    dispatch(getStudent(value));
  };

  // Get students from Redux store
  const students = useSelector((state) => state.faculty.students);

  // Debug log for students
  useEffect(() => {
    console.log("Students from Redux store:", students);
  }, [students]);

  // Update marks when students data changes
  useEffect(() => {
    if (students) {
      console.log("Students data received, length:", students.length);
      
      if (Array.isArray(students) && students.length > 0) {
        console.log("Creating marks array for students");
        setLoading(false);
        const newMarks = students.map((student) => {
          return {
            _id: student._id,
            name: student.name,
            value: "",
          };
        });
        setMarks(newMarks);
      } else {
        console.log("No students found or empty array");
        setLoading(false);
      }
    }
  }, [students]);

  const handleInputChange = (e, _id) => {
    const newMarks = [...marks];
    const index = newMarks.findIndex((m) => m._id === _id);
    if (index !== -1) {
      newMarks[index].value = e.target.value;
      setMarks(newMarks);
    }
  };

  const handleMarksSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    const selectedTest = availableTests.find(t => t.test === value.test);
    console.log("selectedTest:", selectedTest);
    console.log("value.test:", value.test);
    if (!selectedTest) {
      console.error("Selected test not found");
      return;
    }
    dispatch(
      uploadMarks(
        marks,
        value.department,
        value.section,
        value.year,
        value.test,
        selectedTest.date,
        selectedTest.subjectCode,
      )
    );
  };

  useEffect(() => {
    if (store.faculty.marksUploaded) {
      setLoading(false);
      setValue({
        department: user.result.department,
        year: "",
        section: "",
        test: "",
      });
      setMarks([]);
      setSearchClicked(false);
      dispatch({ type: MARKS_UPLOADED, payload: false });
    }
  }, [store.faculty.marksUploaded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <h1>Upload Marks</h1>
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
    setValue({ ...value, year: e.target.value, section: "", test: "" })
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
                    <h1 className="text-[#515966] font-bold">Semester</h1>
                    <Select
  required
  displayEmpty
  sx={{ height: 36, width: "100%" }}
  value={value.section}
  onChange={(e) =>
    setValue({ ...value, section: e.target.value, test: "" })
  }
  disabled={!value.year}             // disabled until Year chosen
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
                    <h1 className="text-[#515966] font-bold">Test</h1>
                    <Select
                      required
                      displayEmpty
                      sx={{ height: 36, width: '100%' }}
                      inputProps={{ "aria-label": "Without label" }}
                      value={value.test}
                      onChange={(e) =>
                        setValue({ ...value, test: e.target.value })
                      }
                      disabled={!value.year || !value.section || availableTests.length === 0}
                    >
                      <MenuItem value="">None</MenuItem>
                      {availableTests.map((test, idx) => (
                        <MenuItem key={idx} value={test.test}>
                          {test.test} ({test.subjectCode})
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
                {value.year && value.section && availableTests.length === 0 && (
                  <div className="text-center text-yellow-500">
                    No tests created for this department/year/section. Please create a test first.
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    className={classes.adminFormSubmitButton}
                    type="submit"
                    disabled={!value.test}
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
                {(error.noStudentError || error.backendError) && (
                  <p className="text-red-500 text-2xl font-bold">
                    {error.noStudentError || error.backendError}
                  </p>
                )}
              </div>

              {searchClicked && !loading && !error.noStudentError && !error.backendError && (
                <>
                  {marks.length > 0 ? (
                    <form
                      className="flex flex-col space-y-2 p-2 mt-4"
                      onSubmit={handleMarksSubmit}
                    >
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b">S.No</th>
                              <th className="py-2 px-4 border-b">Name</th>
                              <th className="py-2 px-4 border-b">Marks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {marks.map((mark, idx) => (
                              <tr key={idx}>
                                <td className="py-2 px-4 border-b text-center">
                                  {idx + 1}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                  {mark.name}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                  <input
                                    required
                                    type="number"
                                    min="0"
                                    className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500"
                                    value={mark.value}
                                    onChange={(e) => handleInputChange(e, mark._id)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-center">
                        <button
                          className={classes.adminFormSubmitButton}
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-yellow-500">No students found for the selected criteria.</p>
                    </div>
                  )}
                </>
              )}
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
