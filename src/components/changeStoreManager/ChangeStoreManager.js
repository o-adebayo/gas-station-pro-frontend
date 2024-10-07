import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchStoreLocations,
  updateStoreLocationManager,
} from "../../redux/features/storeLocation/storeLocationSlice";
import {
  EMAIL_RESET,
  sendAutomatedEmail,
} from "../../redux/features/email/emailSlice";

const ChangeStoreManager = ({ storeId }) => {
  const [managerEmail, setManagerEmail] = useState("");
  const dispatch = useDispatch();

  // Change Store Manager
  const changeStoreManager = async (e) => {
    e.preventDefault();

    if (!managerEmail) {
      toast.error("Please enter a manager email");
      return;
    }

    const storeData = {
      managerEmail: managerEmail,
      storeId: storeId,
    };

    const emailData = {
      subject: " Gas Station Pro Store Assignment",
      send_to: managerEmail,
      reply_to: "noreply@gaststationpro",
      template: "changeStoreManagerEmail",
      url: "/login",
      ownerName: "",
      companyName: "",
    };

    await dispatch(updateStoreLocationManager(storeData));
    await dispatch(sendAutomatedEmail(emailData));
    await dispatch(fetchStoreLocations());
    dispatch(EMAIL_RESET());
    // Add your dispatch action to update the store with the new manager
    // Example:
    // await dispatch(updateStoreManager(storeData));
    //toast.success("Store manager updated successfully");
  };

  return (
    <div className="sort">
      <form className="--flex-start" onSubmit={changeStoreManager}>
        {/* Email input for the manager with adjusted height */}
        <input
          type="email"
          placeholder="Manager Email"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          style={{
            height: "40px", // Adjust this value as needed to match the button
            padding: "8px",
            marginRight: "8px",
          }}
        />
        <button
          className="--btn --btn-primary"
          style={{ height: "40px" }} // Ensure button height matches the input field
        >
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
};

export default ChangeStoreManager;
