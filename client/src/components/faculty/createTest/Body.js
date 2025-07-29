import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { createTest } from "../../../redux/actions/facultyActions";
import { getFacultySubjectsAction } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { ADD_TEST, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("user"));
  const semesterMap = {
  "1": ["1", "2"],
  "2": ["3", "4"],
  "3": ["5", "6"],
  "4": ["7", "8"],
};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [value, setValue] = useState({
    subjectCode: "",
    section: "",
    year: "",
    test: "",
    totalMarks: "",
    date: "",
    department: user.result.department,
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
      setValue({
        subjectCode: "",
        section: "",
        year: "",
        test: "",
        totalMarks: "",
        date: "",
        department: user.result.department,
      });
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(createTest(value));
  };

  useEffect(() => {
    if (store.errors || store.faculty.testAdded) {
      setLoading(false);
      if (store.faculty.testAdded) {
        setValue({
          subjectCode: "",
          section: "",
          year: "",
          test: "",
          totalMarks: "",
          date: "",
          department: user.result.department,
        });

        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_TEST, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.faculty.testAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  // Define standard test types matching backend enum
  const standardTestTypes = [
    { value: "Midterm1", label: "Midterm 1" },
    { value: "Midterm2", label: "Midterm 2" },
    { value: "End Sem", label: "End Semester" },
    { value: "Assignment", label: "Assignment" }
  ];

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <AddIcon />
          <h1>Create Test</h1>
        </div>
        <div className=" mr-10 bg-white flex flex-col rounded-xl ">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Test Type:</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36, width: 224 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.test}
                    onChange={(e) =>
                      setValue({ ...value, test: e.target.value })
                    }
                  >
                    <MenuItem value="">Select Test Type</MenuItem>
                    {standardTestTypes.map((type, idx) => (
                      <MenuItem key={idx} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Subject Code:</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36, width: 224 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.subjectCode}
                    onChange={(e) =>
                      setValue({ ...value, subjectCode: e.target.value })
                    }
                  >
                    <MenuItem value="">Select Subject</MenuItem>
                    {assignedSubjects.map((subject, idx) => (
                      <MenuItem key={idx} value={subject.subject?.subjectCode}>
                        {subject.subject?.subjectName} ({subject.subject?.subjectCode})
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department:</h1>
                  <input
                    required
                    placeholder={user.result.department}
                    disabled
                    className={classes.adminInput}
                    type="text"
                    value={user.result.department}
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Year:</h1>
                  <Select
  required
  displayEmpty
  sx={{ height: 36 }}
  value={value.year}
  onChange={(e) =>
    setValue({ ...value, year: e.target.value, section: "" })  // ← reset
}
>
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                  </Select>
                </div>
              </div>
              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Total Marks:</h1>
                  <input
                    required
                    placeholder="Total Marks"
                    className={classes.adminInput}
                    type="number"
                    value={value.totalMarks}
                    onChange={(e) =>
                      setValue({ ...value, totalMarks: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Date:</h1>
                  <input
                    required
                    className={classes.adminInput}
                    type="date"
                    value={value.date}
                    onChange={(e) =>
                      setValue({ ...value, date: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Semester:</h1>
                  <Select
  required
  displayEmpty
  sx={{ height: 36 }}
  value={value.section}
  onChange={(e) =>
    setValue({ ...value, section: e.target.value })
  }
  disabled={!value.year}   // prevent selection until a year is chosen
>
  <MenuItem value="">None</MenuItem>

  {(semesterMap[value.year] || []).map((sem) => (
    <MenuItem key={sem} value={sem}>
      {sem}
    </MenuItem>
  ))}
</Select>

                </div>
              </div>
            </div>
            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Submit
              </button>
              <button
                onClick={() => {
                  setValue({
                    subjectCode: "",
                    section: "",
                    year: "",
                    test: "",
                    totalMarks: "",
                    date: "",
                    department: user.result.department,
                  });
                  setError({});
                }}
                className={classes.adminFormClearButton}
                type="button">
                Clear
              </button>
            </div>
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Creating Test"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.testError || error.backendError) && (
                <p className="text-red-500">
                  {error.testError || error.backendError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
