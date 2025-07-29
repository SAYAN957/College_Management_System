import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { addSubject } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { ADD_SUBJECT, SET_ERRORS } from "../../../redux/actionTypes";
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
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [value, setValue] = useState({
    subjectName: "",
    subjectCode: "",
    year: "",          // stays "" until user picks a year
    totalLectures: "",
    department: "",
    section: "",
  });

  /* ---------- handle server‑side errors ---------- */
  useEffect(() => {
    if (Object.keys(store.errors).length) {
      setError(store.errors);
      setValue({
        subjectName: "",
        subjectCode: "",
        year: "",
        totalLectures: "",
        department: "",
        section: "",
      });
    }
  }, [store.errors]);

  /* ---------- submit form ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addSubject(value));
  };

  /* ---------- reset UI flags after add‑subject completes ---------- */
  useEffect(() => {
    if (store.errors || store.admin.subjectAdded) {
      setLoading(false);

      if (store.admin.subjectAdded) {
        setValue({
          subjectName: "",
          subjectCode: "",
          year: "",
          totalLectures: "",
          department: "",
          section: "",
        });
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_SUBJECT, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.subjectAdded, dispatch]);

  /* ---------- clear stale errors on mount ---------- */
  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        {/* header */}
        <div className="flex text-gray-400 items-center space-x-2">
          <AddIcon />
          <h1>Add Subject</h1>
        </div>

        {/* form card */}
        <div className="mr-10 bg-white flex flex-col rounded-xl">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              {/* left column */}
              <div className={classes.adminForm2l}>
                {/* subject name */}
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Subject Name :</h1>
                  <input
                    placeholder="Subject Name"
                    required
                    className={classes.adminInput}
                    type="text"
                    value={value.subjectName}
                    onChange={(e) =>
                      setValue({ ...value, subjectName: e.target.value })
                    }
                  />
                </div>

                {/* subject code */}
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Subject Code :</h1>
                  <input
                    required
                    placeholder="Subject Code"
                    className={classes.adminInput}
                    type="text"
                    value={value.subjectCode}
                    onChange={(e) =>
                      setValue({ ...value, subjectCode: e.target.value })
                    }
                  />
                </div>

                {/* academic year */}
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Year :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "academic year" }}
                    value={value.year}
                    onChange={(e) =>
                      setValue({
                        ...value,
                        year: Number(e.target.value),
                        section: "", // wipe section when year changes
                      })
                    }
                  >
                    <MenuItem value={""}>Select year</MenuItem>
                    {[1, 2, 3, 4].map((yr) => (
                      <MenuItem key={yr} value={yr}>
                        {yr}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>

              {/* right column */}
              <div className={classes.adminForm2r}>
                {/* total lectures */}
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Total Lectures :</h1>
                  <input
                    required
                    placeholder="Total Lectures"
                    className={classes.adminInput}
                    type="number"
                    value={value.totalLectures}
                    onChange={(e) =>
                      setValue({ ...value, totalLectures: e.target.value })
                    }
                  />
                </div>

                {/* department */}
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "department" }}
                    value={value.department}
                    onChange={(e) =>
                      setValue({ ...value, department: e.target.value })
                    }
                  >
                    <MenuItem value={""}>Select department</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                {/* section */}
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Semester :</h1>
                  <Select
                    required
                    disabled={!value.year} // blocked until a year is picked
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "section" }}
                    value={value.section}
                    onChange={(e) =>
                      setValue({ ...value, section: e.target.value })
                    }
                  >
                    <MenuItem value={""}>Select semester</MenuItem>
                    {sectionsByYear[value.year]?.map((sec) => (
                      <MenuItem key={sec} value={sec}>
                        {sec}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* buttons */}
            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Submit
              </button>
              <button
                className={classes.adminFormClearButton}
                type="button"
                onClick={() => {
                  setValue({
                    subjectName: "",
                    subjectCode: "",
                    year: "",
                    totalLectures: "",
                    department: "",
                    section: "",
                  });
                  setError({});
                }}
              >
                Clear
              </button>
            </div>

            {/* loader + error */}
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Adding Subject"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.subjectError || error.backendError) && (
                <p className="text-red-500">
                  {error.subjectError || error.backendError}
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
