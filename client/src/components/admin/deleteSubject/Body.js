import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { getSubject, deleteSubject } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { DELETE_SUBJECT, SET_ERRORS } from "../../../redux/actionTypes";

/* ---------- helper: valid sections for each academic year ---------- */
const sectionsByYear = {
  1: [1, 2],
  2: [3, 4],
  3: [5, 6],
  4: [7, 8],
};

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [checkedValue, setCheckedValue] = useState([]);

  const [value, setValue] = useState({
    department: "",
    year: "",
    section: "",
  });
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleInputChange = (e) => {
    const tempCheck = [...checkedValue];
    if (e.target.checked) {
      tempCheck.push(e.target.value);
    } else {
      const idx = tempCheck.indexOf(e.target.value);
      tempCheck.splice(idx, 1);
    }
    setCheckedValue(tempCheck);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getSubject({ ...value }));
  };
  const subjects = useSelector((state) => state.admin.subjects.result);

  const dltSubject = () => {
    setError({});
    setLoading(true);
    dispatch(deleteSubject({ subjects: checkedValue, section: value.section }));
  };

  useEffect(() => {
    if (store.admin.subjectDeleted) {
      setValue({ department: "", year: "", section: "" });
      setCheckedValue([]);
      setSearch(false);
      setLoading(false);
      dispatch({ type: DELETE_SUBJECT, payload: false });
    }
  }, [store.admin.subjectDeleted, dispatch]);

  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <DeleteIcon />
          <h1>Delete Subject</h1>
        </div>
        <div className="mr-10 bg-white grid grid-cols-4 rounded-xl pt-6 pl-6 h-[29.5rem]">
          {/* ---------- search form ---------- */}
          <form
            className="flex flex-col space-y-2 col-span-1"
            onSubmit={handleSubmit}
          >
            {/* department */}
            <label htmlFor="department">Department</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              value={value.department}
              onChange={(e) =>
                setValue({ ...value, department: e.target.value })
              }
            >
              <MenuItem value="">Select department</MenuItem>
              {departments?.map((dp, idx) => (
                <MenuItem key={idx} value={dp.department}>
                  {dp.department}
                </MenuItem>
              ))}
            </Select>

            {/* year */}
            <label htmlFor="year">Year</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              value={value.year}
              onChange={(e) =>
                setValue({
                  ...value,
                  year: Number(e.target.value),
                  section: "", // clear section when year changes
                })
              }
            >
              <MenuItem value="">Select year</MenuItem>
              {[1, 2, 3, 4].map((yr) => (
                <MenuItem key={yr} value={yr}>
                  {yr}
                </MenuItem>
              ))}
            </Select>

            {/* section – restricted by year */}
            <label htmlFor="section">Semester</label>
            <Select
              required
              disabled={!value.year}
              displayEmpty
              sx={{ height: 36, width: 224 }}
              value={value.section}
              onChange={(e) => setValue({ ...value, section: e.target.value })}
            >
              <MenuItem value="">Select semester</MenuItem>
              {sectionsByYear[value.year]?.map((sec) => (
                <MenuItem key={sec} value={sec}>
                  {sec}
                </MenuItem>
              ))}
            </Select>

            <button
              className={`${classes.adminFormSubmitButton} w-56`}
              type="submit"
            >
              Search
            </button>
          </form>

          {/* ---------- results + actions ---------- */}
          <div className="col-span-3 mr-6">
            {/* loader / errors */}
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
              {(error.noSubjectError || error.backendError) && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.noSubjectError || error.backendError}
                </p>
              )}
            </div>

            {/* table */}
            {search &&
              !loading &&
              Object.keys(error).length === 0 &&
              subjects?.length !== 0 && (
                <div className={`${classes.adminData} h-[20rem]`}>
                  <div className="grid grid-cols-8">
                    <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                      Select
                    </h1>
                    <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                      Sr no.
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                      Subject Code
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                      Subject Name
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                      Total Lectures
                    </h1>
                  </div>
                  {subjects.map((adm, idx) => (
                    <div
                      key={adm._id}
                      className={`${classes.adminDataBody} grid-cols-8`}
                    >
                      <input
                        type="checkbox"
                        className="col-span-1 border-2 w-16 h-4 mt-3 px-2"
                        value={adm._id}
                        onChange={handleInputChange}
                      />
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}
                      >
                        {idx + 1}
                      </h1>
                      <h1
                        className={`col-span-2 ${classes.adminDataBodyFields}`}
                      >
                        {adm.subjectCode}
                      </h1>
                      <h1
                        className={`col-span-2 ${classes.adminDataBodyFields}`}
                      >
                        {adm.subjectName}
                      </h1>
                      <h1
                        className={`col-span-2 ${classes.adminDataBodyFields}`}
                      >
                        {adm.totalLectures}
                      </h1>
                    </div>
                  ))}
                </div>
              )}

            {/* delete button */}
            {search && Object.keys(error).length === 0 && (
              <div className="flex items-center justify-center mt-5 space-x-3">
                <button
                  onClick={dltSubject}
                  className={`${classes.adminFormSubmitButton} bg-blue-500`}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
