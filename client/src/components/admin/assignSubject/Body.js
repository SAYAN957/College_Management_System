import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFaculty,
  getAllSubject,
  assignSubjectToFaculty,
  removeSubjectFromFaculty,
  getFacultySubjectsAction,
  getSubjectFacultyAction,
} from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { ASSIGN_SUBJECT, REMOVE_SUBJECT, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const store = useSelector((state) => state);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [viewMode, setViewMode] = useState("assign"); // "assign" or "view"

  useEffect(() => {
    dispatch(getAllFaculty());
    dispatch(getAllSubject());
  }, [dispatch]);

  const faculties = useSelector((state) => state.admin.allFaculty);
  const subjects = useSelector((state) => state.admin.allSubject);
  const facultySubjects = useSelector((state) => state.admin.facultySubjects);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    if (store.admin.subjectAssigned || store.admin.subjectRemoved) {
      setLoading(false);
      setSelectedFaculty("");
      setSelectedSubject("");
      dispatch({ type: ASSIGN_SUBJECT, payload: false });
      dispatch({ type: REMOVE_SUBJECT, payload: false });
      dispatch({ type: SET_ERRORS, payload: {} });
    }
  }, [store.admin.subjectAssigned, store.admin.subjectRemoved]);

  const handleFacultyChange = (e) => {
    setSelectedFaculty(e.target.value);
    if (e.target.value) {
      // Always fetch subjects when a faculty is selected
      console.log("Fetching subjects for faculty:", e.target.value);
      dispatch(getFacultySubjectsAction({ facultyId: e.target.value }));
    }
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    
    const faculty = faculties.find(f => f._id === selectedFaculty);
    
    dispatch(
      assignSubjectToFaculty({
        facultyId: selectedFaculty,
        subjectId: selectedSubject,
        department: faculty.department,
      })
    );
  };

  useEffect(() => {
    if (store.errors?.message === "Faculty and subject must belong to the same department") {
      setError({ backendError: store.errors.message });
      setLoading(false);
      dispatch({ type: SET_ERRORS, payload: {} });
    }
  }, [store.errors]);

  const handleRemoveSubject = (subjectId) => {
    setError({});
    setLoading(true);
    
    dispatch(
      removeSubjectFromFaculty({
        facultyId: selectedFaculty,
        subjectId,
      })
    );
    
    // Refresh the list after removal
    setTimeout(() => {
      dispatch(getFacultySubjectsAction({ facultyId: selectedFaculty }));
    }, 1000);
  };

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <h1>{viewMode === "assign" ? "Assign Subject to Faculty" : "View Faculty Subjects"}</h1>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${viewMode === "assign" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setViewMode("assign")}
          >
            Assign Subjects
          </button>
          <button
            className={`px-4 py-2 rounded-md ${viewMode === "view" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setViewMode("view")}
          >
            View Assignments
          </button>
        </div>
        
        <div className="bg-white flex flex-col rounded-xl p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-[#515966] font-bold">Select Faculty</h1>
              <Select
                displayEmpty
                sx={{ height: 36, width: 224 }}
                inputProps={{ "aria-label": "Without label" }}
                value={selectedFaculty}
                onChange={handleFacultyChange}
              >
                <MenuItem value="">None</MenuItem>
                {faculties?.map((faculty) => (
                  <MenuItem key={faculty._id} value={faculty._id}>
                    {faculty.name} ({faculty.department})
                  </MenuItem>
                ))}
              </Select>
            </div>
            
            {viewMode === "assign" && (
              <div className="flex flex-col space-y-2">
                <h1 className="text-[#515966] font-bold">Select Subject</h1>
                <Select
                  displayEmpty
                  sx={{ height: 36, width: 224 }}
                  inputProps={{ "aria-label": "Without label" }}
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {subjects?.map((subject) => (
                    <MenuItem key={subject._id} value={subject._id}>
                      {subject.subjectName} ({subject.subjectCode})
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}
          </div>
          
          {viewMode === "assign" && (
            <div className="flex justify-center">
              <button
                className={classes.adminFormSubmitButton}
                onClick={handleAssignSubmit}
                disabled={!selectedFaculty || !selectedSubject}
              >
                Assign
              </button>
            </div>
          )}
          
          {viewMode === "view" && selectedFaculty && (
            <div className="mt-4">
             <h2 className="text-lg font-semibold mb-2">Assigned Subjects</h2>
                {console.log("Faculty subjects in component:", facultySubjects)}
                  {facultySubjects && facultySubjects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse bg-white">
  <thead>
    <tr>
      <th className="text-left py-2 px-4 border-b w-1/4">Subject Name</th>
      <th className="text-left py-2 px-4 border-b w-1/4">Subject Code</th>
      <th className="text-left py-2 px-4 border-b w-1/4">Department</th>
      <th className="text-left py-2 px-4 border-b w-1/4">Actions</th>
    </tr>
  </thead>
  <tbody>
    {facultySubjects.map((item) => (
      <tr key={item._id}>
        <td className="text-left py-2 px-4 border-b w-1/4">
          {item.subject?.subjectName || "N/A"}
        </td>
        <td className="text-left py-2 px-4 border-b w-1/4">
          {item.subject?.subjectCode || "N/A"}
        </td>
        <td className="text-left py-2 px-4 border-b w-1/4">
          {item.department || "N/A"}
        </td>
        <td className="text-left py-2 px-4 border-b w-1/4">
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => handleRemoveSubject(item.subject?._id)}
          >
            Remove
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
      ) : (
      <p>No subjects assigned to this faculty.</p>
    )}
  </div>
)}
          
          <div className={classes.loadingAndError}>
            {loading && (
              <Spinner
                message="Processing"
                height={30}
                width={150}
                color="#111111"
                messageColor="blue"
              />
            )}
            {(error.assignError || error.removeError || error.backendError) && (
              <p className="text-red-500">
                {error.assignError || error.removeError || error.backendError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
