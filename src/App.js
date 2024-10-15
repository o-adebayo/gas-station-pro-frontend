import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";
import Reset from "./pages/auth/Reset";
import Activate from "./pages/auth/Activate";
import Sidebar from "./components/sidebar/Sidebar";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
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
import AddStoreLocation from "./pages/addStoreLocation/AddStoreLocation";
import AddUser from "./pages/addUser/AddUser";
import AddReport from "./pages/addReport/AddReport";
import ReportDetail from "./components/report/reportDetail/ReportDetail";
import EditReport from "./pages/editReport/EditReport";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Contact from "./pages/contact/Contact";
import LoginWithCode from "./pages/auth/LoginWithCode";
import UserList from "./pages/userList/UserList";
import StoreList from "./pages/storeList/StoreList";
import ActivateUserAddedByAdmin from "./pages/auth/ActivateUserAddedByAdmin";
import AddCompany from "./pages/addCompany/AddCompany";
import CompanySignUp from "./pages/auth/CompanySignUp";

axios.defaults.withCredentials = true;

function App() {
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company-signup" element={<CompanySignUp />} />
        <Route path="/forgotpassword" element={<Forgot />} />
        <Route path="/resetpassword/:resetToken" element={<Reset />} />
        <Route path="/activate/:activationToken" element={<Activate />} />
        <Route
          path="/activateaddedbyadmin/:activationToken"
          element={<ActivateUserAddedByAdmin />}
        />
        <Route path="/loginWithCode/:email" element={<LoginWithCode />} />

        <Route
          path="/dashboard"
          element={
            <Sidebar>
              <Layout>
                <Dashboard />
              </Layout>
            </Sidebar>
          }
        />

        <Route
          path="/add-storeLocation"
          element={
            <Sidebar>
              <Layout>
                <AddStoreLocation />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/add-user"
          element={
            <Sidebar>
              <Layout>
                <AddUser />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/add-report"
          element={
            <Sidebar>
              <Layout>
                <AddReport />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/report-detail/:id"
          element={
            <Sidebar>
              <Layout>
                <ReportDetail />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/edit-report/:id"
          element={
            <Sidebar>
              <Layout>
                <EditReport />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/profile"
          element={
            <Sidebar>
              <Layout>
                <Profile />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <Sidebar>
              <Layout>
                <EditProfile />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/contact-us"
          element={
            <Sidebar>
              <Layout>
                <Contact />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/users"
          element={
            <Sidebar>
              <Layout>
                <UserList />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/stores"
          element={
            <Sidebar>
              <Layout>
                <StoreList />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/add-company"
          element={
            <Sidebar>
              <Layout>
                <AddCompany />
              </Layout>
            </Sidebar>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
