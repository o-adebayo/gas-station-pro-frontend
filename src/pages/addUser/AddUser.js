import React, { useEffect, useState } from "react";
import UserForm from "../../components/user/userForm/UserForm";
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
import { CircularProgress } from "@mui/material";

const initialState = {
  name: "", // Name of the user
  email: "", // Email of the user
  password: "", // Password of the user
  role: "", // Role of the user
  storeName: "", // Store name of the user
  phone: "", // Phone of the user
};

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Let's create our user initial states
  const [user, setUser] = useState(initialState);
  const [userImage, setUserImage] = useState(null); // For the user profile image
  const [imagePreview, setImagePreview] = useState(null);

  // Select isLoading from the manageUserSlice
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

  // Destructure user properties
  const { name, email, password, role, storeName, phone } = user;

  // Handle input change for the user object
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserImage(file); // Store the image file in state
    setImagePreview(URL.createObjectURL(file)); // Create a preview for the image
  };

  // Function to save user into the DB
  const saveUser = async (e) => {
    e.preventDefault();

    try {
      // Prepare the user data in a FormData object for file upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("storeName", storeName);
      formData.append("phone", phone);

      // Append the user image if available
      if (userImage) {
        formData.append("photo", userImage);
      }

      // Dispatch the registerByAdmin action with the form data
      await dispatch(registerByAdmin(formData)).unwrap();

      //toast.success("User added successfully!");
      navigate("/users"); // Redirect to the users page
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <h3 className="--mt">Add New User</h3>
      <UserForm
        user={user} // Pass the user object
        handleInputChange={handleInputChange} // Pass the function that handles input change
        saveUser={saveUser} // Pass the function to save the user
        stores={stores} // Pass the stores list for the dropdown
        handleImageChange={handleImageChange} // Handle image file selection
        imagePreview={imagePreview} // Pass image preview to the form
      />
    </div>
  );
};

export default AddUser;
