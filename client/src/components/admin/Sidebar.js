import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddIcon from "@mui/icons-material/Add";
import BoyIcon from "@mui/icons-material/Boy";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
import { setRef } from "@mui/material";
const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";
const isActiveStyle =
  "flex items-center px-5 gap-3 text-blue-600 transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    alert("OOPS! Your session expired. Please Login again");
    dispatch({ type: "LOGOUT" });
    navigate("/login/adminLogin");
  };
  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("admin")));
  }, [navigate]);
  // useEffect(() => {
  //   if (rf === "home") {
  //     elRef[0].current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end",
  //       inline": "nearest",
  //     });
  //   }
  // }, []);
  return (
    <div className="flex-[0.2]">
      <div className="space-y-8 overflow-y-scroll scrollbar-thin scrollbar-track-white scrollbar-thumb-gray-300 h-[33rem]">
        <div className="">
          <NavLink
            to="/admin/home"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <HomeIcon className="" />
            <h1 className="font-normal">Dashboard</h1>
          </NavLink>
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AssignmentIndIcon className="" />
            <h1 className="font-normal">Profile</h1>
          </NavLink>
        </div>
        <div className="">
          <NavLink
            to="/admin/createNotice"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-normal">Create Notice</h1>
          </NavLink>
        </div>
        <div className="">
          {/* <NavLink
            to="/admin/addadmin"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-normal">Add Admin</h1>
          </NavLink>
          <NavLink
            to="/admin/deleteadmin"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-normal">Delete Admin</h1>
          </NavLink> */}
        </div>
        <div className="">
          <NavLink
            to="/admin/adddepartment"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-normal">Add Department</h1>
          </NavLink>
          <NavLink
            to="/admin/deletedepartment"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-normal">Delete Department</h1>
          </NavLink>
        </div>
        <div className="">
          <NavLink
            to="/admin/allfaculty"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <EngineeringIcon className="" />
            <h1 className="font-normal">Our Faculty</h1>
          </NavLink>

          <NavLink
            to="/admin/addfaculty"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-normal">Add Faculty</h1>
          </NavLink>
          <NavLink
            to="/admin/deletefaculty"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-normal">Delete Faculty</h1>
          </NavLink>
        </div>
        <div className="">
          <NavLink
            to="/admin/allstudent"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <BoyIcon className="" />
            <h1 className="font-normal">Our Students</h1>
          </NavLink>

          <NavLink
            to="/admin/addstudent"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-normal">Add Students</h1>
          </NavLink>
          <NavLink
            to="/admin/deletestudent"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-normal">Delete Student</h1>
          </NavLink>
        </div>
        <div className="">
          <NavLink
            to="/admin/allsubject"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <MenuBookIcon className="" />
            <h1 className="font-normal">Subjects</h1>
          </NavLink>

          <NavLink
            to="/admin/addsubject"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AddIcon className="" />
            <h1 className="font-normal">Add Subject</h1>
          </NavLink>
          <NavLink
            to="/admin/deletesubject"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <DeleteIcon className="" />
            <h1 className="font-normal">Delete Subject</h1>
          </NavLink>
          <NavLink
            to="/admin/assignSubject"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
              <AddIcon className="" />
              <h1 className="font-normal">Assign Subject</h1>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
