import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTestResult } from "../../../redux/actions/studentActions";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  
  const store = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("user"));

  // Handle errors
  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      console.log("Errors detected:", store.errors);
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  // Fetch data only once
  useEffect(() => {
    if (!fetchAttempted) {
      console.log("Fetching test results...");
      setLoading(true);
      dispatch(
        getTestResult({
          // Only send parameters if they differ from the student's own details
          // This allows the backend to use defaults when parameters are omitted
          ...(user.result.department && { department: user.result.department }),
          ...(user.result.year && { year: user.result.year }),
          ...(user.result.section && { section: user.result.section }),
        })
      );
      setFetchAttempted(true);
    }
    
    // Cleanup function
    return () => {
      console.log("Component unmounting");
    };
  }, [dispatch, fetchAttempted, user.result.department, user.result.year, user.result.section]);

  // Process results when they arrive
  useEffect(() => {
    if (store.student && store.student.testResult) {
      console.log("Test result data received:", store.student.testResult);
      setLoading(false);
      
      if (store.student.testResult.result && 
          Array.isArray(store.student.testResult.result) && 
          store.student.testResult.result.length > 0) {
        
        console.log(`Found ${store.student.testResult.result.length} test results`);
        
        // Make a deep copy of the results
        const resultsCopy = JSON.parse(JSON.stringify(store.student.testResult.result));
        setTestResults(resultsCopy);
        
        // Extract unique test types
        const uniqueTestTypes = [...new Set(
          resultsCopy
            .filter(result => result?.exam?.test)
            .map(result => result.exam.test)
        )];
        
        console.log(`Found ${uniqueTestTypes.length} unique test types:`, uniqueTestTypes);
        setTestTypes(uniqueTestTypes);
      }
    }
  }, [store.student.testResult]);

  // Group marks by test type
  const getMarksByTestType = (testType) => {
    return testResults.filter(result => 
      result?.exam?.test === testType
    );
  };

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <h1>Test Results</h1>
        </div>
        <div className="mr-10 bg-white rounded-xl pt-6 pl-6 h-[29.5rem]">
          <div className="overflow-y-auto h-[27rem] pr-6">
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Loading test results..."
                  height={50}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.noMarksError || error.backendError) && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.noMarksError || error.backendError}
                </p>
              )}
            </div>

            {!loading &&
              !error.noMarksError &&
              !error.backendError &&
              testTypes.length === 0 && (
                <p className="text-xl text-center font-bold">
                  No test results available. Your instructor may not have uploaded any marks yet.
                </p>
              )}

            {!loading &&
              !error.noMarksError &&
              !error.backendError &&
              testTypes.length !== 0 && (
                <div className="space-y-8">
                  {testTypes.map((testType, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                      <h2 className="text-xl font-bold text-blue-600 mb-4">{testType}</h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-2 px-4 border-b">S.No</th>
                              <th className="py-2 px-4 border-b">Subject</th>
                              <th className="py-2 px-4 border-b">Subject Code</th>
                              <th className="py-2 px-4 border-b">Marks Obtained</th>
                              <th className="py-2 px-4 border-b">Total Marks</th>
                              <th className="py-2 px-4 border-b">Percentage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getMarksByTestType(testType).map((result, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                                <td className="py-2 px-4 border-b text-center">
                                  {idx + 1}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                  {result.exam.subjectName || result.exam.subjectCode}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                  {result.exam.subjectCode}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                  {result.marks}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                  {result.exam.totalMarks}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                  {((result.marks / result.exam.totalMarks) * 100).toFixed(2)}%
                                </td>
                              </tr>
                            ))}
                            {/* Add a summary row with total/average */}
                            <tr className="bg-blue-50">
                              <td colSpan="3" className="py-2 px-4 border-b font-bold text-right">
                                Total / Average:
                              </td>
                              <td className="py-2 px-4 border-b text-center font-bold">
                                {getMarksByTestType(testType).reduce((sum, result) => sum + result.marks, 0)}
                              </td>
                              <td className="py-2 px-4 border-b text-center font-bold">
                                {getMarksByTestType(testType).reduce((sum, result) => sum + result.exam.totalMarks, 0)}
                              </td>
                              <td className="py-2 px-4 border-b text-center font-bold">
                                {(
                                  (getMarksByTestType(testType).reduce((sum, result) => sum + result.marks, 0) /
                                    getMarksByTestType(testType).reduce((sum, result) => sum + result.exam.totalMarks, 0)) *
                                  100
                                ).toFixed(2)}%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}

                  {/* Overall Performance Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-blue-600 mb-4">Overall Performance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Total Marks</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {testResults.reduce((sum, result) => sum + result.marks, 0)} / {testResults.reduce((sum, result) => sum + result.exam.totalMarks, 0)}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Average Percentage</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {(
                            (testResults.reduce((sum, result) => sum + result.marks, 0) /
                              testResults.reduce((sum, result) => sum + result.exam.totalMarks, 0)) *
                            100
                          ).toFixed(2)}%
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Tests Taken</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {testTypes.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
