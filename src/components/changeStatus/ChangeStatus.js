import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  changeUerStatus,
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
const ChangeStatus = ({ _id, email }) => {
  const [userStatus, setUserStatus] = useState("");
  const dispatch = useDispatch();

  // Change User role
  const changeStatus = async (e) => {
    e.preventDefault();

    if (!userStatus) {
      toast.error("Please select a status");
    }

    const userData = {
      newStatus: userStatus,
      id: _id,
    };

    const emailData = {
      subject: "Gas Station Pro Account Status Changed",
      send_to: email,
      reply_to: "noreply@gaststationpro",
      template: "changeStatusEmail",
      url: "/login",
    };

    await dispatch(changeUerStatus(userData));
    await dispatch(sendAutomatedEmail(emailData));
    await dispatch(fetchUsers());
    dispatch(EMAIL_RESET());
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
        <button className="--btn --btn-primary">
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
};

export default ChangeStatus;
