import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import PasswordInput from "../passwordInput/PasswordInput";
import {
  adminSetUserPassword,
  fetchUsers,
} from "../../redux/features/auth/authSlice";

//import { getUsers, upgradeUser } from "../../redux/features/auth/authSlice";

const AdminSetPassword = ({ _id, email }) => {
  const [userPassword, setUserPassword] = useState("");
  const dispatch = useDispatch();

  // Change User Password
  const setPassword = async (e) => {
    e.preventDefault();

    if (!userPassword) {
      toast.error("Please enter a password");
      return;
    }

    const userData = {
      newPassword: userPassword,
      id: _id,
    };

    try {
      // Dispatch the adminSetUserPassword action to update the user’s password
      await dispatch(adminSetUserPassword(userData)).unwrap();
      await dispatch(fetchUsers()); // Refresh users list after setting password

      toast.success("Password set successfully, and user notified by email.");
    } catch (error) {
      toast.error("Failed to set password. Please try again.");
    } finally {
      setUserPassword(""); // Clear the password input field after action completes
    }
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
        <button className="--btn --btn-primary" title="Save">
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
};

export default AdminSetPassword;
