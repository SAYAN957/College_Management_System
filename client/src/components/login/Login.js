import React from "react";
import { Link } from "react-router-dom";
import Quotes from './Quotes';

const Login = () => {
  return (
    <div
      className="h-screen w-screen backdrop-blur-md flex  justify-center"
      style={{
        backgroundImage: `url("https://www.nitmas.edu.in/assets/upload/840075_WEB4F0A9036.JPG")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}>
      <div className="flex flex-col items-center mt-10 space-y-10">
        <h1 className="text-3xl font-semibold bg-black text-white w-full text-center py-4 bg-opacity-75 rounded-2xl">
          Neotia Institute of Technology Management and Science
        </h1>
        <div className="flex space-x-4">
          <Link
            to="/login/adminlogin"
            className="flex items-center justify-center bg-blue-500 h-10 w-32 text-lg rounded-lg text-white hover:scale-110 transition-all duration-200">
            Admin
          </Link>
          <Link
            to="/login/facultylogin"
            className="flex items-center justify-center bg-blue-500 h-10 w-32 text-lg rounded-lg text-white hover:scale-110 transition-all duration-200">
            Faculty
          </Link>
          <Link
            to="/login/studentlogin"
            className="flex items-center justify-center bg-blue-500 h-10 w-32 text-lg rounded-lg text-white hover:scale-110 transition-all duration-200">
            Student
          </Link>
        </div>
        <Quotes />
      </div>
    </div>
  );
};

export default Login;
