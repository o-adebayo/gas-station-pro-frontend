import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import storeLocationReducer from "../redux/features/storeLocation/storeLocationSlice";
//import manageUserReducer from "../redux/features/manageUser/manageUserSlice";
import reportReducer from "../redux/features/report/reportSlice";
import filterReducer from "../redux/features/report/filterSlice";
import emailReducer from "../redux/features/email/emailSlice";
import userFilterSlice from "./features/auth/userFilterSlice";
import storeFilterSlice from "./features/storeLocation/storeFilterSlice";
import companyReducer from "../redux/features/company/companySlice";
import globalReducer from "../redux/features/state/state";

// Redux Persist
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default localStorage for web

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  storeLocation: storeLocationReducer,
  //manageUser: manageUserReducer,
  report: reportReducer,
  filter: filterReducer,
  email: emailReducer,
  userFilter: userFilterSlice, //I had to use that name because i created a filter for reports from a different project before
  storeFilter: storeFilterSlice, //I had to use that name because i created a filter for reports from a different project before
  company: companyReducer,
  global: globalReducer,
});

// Redux Persist configuration
const persistConfig = {
  key: "root",
  storage, // Uses localStorage
  version: 1,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration with persisted reducer
export const store = configureStore({
  reducer: persistedReducer, // Assign the persisted reducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these Redux-Persist action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Persistor to be used in the application entry point
export const persistor = persistStore(store);
