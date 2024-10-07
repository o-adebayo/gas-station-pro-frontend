import axios from "axios";
import { toast } from "react-toastify";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/users/`;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// define all requests to the backend and then we will execute them from authSlice in the auth folder
// Register User
export const registerUser = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);
  return response.data;
};

// Register User Added By Admin
export const registerUserByAdmin = async (userData) => {
  const response = await axios.post(API_URL + "registerbyadmin", userData);
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);
  return response.data;
};

// Logout User
export const logoutUser = async () => {
  const response = await axios.get(API_URL + "logout");
  return response.data.message;
};

// Get Login Status
export const getLoginStatus = async () => {
  //  try {
  const response = await axios.get(API_URL + "loggedin");
  return response.data;
};
/*  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
}; */

// Forgot Password
// fORGOT Password
export const forgotPassword = async (userData) => {
  const response = await axios.post(API_URL + "forgotPassword", userData);

  return response.data.message;
};

// Reset Password
// Reset Password
export const resetPassword = async (userData, resetToken) => {
  const response = await axios.patch(
    `${API_URL}resetPassword/${resetToken}`,
    userData
  );

  return response.data.message;
};

// Activate User once they click the link from their email
//export const activateUser = async (userData, activationToken) => {
export const activateUser = async (activationToken) => {
  const response = await axios.put(`${API_URL}/activate/${activationToken}`);
  return response.data.message;
};

// Activate User once they click the link from their email
export const activateUserByAdmin = async (userData, activationToken) => {
  const response = await axios.put(
    `${API_URL}/activateaddedbyadmin/${activationToken}`,
    userData
  );
  return response.data.message;
};

// Get user profile
export const getUser = async () => {
  const response = await axios.get(API_URL + "getUser");
  return response.data;
};

// Delete User
export const deleteUser = async (id) => {
  const response = await axios.delete(API_URL + id);

  return response.data.message;
};

// Get all users
export const getUsers = async () => {
  const response = await axios.get(API_URL + "getUsers");

  return response.data;
};

// Update Profile
export const updateUser = async (userData) => {
  const response = await axios.patch(API_URL + "updateUser", userData);
  return response.data;
};

// Change Password
export const changePassword = async (userData) => {
  const response = await axios.patch(API_URL + "changePassword", userData);

  return response.data.message;
};

// Upgrade User user
export const upgradeUser = async (userData) => {
  const response = await axios.post(API_URL + "upgradeUser", userData);

  return response.data.message;
};

// change User status
export const changeStatus = async (userData) => {
  const response = await axios.post(API_URL + "changeUserStatus", userData);

  return response.data.message;
};

// admin set User password
export const adminSetPassword = async (userData) => {
  const response = await axios.post(API_URL + "adminSetPassword", userData);

  return response.data.message;
};

// Send Login Code
export const sendLoginCode = async (email) => {
  const response = await axios.post(API_URL + `sendLoginCode/${email}`);

  return response.data.message;
};

// Send Login Code
export const loginWithCode = async (code, email) => {
  const response = await axios.post(API_URL + `loginWithCode/${email}`, code);

  return response.data;
};

// Send activation email
export const sendActivationEmail = async () => {
  const response = await axios.post(API_URL + "sendActivationEmail");
  return response.data.message;
};
