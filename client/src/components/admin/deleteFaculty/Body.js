import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { deleteFaculty, getFaculty } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { DELETE_FACULTY, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.admin.allDepartment);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [checkedValue, setCheckedValue] = useState([]);

  const [value, setValue] = useState({
    department: "",
  });
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleInputChange = (e) => {
    const tempCheck = [...checkedValue]; // Create a copy to avoid direct state mutation
    let index;
    if (e.target.checked) {
      tempCheck.push(e.target.value);
    } else {
      index = tempCheck.indexOf(e.target.value);
      if (index > -1) { // Only splice if element is found
        tempCheck.splice(index, 1);
      }
    }
    setCheckedValue(tempCheck);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getFaculty(value));
  };
  const faculties = useSelector((state) => state.admin.faculties.result);

  const dltFaculty = (e) => {
    setError({});
    setLoading(true);
    dispatch(deleteFaculty(checkedValue));
    setCheckedValue([]); // Clear checked values after deletion
  };

  useEffect(() => {
    if (store.admin.facultyDeleted) {
      setLoading(false);
      setValue({ department: "" });
      dispatch({ type: DELETE_FACULTY, payload: false });
      setSearch(false);
    }
  }, [store.admin.facultyDeleted]);

  useEffect(() => {
    if (faculties?.length !== 0) setLoading(false);
  }, [faculties]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <DeleteIcon />
          <h1>Delete Faculty</h1>
        </div>
        <div className=" mr-10 bg-white grid grid-cols-4 rounded-xl pt-6 pl-6 h-[29.5rem]">
          <form
            className="flex flex-col space-y-2 col-span-1"
            onSubmit={handleSubmit}>
            <label htmlFor="department">Department</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.department}
              onChange={(e) =>
                setValue({ ...value, department: e.target.value })
              }>
              <MenuItem value="">None</MenuItem>
              {departments?.map((dp, idx) => (
                <MenuItem key={idx} value={dp.department}>
                  {dp.department}
                </MenuItem>
              ))}
            </Select>

            <button
              className={`${classes.adminFormSubmitButton} w-56`}
              type="submit">
              Search
            </button>
          </form>
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
              {(error.noFacultyError || error.backendError) && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.noFacultyError || error.backendError}
                </p>
              )}
            </div>
            {search &&
              !loading &&
              Object.keys(error).length === 0 &&
              faculties?.length !== 0 && (
                <div className={`${classes.adminData} h-[20rem]`}>
                  {/* Changed to grid-cols-10 for better alignment */}
                  <div className="grid grid-cols-10">
                    <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                      Select
                    </h1>
                    <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                      Sr no.
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                      Name
                    </h1>
                    <h1 className={`col-span-3 ${classes.adminDataHeading}`}> {/* Increased for Username */}
                      Username
                    </h1>
                    <h1 className={`col-span-3 ${classes.adminDataHeading}`}> {/* Increased for Email */}
                      Email
                    </h1>
                  </div>
                  {faculties?.map((adm, idx) => (
                    <div
                      key={idx}
                      className={`${classes.adminDataBody} grid-cols-10`}> {/* Also changed to grid-cols-10 here */}
                      <input
                        onChange={handleInputChange}
                        value={adm._id}
                        className="col-span-1 border-2 w-16 h-4 mt-3 px-2"
                        type="checkbox"
                      />
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}>
                        {idx + 1}
                      </h1>
                      <h1
                        className={`col-span-2 ${classes.adminDataBodyFields}`}>
                        {adm.name}
                      </h1>
                      <h1
                        className={`col-span-2 ${classes.adminDataBodyFields}`}> 
                        {adm.username}
                      </h1>
                      <h1
                        className={`col-span-3 ${classes.adminDataBodyFields}`}> 
                        {adm.email}
                      </h1>
                    </div>
                  ))}
                </div>
              )}
            {search && Object.keys(error).length === 0 && (
              <div className="space-x-3 flex items-center justify-center mt-5">
                <button
                  onClick={dltFaculty}
                  className={`${classes.adminFormSubmitButton} bg-blue-500`}>
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