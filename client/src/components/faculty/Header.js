import React from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login/facultylogin");
  };
  return (
    <div className="flex-[0.05] flex justify-between items-center mx-5 my-2">
      <div className="flex items-center ">
        <img
          src="https://icon-library.com/images/cms-icon/cms-icon-11.jpg"
          alt=""
          className="h-7"
        />
        <h1 className="font-bold text-blue-600 text-sm">CMS</h1>
        <a href="https://drive.google.com/file/d/1kTQraZQ4j5kNORypc5WUDg4-5oM5E8Pv/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" className="font-bold ml-2 text-gray-600 hover:text-blue-600 text-sm">Guide</a>
      </div>
      <h1 className="font-semibold text-black">Welcome Faculty</h1>
      <div className="flex items-center space-x-3">
        <Avatar
          src={user.result.avatar}
          alt={user.result.name.charAt(0)}
          sx={{ width: 24, height: 24 }}
          className="border-blue-600 border-2"
        />
        <h1>{user.result.name.split(" ")[0]}</h1>
        <LogoutIcon
          onClick={logout}
          className="cursor-pointer hover:scale-125 transition-all "
        />
      </div>
    </div>
  );
};

export default Header;
