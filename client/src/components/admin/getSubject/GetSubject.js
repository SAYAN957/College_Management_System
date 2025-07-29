import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllDepartment, getAllSubject } from "../../../redux/actions/adminActions";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";

const GetSubject = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDepartment());
    dispatch(getAllSubject()); // Add this if you need all subjects initially
  }, [dispatch]);
  return (
    <div className="bg-[#d6d9e0] h-screen flex items-center justify-center">
      <div className="flex flex-col bg-[#f4f6fa] w-[95%] max-h-[95vh] rounded-xl shadow-2xl space-y-4 overflow-hidden">
        <Header />
        <div className="flex flex-[0.95]">
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default GetSubject;
