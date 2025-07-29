import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const attendance = useSelector((state) => state.student.attendance.result);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [search, setSearch] = useState(false);
  const subjects = useSelector((state) => state.admin.subjects.result);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3 h-[calc(100vh-100px)] overflow-hidden">
      <div className="space-y-5 h-full flex flex-col">
        <div className="flex text-gray-400 items-center space-x-2">
          <MenuBookIcon />
          <h1>Attendence</h1>
        </div>

        {/* Main Scrollable Area */}
        <div className="mr-6 bg-white rounded-xl p-4 overflow-y-auto flex-1">
          <div className="col-span-3">
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
              {error.noSubjectError && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.noSubjectError}
                </p>
              )}
            </div>

            {!loading && Object.keys(error).length === 0 && subjects?.length !== 0 && (
              <>
                <div className="grid grid-cols-9 bg-gray-100 py-2 px-4 rounded-t-xl text-sm items-center"> {/* Changed to grid-cols-9 */}
                  <h1 className={`${classes.adminDataHeading} col-span-1 text-gray-700 font-semibold`}>
                    Sr no.
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1 text-gray-700 font-semibold`}>
                    Subject Code
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-2 text-gray-700 font-semibold`}>
                    Subject Name
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1 text-gray-700 font-semibold`}> {/* Reduced span for attended */}
                    Attended
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1 text-gray-700 font-semibold`}>
                    Total
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1 text-gray-700 font-semibold`}>
                    Percentage
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-2 text-gray-700 font-semibold text-center`}> {/* Added new heading for chart */}
                    Attendance Chart
                  </h1>
                </div>

                {attendance?.map((res, idx) => (
                  <div key={idx} className={`grid grid-cols-9 items-center ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-2 text-sm`}> {/* Changed to grid-cols-9 */}
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields} text-gray-800`}>
                      {idx + 1}
                    </h1>
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields} text-gray-800`}>
                      {res.subjectCode}
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataBodyFields} text-gray-800`}>
                      {res.subjectName}
                    </h1>
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields} text-gray-800`}> {/* Reduced span */}
                      {res.attended}
                    </h1>
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields} text-gray-800`}>
                      {res.total}
                    </h1>
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields} text-gray-800`}>
                      {res.percentage}
                    </h1>
                    
                    {/* Pie Chart - now inside the grid column */}
                    <div className="col-span-2 flex justify-center items-center h-24 w-full"> {/* Adjusted styling for better fit */}
                      <Pie
                        data={{
                          labels: ['Attended', 'Absent'],
                          datasets: [{
                            label: 'Attendance',
                            data: [res.attended, res.total - res.attended],
                            backgroundColor: [
                              'rgba(75, 192, 192, 0.6)',
                              'rgba(255, 99, 132, 0.6)',
                            ],
                            borderColor: [
                              'rgba(75, 192, 192, 1)',
                              'rgba(255, 99, 132, 1)',
                            ],
                            borderWidth: 1,
                          }],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom', // Position legend below the chart
                              labels: {
                                boxWidth: 10, // Make legend color boxes smaller
                              },
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed !== null) {
                                            label += context.parsed;
                                        }
                                        return label;
                                    }
                                }
                            }
                          },
                          // Make the chart smaller to leave room for the legend
                          cutout: '50%', // This makes it a donut chart, often looks better with legends
                        }}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;