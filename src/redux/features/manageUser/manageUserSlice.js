import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import manageUserService from "./manageUserService";
import { toast } from "react-toastify";

const initialState = {
  manageUser: null, //single user
  manageUsers: [], //array of multiple users i.e. list of all users in the comp
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create New User
// add export so we can use it from anywhere in our application
export const createUser = createAsyncThunk(
  "users/register", //give it a name i.e dealing with users and I want to register a user
  async (formData, thunkAPI) => {
    //we need access to the formData before executing the function  and also call the thunk api
    try {
      // we will execute the functions we created in the manageUserService file
      console.log("manager slice", formData);
      return await manageUserService.createUser(formData); // call the createUser from the manaUserService and also pass the formData
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log("error from createUser in manageUserService", message); //log any possible error messages if it fails
      return thunkAPI.rejectWithValue(message); //reject the value and pass the error message so we know why
    }
  }
);

const manageUserSlice = createSlice({
  name: "manageUser",
  initialState,
  reducers: {
    CALC_USER_VALUE(state, action) {
      //instead of CALC_STORE_VALUE, we can calculate how many users in the company
      console.log("store value");
    },
  },
  extraReducers: (builder) => {
    //responses from asyncthunk http requests are stored here
    // we also have access to the 3 states from asyncthunk request via the builder param: pending, success, failure
    builder
      .addCase(createUser.pending, (state) => {
        //createUser here is the function this manageUSerSlice i.e. this file
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        // this is for when the request succeeeds. createUser here is the function this manageUSerSlice i.e. this file. We alo need the action so we can get the payload data
        state.isLoading = false;
        state.isSuccess = true; //this means the call was successful
        console.log(
          "action payload from createSUer fulfilled in manageUSerSlice",
          action.payload
        ); //action.payload should be the new user that we added
        state.manageUsers.push(action.payload); //add the new user we created to our list of users array
        toast.success("User added successfully"); //now show a toast message at the top right of the screen that the user was added
      })
      .addCase(createUser.rejected, (state, action) => {
        // this is for when the request is rejected. createUser here is the function this manageUSerSlice i.e. this file. We alo need the action so we can get the payload data
        state.isLoading = false;
        state.isError = true; //this means the call failed
        state.message = action.payload; //i.e. whatever message we get from the server since it failed
        toast.error(
          "Error from create user rejected in manageUSerSlice",
          action.payload
        ); //now show a toast message at the top right of the screen that the user was added
      });
  },
});

export const { CALC_USER_VALUE } = manageUserSlice.actions;

// export isLoading so we can use it from a different file
// and will come from the manageUser state from above
// isLoading state can now be accessed from anywhere in out application
export const selectIsLoading = (state) => state.manageUser.isLoading;

export default manageUserSlice.reducer;
