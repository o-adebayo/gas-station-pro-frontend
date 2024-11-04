import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStoreLocations,
  selectStores,
} from "../../redux/features/storeLocation/storeLocationSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import {
  registerByAdmin,
  selectIsLoading,
} from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import UserFormNew from "../../components/user/userForm/UserFormNew";
import { CircularProgress } from "@mui/material";

const AddNewUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for storing image data
  const [userImage, setUserImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Select loading status
  const isLoading = useSelector(selectIsLoading);

  // Select stores based on admin's company code
  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  // Get the logged-in user data to obtain the company code
  const loggedInUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (loggedInUser?.companyCode) {
      dispatch(fetchStoreLocations());
    }
  }, [dispatch, loggedInUser]);

  // Function to handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0]; // Check if files exist
    if (file) {
      setUserImage(file); // Store the image file in state
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the image
    } else {
      // Handle the case where the file is invalid or not selected
      setUserImage(null);
      setImagePreview(null);
      console.error("No valid file selected");
    }
  };

  // Function to save user into the DB
  const saveUser = async (values) => {
    try {
      // Prepare the user data in a FormData object for file upload
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      //formData.append("password", "123456"); // You can remove this if you have password field in the form
      formData.append("role", values.role);
      formData.append("storeName", values.storeName);
      formData.append("phone", values.phone);

      // Append the user image if available
      if (userImage) {
        formData.append("photo", userImage);
      }

      // Dispatch the registerByAdmin action with the form data
      await dispatch(registerByAdmin(formData)).unwrap();

      toast.success("User added successfully!");
      navigate("/users"); // Redirect to the users page
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };

  return (
    <div>
      {isLoading && <Loader />}

      <UserFormNew
        saveUser={saveUser} // Pass the function to save the user
        stores={stores} // Pass the stores list for the dropdown
        handleImageChange={handleImageChange} // Handle image file selection
        imagePreview={imagePreview} // Pass image preview to the form
        setImagePreview={setImagePreview} // Pass the state setter function
        setUserImage={setUserImage} // Pass the state setter function
      />
    </div>
  );
};

export default AddNewUser;
