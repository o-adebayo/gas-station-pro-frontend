import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  changeUserRole,
  fetchUsers,
} from "../../redux/features/auth/authSlice";

//import { getUsers, upgradeUser } from "../../redux/features/auth/authSlice";

const ChangeRole = ({ _id, email }) => {
  const [userRole, setUserRole] = useState("");
  const dispatch = useDispatch();

  // Change User Role and send email
  const changeRole = async (e) => {
    e.preventDefault();

    if (!userRole) {
      toast.error("Please select a role");
      return;
    }

    // Prepare data for backend request
    const userData = {
      newRole: userRole,
      id: _id,
    };

    try {
      // Call backend to change user role and send notification email
      await dispatch(changeUserRole(userData)).unwrap();

      // Fetch updated users list
      await dispatch(fetchUsers());

      toast.success(
        "User role changed successfully and notification email sent."
      );
    } catch (error) {
      toast.error(
        "Failed to change user role or send email. Please try again."
      );
      console.error("Error changing user role:", error);
    }
  };

  return (
    <div className="sort">
      <form
        className="--flex-start"
        onSubmit={(e) => changeRole(e, _id, userRole)}
      >
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="">-- select --</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="--btn --btn-primary" title="Save">
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
};

export default ChangeRole;
