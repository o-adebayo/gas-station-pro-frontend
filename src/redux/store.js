import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import storeLocationReducer from "../redux/features/storeLocation/storeLocationSlice";
//import manageUserReducer from "../redux/features/manageUser/manageUserSlice";
import reportReducer from "../redux/features/report/reportSlice";
import filterReducer from "../redux/features/report/filterSlice";
import emailReducer from "../redux/features/email/emailSlice";
import userFilterSlice from "./features/auth/userFilterSlice";
import storeFilterSlice from "./features/storeLocation/storeFilterSlice";
import companyReducer from "../redux/features/company/companySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    storeLocation: storeLocationReducer,
    //manageUser: manageUserReducer,
    report: reportReducer,
    filter: filterReducer,
    email: emailReducer,
    userFilter: userFilterSlice, //I had to use that name because i created a filter for reports from a different project before
    storeFilter: storeFilterSlice, //I had to use that name because i created a filter for reports from a different project before
    company: companyReducer,
  },
});
