import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

/* ---------- helper: valid sections for each academic year ---------- */
const sectionsByYear = {
  1: [1, 2],
  2: [3, 4],
  3: [5, 6],
  4: [7, 8],
};

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const subjects = useSelector((state) => state.admin.subjects?.result);

  const [value, setValue] = useState({
    department: "",
    year: "",
    section: "",
  });

  const [search, setSearch] = useState(false);

  /* ---------- handle errors from redux ---------- */
  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  /* ---------- submit search ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getSubject(value));
  };

  /* ---------- stop loader when subjects loaded ---------- */
  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  /* ---------- clear stale errors on mount ---------- */
  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        {/* header */}
        <div className="flex text-gray-400 items-center space-x-2">
          <MenuBookIcon />
          <h1>All Subjects</h1>
        </div>

        {/* form + data */}
        <div className="mr-10 bg-white grid grid-cols-4 rounded-xl pt-6 pl-6 h-[29.5rem]">
          {/* search form */}
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
                  section: "", // reset section when year changes
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

            {/* section */}
            <label htmlFor="section">Semester</label>
            <Select
              required
              disabled={!value.year} // disabled until a year is chosen
              displayEmpty
              sx={{ height: 36, width: 224 }}
              value={value.section}
              onChange={(e) =>
                setValue({ ...value, section: e.target.value })
              }
            >
              <MenuItem value="">Select section</MenuItem>
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

          {/* results & loader */}
          <div className="col-span-3 mr-6">
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

            {search &&
              !loading &&
              Object.keys(error).length === 0 &&
              subjects?.length !== 0 && (
                <div className={classes.adminData}>
                  {/* headings */}
                  <div className="grid grid-cols-7">
                    <h1 className={`${classes.adminDataHeading} col-span-1`}>
                      Sr no.
                    </h1>
                    <h1 className={`${classes.adminDataHeading} col-span-2`}>
                      Subject Code
                    </h1>
                    <h1 className={`${classes.adminDataHeading} col-span-3`}>
                      Subject Name
                    </h1>
                    <h1 className={`${classes.adminDataHeading} col-span-1`}>
                      Total Lectures
                    </h1>
                  </div>

                  {/* data rows */}
                  {subjects?.map((sub, idx) => (
                    <div
                      key={idx}
                      className={`${classes.adminDataBody} grid-cols-7`}
                    >
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}
                      >
                        {idx + 1}
                      </h1>
                      <h1
                        className={`col-span-2 ${classes.adminDataBodyFields}`}
                      >
                        {sub.subjectCode}
                      </h1>
                      <h1
                        className={`col-span-3 ${classes.adminDataBodyFields}`}
                      >
                        {sub.subjectName}
                      </h1>
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}
                      >
                        {sub.totalLectures}
                      </h1>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
