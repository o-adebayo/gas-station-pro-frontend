import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredUsers: [],
};

const userFilterSlice = createSlice({
  name: "userFilter",
  initialState,
  reducers: {
    FILTER_USERS(state, action) {
      const { users, search } = action.payload;
      const tempUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase()) ||
          user.status.toLowerCase().includes(search.toLowerCase())
      );
      state.filteredUsers = tempUsers;
    },
  },
});

export const { FILTER_USERS } = userFilterSlice.actions;

export const selectUsers = (state) => state.userFilter.filteredUsers;

export default userFilterSlice.reducer;
