import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CREATE_USER_API_URL = `${BACKEND_URL}/api/users/register`;

// Create New User
// formData is the parameters we will pass when we call this function
// it will then send those parameters to the backend to create the user
// no try catch needed because we will use createAsyncThunk to make out http requests to the backend
// we also add export to it so it can be accessed from anywhere in our application (we added the export to the manaUserSerice object at the bottom)
const createUser = async (formData) => {
  const response = await axios.post(CREATE_USER_API_URL, formData); //post to an API URL and send it with the formData
  return response.data; //i.e. return the user we just created back to the frontend
};

// get all users
const getUsers = async () => {
  const response = await axios.get(CREATE_USER_API_URL); //post to an API URL and send it with the formData
  return response.data; //i.e. return the user we just created back to the frontend
};

// since the functions here will share the same name as the ones in manageUserSlice file
// we will export these functions here in a different way
// this is now an object with multiple functions in it
const manageUserService = {
  createUser,
  getUsers,
};

// now we can export the manageUserService
// this mean when we want to access the createUser or other functions from this file
// we will access them through the manageUserService below
// so the functions having the same name as other functions from other files does not matter
// since we can now differentiate
export default manageUserService;
