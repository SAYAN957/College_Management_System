import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../../../utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminUpdatePassword } from "../../../../../redux/actions/adminActions";
import * as classes from "../../../../../utils/styles";
import { facultyUpdatePassword } from "../../../../../redux/actions/facultyActions";
// Password strength validator
const validatePassword = (pwd) => {
  const problems = [];
  if (pwd.length < 8) problems.push("at least 8 characters");
  if (!/[A-Z]/.test(pwd)) problems.push("one uppercase letter");
  if (!/[0-9]/.test(pwd)) problems.push("one number");
  if (!/[!@#$%^&*()_+\-=[\]{}|;':\",./<>?]/.test(pwd))
    problems.push("one special character");
  return problems;
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

  // 1️⃣ Validate password strength
  const issues = validatePassword(newPassword);
  if (issues.length > 0) {
    setError({ mismatchError: `Password must contain ${issues.join(", ")}.` });
    return;
  }

  // 2️⃣ Check confirm match
  if (newPassword !== confirmPassword) {
    setError({ mismatchError: "Passwords do not match." });
    return;
  }

  // 3️⃣ Proceed to update
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
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <VisibilityOffIcon />
          <h1>Password</h1>
        </div>

        <div className=" mr-10 bg-white flex flex-col rounded-xl ">
          <form
            onSubmit={update}
            className="flex flex-col space-y-6 items-center my-8">
            <h1 className="text-black text-3xl font-bold">Update Password</h1>
            <div className="space-y-1">
              <p className="text-[#515966] font-bold text-sm">New Password</p>
              <div className="border-2 rounded-lg px-3 flex items-center space-x-3 w-full">
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  required
                  type={showPassword ? "text" : "password"}
                  className="rounded-lg outline-none py-2  placeholder:text-sm"
                  placeholder="New Password"
                />
                {showPassword ? (
                  <VisibilityIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <VisibilityOffIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[#515966] font-bold text-sm">
                Confirm Password
              </p>
              <div className="border-2 rounded-lg px-3 flex items-center space-x-3 w-full">
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                  type={showPassword ? "text" : "password"}
                  className="rounded-lg outline-none py-2  placeholder:text-sm"
                  placeholder="Confirm Password"
                />
                {showPassword ? (
                  <VisibilityIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                ) : (
                  <VisibilityOffIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Update
              </button>
              <button
                onClick={() => navigate("/admin/profile")}
                className={classes.adminFormClearButton}
                type="button">
                Cancel
              </button>
            </div>
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
      </div>
    </div>
  );
};

export default Body;
