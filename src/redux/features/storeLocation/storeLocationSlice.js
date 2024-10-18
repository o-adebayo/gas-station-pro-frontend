import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import storeLocationService from "./storeLocationService";
import { toast } from "react-toastify";

const initialState = {
  storeLocation: null,
  storeLocations: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  totalStoreValue: 0,
  outOfStock: 0,
  category: [],
};

// Create New Store Location
export const createStoreLocation = createAsyncThunk(
  "stores/create",
  async (formData, thunkAPI) => {
    try {
      return await storeLocationService.createStoreLocation(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all Store Locations
export const fetchStoreLocations = createAsyncThunk(
  "stores/getAll",
  async (_, thunkAPI) => {
    try {
      return await storeLocationService.getStoreLocations();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a Store Location
export const deleteStoreLocation = createAsyncThunk(
  "stores/delete",
  async (id, thunkAPI) => {
    try {
      return await storeLocationService.deleteStoreLocation(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        //"Store Deleted Successfully";
        error.toString();
      //console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get a Store Location
export const getStoreLocation = createAsyncThunk(
  "stores/getStoreLocation",
  async (id, thunkAPI) => {
    try {
      return await storeLocationService.getStoreLocation(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get a Store by User's StoreId
export const getStoreByUserId = createAsyncThunk(
  "stores/getStoreByUserId",
  async (_, thunkAPI) => {
    // No need to pass an 'id'
    try {
      return await storeLocationService.getStoreByUserId();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Store Location
export const updateStoreLocation = createAsyncThunk(
  "stores/updateStoreLocation",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await storeLocationService.updateStoreLocation(id, formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Store Location
export const updateStoreLocationManager = createAsyncThunk(
  "stores/updateStoreLocationManager",
  async (formData, thunkAPI) => {
    try {
      return await storeLocationService.updateStoreLocationManager(formData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const storeLocationSlice = createSlice({
  name: "storeLocation",
  initialState,
  reducers: {
    CALC_STORE_VALUE(state, action) {
      const storeLocations = action.payload;
      const array = storeLocations.map((item) => item.price * item.quantity);
      state.totalStoreValue = array.reduce((a, b) => a + b, 0);
    },
    CALC_OUTOFSTOCK(state, action) {
      const storeLocations = action.payload;
      const outOfStockCount = storeLocations.reduce(
        (count, item) => (item.quantity === 0 ? count + 1 : count),
        0
      );
      state.outOfStock = outOfStockCount;
    },
    CALC_CATEGORY(state, action) {
      const storeLocations = action.payload;
      const categories = storeLocations.map((item) => item.category);
      state.category = [...new Set(categories)];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStoreLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStoreLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.storeLocations.push(action.payload);
        toast.success("Store added successfully");
      })
      .addCase(createStoreLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchStoreLocations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStoreLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.storeLocations = action.payload;
      })
      .addCase(fetchStoreLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteStoreLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStoreLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Store Deleted Successfully"; // Safely access the message
        toast.success(action.payload?.message || "Store Deleted Successfully");
      })
      .addCase(deleteStoreLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getStoreLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStoreLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.storeLocation = action.payload;
      })
      .addCase(getStoreLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      /* // get store by user id of the logged in user
      .addCase(getStoreByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStoreByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.storeLocation = action.payload;
      })
      .addCase(getStoreByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      }) */
      .addCase(updateStoreLocation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStoreLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(updateStoreLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateStoreLocationManager.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStoreLocationManager.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        toast.success(action.payload.message);
      })
      .addCase(updateStoreLocationManager.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { CALC_STORE_VALUE, CALC_OUTOFSTOCK, CALC_CATEGORY } =
  storeLocationSlice.actions;

export const selectIsLoading = (state) => state.storeLocation.isLoading;
export const selectStoreLocation = (state) => state.storeLocation.storeLocation;
export const selectStores = (state) => state.storeLocation.storeLocations;
export const selectTotalStoreValue = (state) =>
  state.storeLocation.totalStoreValue;
export const selectOutOfStock = (state) => state.storeLocation.outOfStock;
export const selectCategory = (state) => state.storeLocation.category;

export default storeLocationSlice.reducer;
