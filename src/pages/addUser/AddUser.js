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

  // Function to save user into the DB
  const saveUser = async (e) => {
    e.preventDefault();

    // Prepare the user data to be saved
    const userData = {
      name,
      email,
      password,
      role,
      storeName,
      phone,
    };

    // Dispatch the createUser action with the user data
    await dispatch(registerByAdmin(userData));

    // Navigate to the dashboard or the all users page
    navigate("/users");
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
      />
    </div>
  );
};

export default AddUser;
