import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { themeSettings } from "../src/theme";
import Home from "./pages/Home/Home";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  loginStatus,
  selectIsLoggedIn,
  selectUser,
} from "./redux/features/auth/authSlice";

//new pages
import Contact from "./pages/contact/Contact";
import DashboardNew from "./pages/dashboard/DashboardNew";
import LayoutNew from "./components/layout/LayoutNew";
import UserListNew from "./pages/userList/UserListNew";
import StoreListNew from "./pages/storeList/StoreListNew";
import ReportListNew from "./components/report/reportList/ReportListNew";
import AddNewUser from "./pages/addUser/AddNewUser";
import AddNewStoreLocation from "./pages/addStoreLocation/AddNewStoreLocation";
import Calendar from "./pages/calendar/Calendar";
import EditProfileNew from "./pages/profile/EditProfileNew";
import ProfileNew from "./pages/profile/ProfileNew";
import LoginNew from "./pages/auth/LoginNew";
import RegisterNew from "./pages/auth/RegisterNew";
import CompanySignUpNew from "./pages/auth/CompanySignUpNew";
import ActivateNew from "./pages/auth/ActivateNew";
import ActivateUserAddedByAdminNew from "./pages/auth/ActivateUserAddedByAdminNew";
import ForgotNew from "./pages/auth/ForgotNew";
import LoginWithCodeNew from "./pages/auth/LoginWithCodeNew";
import ResetNew from "./pages/auth/ResetNew";
import AddReportNew from "./pages/addReport/AddReportNew";
import EditReportNew from "./pages/editReport/EditReportNew";
import ViewStoreNew from "./pages/storeList/ViewStoreNew";
import EditStoreNew from "./pages/storeList/EditStoreNew";
import ViewUserNew from "./pages/userList/ViewUserNew";
import EditUserNew from "./pages/userList/EditUserNew";
import Analytics from "./pages/analytics/Analytics";
import ReportDetailNew from "./components/report/reportDetail/ReportDetailNew";
import ViewCompany from "./pages/company/ViewCompany";

axios.defaults.withCredentials = true;

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const dispatch = useDispatch();
  // to ensure redux states are retained
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(loginStatus());
    // so if the user is logged in and you refresh or user goes to null for any reason, get the user back
    if (isLoggedIn && user === null) {
      dispatch(fetchUser);
    }
  }, [dispatch, isLoggedIn, user]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route element={<LayoutNew />}>
            <Route path="/dashboard" element={<DashboardNew />} />
            <Route path="/profile" element={<ProfileNew />} />
            <Route path="/my-company" element={<ViewCompany />} />
            <Route path="/users" element={<UserListNew />} />
            <Route path="/users/view-user/:id" element={<ViewUserNew />} />
            <Route path="/users/edit-user/:id" element={<EditUserNew />} />
            <Route path="/allstores" element={<StoreListNew />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/allstores/view-store/:id"
              element={<ViewStoreNew />}
            />
            <Route
              path="/allstores/edit-store/:id"
              element={<EditStoreNew />}
            />
            <Route path="/add-report" element={<AddReportNew />} />
            {/* <Route path="/add-reportold" element={<AddReport />} /> */}
            <Route path="/edit-report/:id" element={<EditReportNew />} />
            <Route path="/add-user" element={<AddNewUser />} />
            <Route path="/add-store" element={<AddNewStoreLocation />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/edit-profile" element={<EditProfileNew />} />
            <Route path="/reports" element={<ReportListNew />} />
            <Route path="/report-detail/:id" element={<ReportDetailNew />} />
          </Route>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<LoginNew />} />
          <Route path="/register" element={<RegisterNew />} />
          <Route path="/forgotpassword" element={<ForgotNew />} />
          <Route path="/resetpassword/:resetToken" element={<ResetNew />} />
          <Route path="/loginWithCode/:email" element={<LoginWithCodeNew />} />
          <Route path="/company-signup" element={<CompanySignUpNew />} />
          <Route path="/activate/:activationToken" element={<ActivateNew />} />
          <Route
            path="/activateaddedbyadmin/:activationToken"
            element={<ActivateUserAddedByAdminNew />}
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
