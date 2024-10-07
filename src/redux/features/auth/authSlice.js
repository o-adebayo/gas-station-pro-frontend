import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  activateUser,
  activateUserByAdmin,
  adminSetPassword,
  changePassword,
  changeStatus,
  deleteUser,
  forgotPassword,
  getLoginStatus,
  getUser,
  getUsers,
  loginUser,
  loginWithCode,
  logoutUser,
  registerUser,
  registerUserByAdmin,
  resetPassword,
  sendActivationEmail,
  sendLoginCode,
  updateUser,
  upgradeUser,
} from "../../../services/authService";
import { toast } from "react-toastify";

const name = JSON.parse(localStorage.getItem("name"));

const initialState = {
  isLoggedIn: false,
  name: name ? name : "",
  /* user: {
    name: "",
    email: "",
    phone: "",
    role: "",
    storeId: "",
    companyCode: "",
    photo: "",
    status: "",
  }, */
  user: null,
  users: [],
  storeLocation: null,
  storeLocations: [],
  userId: "",
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  twoFactor: false,
  activeUsers: 0,
  inactiveUsers: 0,
  suspendedUsers: 0,
  managerUsers: 0,
  adminUsers: 0,
};

// Now we can execute all the backend functions we created in authService from the services folder

// Register User
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register User
export const registerByAdmin = createAsyncThunk(
  "auth/registerbyadmin",
  async (userData, thunkAPI) => {
    try {
      return await registerUserByAdmin(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login User
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await loginUser(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return await logoutUser();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get Login Status
export const loginStatus = createAsyncThunk(
  "auth/getLoginStatus",
  async (_, thunkAPI) => {
    try {
      return await getLoginStatus();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get User
export const fetchUser = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      return await getUser();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch All Users
export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, thunkAPI) => {
    try {
      return await getUsers(); // Call service to fetch users
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update User
export const updateUserProfile = createAsyncThunk(
  "auth/updateUser",
  async (userData, thunkAPI) => {
    try {
      return await updateUser(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Send activation email
export const sendUserActivationEmail = createAsyncThunk(
  "auth/sendActivationEmail",
  async (_, thunkAPI) => {
    try {
      return await sendActivationEmail();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Activate User Account normal flow
export const activateUserAccount = createAsyncThunk(
  "auth/activateUser",
  async (activationToken, thunkAPI) => {
    try {
      return await activateUser(activationToken);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Activate User Account added by Admin
export const activateUserAccountAddedByAdmin = createAsyncThunk(
  "auth/activateUserByAdmin",
  async (userData, activationToken, thunkAPI) => {
    try {
      return await activateUserByAdmin(userData, activationToken);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// change password
export const changeUserPassword = createAsyncThunk(
  "auth/changePassword",
  async (formData, thunkAPI) => {
    try {
      return await changePassword(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Forgot password
export const forgotUserPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (formData, thunkAPI) => {
    try {
      return await forgotPassword(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// reset password
export const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ password, resetToken }, thunkAPI) => {
    try {
      const response = await resetPassword({ password }, resetToken); // Adjust service call to pass the correct parameters
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete User
export const removeUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, thunkAPI) => {
    try {
      return await deleteUser(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upgrade or change User role
export const changeUserRole = createAsyncThunk(
  "auth/upgradeUser",
  async (formData, thunkAPI) => {
    try {
      return await upgradeUser(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// change User status
export const changeUerStatus = createAsyncThunk(
  "auth/changeUserStatus",
  async (formData, thunkAPI) => {
    try {
      return await changeStatus(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Admin set User password
export const adminSetUserPassword = createAsyncThunk(
  "auth/adminSetUserPassword",
  async (formData, thunkAPI) => {
    try {
      return await adminSetPassword(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Send Login Code
export const sendUserLoginCode = createAsyncThunk(
  "auth/sendLoginCode",
  async (email, thunkAPI) => {
    try {
      return await sendLoginCode(email);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Send Login Code
export const userLoginWithCode = createAsyncThunk(
  "auth/loginWithCode",
  async ({ code, email }, thunkAPI) => {
    try {
      return await loginWithCode(code, email);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET(state) {
      state.twoFactor = false;
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
    CALC_ACTIVE_USERS(state, action) {
      const array = [];
      state.users.map((user) => {
        const { status } = user;
        return array.push(status);
      });
      let count = 0;
      array.forEach((item) => {
        if (item === "active") {
          count += 1;
        }
      });
      state.activeUsers = count;
    },
    CALC_INACTIVE_USERS(state, action) {
      const array = [];
      state.users.map((user) => {
        const { status } = user;
        return array.push(status);
      });
      let count = 0;
      array.forEach((item) => {
        if (item === "inactive") {
          count += 1;
        }
      });
      state.inactiveUsers = count;
    },
    CALC_MANAGER_USERS(state, action) {
      const array = [];
      state.users.map((user) => {
        const { role } = user;
        return array.push(role);
      });
      let count = 0;
      array.forEach((item) => {
        if (item === "manager") {
          count += 1;
        }
      });
      state.managerUsers = count;
    },
    CALC_ADMIN_USERS(state, action) {
      const array = [];
      state.users.map((user) => {
        const { role } = user;
        return array.push(role);
      });
      let count = 0;
      array.forEach((item) => {
        if (item === "admin") {
          count += 1;
        }
      });
      state.adminUsers = count;
    },
    CALC_SUSPENDED_USERS(state, action) {
      const array = [];
      state.users.map((user) => {
        const { role } = user;
        return array.push(role);
      });
      let count = 0;
      array.forEach((item) => {
        if (item === "suspended") {
          count += 1;
        }
      });
      state.suspendedUsers = count;
    },
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      localStorage.setItem("name", JSON.stringify(action.payload));
      state.name = action.payload;
    },
    SET_USERID(state, action) {
      localStorage.setItem("userId", JSON.stringify(action.payload));
      state.userId = action.payload;
    },
    SET_USER(state, action) {
      const profile = action.payload; // profile contains all the details about the logged-in user
      state.user = { ...state.user, ...profile };
    },
  },
  extraReducers: (builder) => {
    builder
      // register user normal flow
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        state.user = action.payload; // Set user data in the store
        toast.success("Registration successful");
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isLoggedIn = false;
        state.message = action.payload;
        state.user = null;
        toast.error(action.payload);
      })
      // register user by admin
      .addCase(registerByAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        state.user = action.payload;
        toast.success("Registration successful");
      })
      .addCase(registerByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.isLoggedIn = false;
        state.user = null;
        toast.error(action.payload);
      })
      //login user
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
        toast.success("Login Successful");
        console.log(action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isLoggedIn = false; // Explicitly set to false if login fails
        state.user = null;
        state.message = action.payload;
        toast.error(action.payload);
        if (action.payload.includes("Unrecognized device")) {
          state.twoFactor = true;
        }
      })
      //logout user
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        state.user = null;
        toast.success(action.payload);
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        toast.error(action.payload);
      })
      //get login status
      .addCase(loginStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = action.payload;
      })
      .addCase(loginStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //get user profile
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        //state.isLoggedIn = false;
        state.message = action.payload;
        toast.error(action.payload);
      })
      //update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Fetch All Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload; // Set users data
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Send Activation email. may not use it since i already have a method to send activation email
      .addCase(sendUserActivationEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendUserActivationEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(sendUserActivationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Activate user normal flow
      .addCase(activateUserAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activateUserAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(activateUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Activate user added by admin
      .addCase(activateUserAccountAddedByAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activateUserAccountAddedByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(activateUserAccountAddedByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.isLoggedIn = false;
        toast.error(action.payload);
      })
      // change password
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // forgot password
      .addCase(forgotUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(forgotUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // reset password
      .addCase(resetUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Password Reset successful"; // Safely access the message
        toast.success(action.payload?.message || "Password Reset successful");
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message || action.payload || "An error occurred"; // Safely access the message
        toast.error(
          action.payload?.message || action.payload || "An error occurred"
        );
      })
      // Delete user
      .addCase(removeUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Upgrade or change user role
      .addCase(changeUserRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // change user status
      .addCase(changeUerStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUerStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(changeUerStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // admin set user password
      .addCase(adminSetUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminSetUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(adminSetUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // Send login code
      .addCase(sendUserLoginCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendUserLoginCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(sendUserLoginCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      //  login with code
      .addCase(userLoginWithCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userLoginWithCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.twoFactor = false;
        state.user = action.payload;
        toast.success(action.payload);
      })
      .addCase(userLoginWithCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        toast.error(action.payload);
      });
  },
});

export const {
  RESET,
  CALC_ACTIVE_USERS,
  CALC_INACTIVE_USERS,
  CALC_MANAGER_USERS,
  CALC_ADMIN_USERS,
  CALC_SUSPENDED_USERS,
  SET_LOGIN,
  SET_NAME,
  SET_USER,
  SET_USERID,
} = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectUsers = (state) => state.auth.users; // New selector to select all users
export const selectIsLoading = (state) => state.auth.isLoading; // New selector to select loading state

export default authSlice.reducer;
