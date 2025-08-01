import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../../../utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { facultyUpdatePassword } from "../../../../../redux/actions/facultyActions";
// password must be strong
const validatePassword = (pwd) => {
  const problems = [];
  if (pwd.length < 8) problems.push("at least 8 characters");
  if (!/[A-Z]/.test(pwd)) problems.push("one uppercase letter");
  if (!/[0-9]/.test(pwd)) problems.push("one number");
  if (!/[!@#$%^&*()_+\-=[\]{}|;':\",./<>?]/.test(pwd))
    problems.push("one special character");
  return problems;          // empty array ⇒ OK
};

const Body = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

 const update = (e) => {
  e.preventDefault();

  // 1️⃣ strong‑password rules
  const issues = validatePassword(newPassword);
  if (issues.length) {
    setError({ mismatchError: `Password must contain ${issues.join(", ")}.` });
    return;
  }

  // 2️⃣ confirm‑match rule
  if (newPassword !== confirmPassword) {
    setError({ mismatchError: "Passwords do not match." });
    return;
  }

  // 3️⃣ all good → dispatch
  setLoading(true);
  dispatch(
    facultyUpdatePassword(
      {
        newPassword,
        confirmPassword,
        email: user.result.email,
      },
      navigate
    )
  );
};


  useEffect(() => {
    if (store.errors) {
      setLoading(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [store.errors]);

  return (
    <div className="flex flex-col items-center w-full space-y-10 mt-24">
      <form onSubmit={update} className="flex flex-col space-y-6 items-center">
        <h1 className="text-black text-3xl font-bold">Update Password</h1>
        <div className="space-y-1">
          <p className="text-[#515966] font-bold text-sm">New Password</p>
          <div className="bg-[#515966] rounded-lg px-3 flex items-center space-x-3 w-full">
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
              type={showPassword ? "text" : "password"}
              className=" bg-[#515966] text-white rounded-lg outline-none py-2  placeholder:text-sm"
              placeholder="New Password"
            />
            {showPassword ? (
              <VisibilityOffIcon
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
            ) : (
              <VisibilityIcon
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[#515966] font-bold text-sm">Confirm Password</p>
          <div className="bg-[#515966] rounded-lg px-3 flex items-center space-x-3 w-full">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              type={showPassword ? "text" : "password"}
              className=" bg-[#515966] text-white rounded-lg outline-none py-2  placeholder:text-sm"
              placeholder="Confirm Password"
            />
            {showPassword ? (
              <VisibilityOffIcon
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
            ) : (
              <VisibilityIcon
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-32 hover:scale-105 transition-all duration-150 rounded-lg flex items-center justify-center text-white text-base py-1 bg-[#04bd7d]">
          Update
        </button>
        {loading && (
          <Spinner
            message="Updating"
            height={30}
            width={150}
            color="#111111"
            messageColor="#blue"
          />
        )}
        {(error.mismatchError || error.backendError) && (
          <p className="text-red-500">
            {error.mismatchError || error.backendError}
          </p>
        )}
      </form>
    </div>
  );
};

export default Body;
