import React, { useEffect } from "react";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsLoggedIn,
  selectUser,
  fetchUser, // Import the thunk action for fetching user data
} from "../../redux/features/auth/authSlice";
import { getReports } from "../../redux/features/report/reportSlice";
import ReportList from "../../components/report/reportList/ReportList";
import ReportSummary from "../../components/report/reportSummary/ReportSummary";

const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser); // Get the logged-in user data

  const { reports, isLoading, isError, message } = useSelector(
    (state) => state.report
  );

  //console.log("logged in", isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUser()); // Fetch user data when logged in
      dispatch(getReports());
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  return (
    <div>
      {/* Pass user role with Report Summary so only admins see store counts */}
      <ReportSummary reports={reports} userRole={user?.role} />

      <ReportList reports={reports} isLoading={isLoading} />
    </div>
  );
};

export default Dashboard;
