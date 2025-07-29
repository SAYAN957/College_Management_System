import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectList } from "../../../redux/actions/studentActions";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);

  const subjects = useSelector((state) => state.student.subjects);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: SET_ERRORS, payload: {} });
      setLoading(true);
      try {
        await dispatch(getSubjectList());
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="flex-[0.8] mt-6 px-8">
      <div className="space-y-6">
        <div className="flex text-indigo-700 items-center space-x-3 text-2xl font-semibold">
          <MenuBookIcon className="text-3xl" />
          <h1>All Subjects</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 h-[calc(100vh-200px)] overflow-y-auto">
          <div className="col-span-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner
                  message="Loading subjects..."
                  height={50}
                  width={150}
                  color="#4F46E5"
                  messageColor="#4F46E5"
                />
              </div>
            ) : error.noSubjectsError ? (
              <p className="text-red-600 text-2xl font-extrabold text-center py-10">
                {error.noSubjectsError}
              </p>
            ) : subjects && subjects?.length > 0 ? (
              <div key={subjects.length} className="overflow-x-auto rounded-lg border border-gray-200">
                <div className="grid grid-cols-7 bg-indigo-50 py-3 px-6 text-sm font-bold text-gray-700 gap-x-4">
                  <h1 className={`col-span-1 ${classes.adminDataHeading} text-indigo-800`}>
                    Sr no.
                  </h1>
                  <h1 className={`col-span-2 ${classes.adminDataHeading} text-indigo-800`}>
                    Subject Code
                  </h1>
                  <h1 className={`col-span-3 ${classes.adminDataHeading} text-indigo-800`}>
                    Subject Name
                  </h1>
                  <h1 className={`col-span-1 ${classes.adminDataHeading} text-indigo-800`}>
                    Total Lectures
                  </h1>
                </div>
                {subjects?.map((sub, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-7 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100 px-6 py-4 text-sm text-gray-800 gap-x-4 hover:bg-indigo-100 transition duration-150 ease-in-out`}>
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>
                      {idx + 1}
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataBodyFields} font-medium`}>
                      {sub.subjectCode}
                    </h1>
                    <h1 className={`col-span-3 ${classes.adminDataBodyFields}`}>
                      {sub.subjectName}
                    </h1>
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>
                      {sub.totalLectures}
                    </h1>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-xl text-center py-10">
                No subjects available for your department and year
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
