import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchStoreLocations,
  updateStoreLocationManager,
} from "../../redux/features/storeLocation/storeLocationSlice";

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

    try {
      // Dispatch the action to update the store's manager
      await dispatch(updateStoreLocationManager(storeData)).unwrap();
      //toast.success("Store manager updated successfully.");

      // Fetch updated store locations
      await dispatch(fetchStoreLocations());

      // Email will be sent from the backend after manager assignment
    } catch (error) {
      toast.error("Failed to update store manager or send email notification.");
    }
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
          title="Save"
        >
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
};

export default ChangeStoreManager;
