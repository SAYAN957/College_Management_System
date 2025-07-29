import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Body from "./Body";
import Header from "../Header";
import Sidebar from "../Sidebar";

const AssignSubject = () => {
  const navigate = useNavigate();
  const { isAuthenticated, admin } = useSelector((state) => state.admin);

  if (!isAuthenticated) {
    navigate("/admin/login");
  }

  return (
    <div className="bg-[#d6d9e0] h-screen flex items-center justify-center">
      <div className="flex flex-col h-screen w-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <Body />
        </div>
      </div>
    </div>
  );
};

export default AssignSubject;