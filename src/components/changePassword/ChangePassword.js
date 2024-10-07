import React, { useState } from "react";
import "./ChangePassword.scss";
import { toast } from "react-toastify";
import Card from "../card/Card";
import { useNavigate } from "react-router-dom";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import {
  changeUserPassword,
  logout,
  RESET,
} from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerImg } from "../loader/Loader";
import PasswordInput from "../passwordInput/PasswordInput";
import { sendAutomatedEmail } from "../../redux/features/email/emailSlice";

const initialState = {
  oldPassword: "",
  password: "",
  password2: "",
};

const ChangePassword = () => {
  useRedirectLoggedOutUser("/login"); //if a user tries to change password within their profile and not logged in, redirect them to the login page
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setformData] = useState(initialState);
  const { oldPassword, password, password2 } = formData;

  const { isLoading, user } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const changePass = async (e) => {
    e.preventDefault();

    if (!oldPassword || !password || !password2) {
      return toast.error("All fields are required");
    }

    if (password !== password2) {
      return toast.error("New passwords do not match");
    }

    const formData = {
      oldPassword,
      password,
    };

    // Email Data to be sent after a password change
    const emailData = {
      subject: "Gas Station Pro Account Password Changed",
      send_to: user.email,
      reply_to: "noreply@gaststationpro.com",
      template: "passwordChangedEmail",
      url: "/forgotpassword",
    };

    await dispatch(changeUserPassword(formData));
    await dispatch(sendAutomatedEmail(emailData)); //send the email
    //await dispatch(logout());
    await dispatch(RESET(formData));
    //toast.success(data);
    navigate("/profile");
  };

  return (
    <div className="change-password">
      <Card cardClass={"password-card"}>
        <h3>Change Password</h3>
        <form onSubmit={changePass} className="--form-control">
          <PasswordInput
            placeholder=" Old Password"
            name="oldPassword"
            value={oldPassword}
            onChange={handleInputChange}
          />
          <PasswordInput
            placeholder="New Password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
          <PasswordInput
            placeholder="Confirm New Password"
            name="password2"
            value={password2}
            onChange={handleInputChange}
          />
          {isLoading ? (
            <SpinnerImg />
          ) : (
            <button type="submit" className="--btn --btn-primary">
              Change Password
            </button>
          )}
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
