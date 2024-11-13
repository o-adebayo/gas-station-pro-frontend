import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  changeUerStatus,
  fetchUsers,
} from "../../redux/features/auth/authSlice";

const ChangeStatus = ({ _id, email }) => {
  const [userStatus, setUserStatus] = useState("");
  const dispatch = useDispatch();

  // Change User status
  const changeStatus = async (e) => {
    e.preventDefault();

    if (!userStatus) {
      return toast.error("Please select a status");
    }

    const userData = {
      newStatus: userStatus,
      id: _id,
    };

    try {
      // Dispatch action to change user status and send notification email from the backend
      await dispatch(changeUerStatus(userData));
      //toast.success("User status changed successfully, and email notification sent.");

      // Refresh user list after status change
      await dispatch(fetchUsers());
    } catch (error) {
      toast.error("Failed to change user status.");
    }
  };

  return (
    <div className="sort">
      <form
        className="--flex-start"
        onSubmit={(e) => changeStatus(e, _id, userStatus)}
      >
        <select
          value={userStatus}
          onChange={(e) => setUserStatus(e.target.value)}
        >
          <option value="">-- select --</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <button className="--btn --btn-primary" title="Save">
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
};

export default ChangeStatus;
