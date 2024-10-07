import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredStores: [],
};

const storeFilterSlice = createSlice({
  name: "storeFilter",
  initialState,
  reducers: {
    FILTER_STORES(state, action) {
      const { stores, search } = action.payload;
      const tempStores = stores.filter(
        (store) =>
          store.name.toLowerCase().includes(search.toLowerCase()) ||
          store.location.toLowerCase().includes(search.toLowerCase()) ||
          store.manager.toLowerCase().includes(search.toLowerCase()) ||
          store.pumps.includes(search) ||
          store.nozzles.includes(search) ||
          store.tanks.includes(search)
      );
      state.filteredStores = tempStores;
    },
  },
});

export const { FILTER_STORES } = storeFilterSlice.actions;

export const selectStoresList = (state) => state.userFilter.filteredStores;

export default storeFilterSlice.reducer;
