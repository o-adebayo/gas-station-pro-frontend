import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import PasswordInput from "../passwordInput/PasswordInput";
import {
  adminSetUserPassword,
  fetchUsers,
} from "../../redux/features/auth/authSlice";
import {
  EMAIL_RESET,
  sendAutomatedEmail,
} from "../../redux/features/email/emailSlice";
//import { getUsers, upgradeUser } from "../../redux/features/auth/authSlice";
/* import {
  EMAIL_RESET,
  sendAutomatedEmail,
} from "../../redux/features/email/emailSlice";
 */
const AdminSetPassword = ({ _id, email }) => {
  const [userPassword, setUserPassword] = useState("");
  const dispatch = useDispatch();

  // Change User role
  const setPassword = async (e) => {
    e.preventDefault();

    if (!userPassword) {
      toast.error("Please enter a password");
    }

    const userData = {
      newPassword: userPassword,
      id: _id,
    };

    const emailData = {
      subject: " Gas Station Pro Account Password Changed",
      send_to: email,
      reply_to: "noreply@gaststationpro",
      template: "adminSetPasswordEmail",
      url: "/login",
    };

    await dispatch(adminSetUserPassword(userData));
    await dispatch(sendAutomatedEmail(emailData));
    await dispatch(fetchUsers());
    dispatch(EMAIL_RESET());
  };

  return (
    <div className="sort">
      <form
        className="--flex-start"
        onSubmit={(e) => setPassword(e, _id, userPassword)}
      >
        <PasswordInput
          placeholder="Set Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <button className="--btn --btn-primary">
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
};

export default AdminSetPassword;
