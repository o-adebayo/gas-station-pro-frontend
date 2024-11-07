import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Avatar,
  Button,
  Skeleton,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { fetchUserById } from "../../redux/features/auth/authSlice";
import HeaderNew from "../../components/HeaderNew";
import Loader from "../../components/loader/Loader";
import dayjs from "dayjs";

const ViewUserNew = () => {
  const { id } = useParams(); // Get user ID from URL params

  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.auth.isLoading); // Loading state
  const userById = useSelector((state) => state.auth.userById); // Select user fetched by ID from Redux state

  useEffect(() => {
    // Fetch user by ID when the component mounts
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  // If loading, show a loader
  /*   if (isLoading) {
    return <Loader />;
  } */

  // If user is not found or something went wrong
  if (!userById) {
    return (
      <Typography variant="h6" color="error">
        User not found or something went wrong.
      </Typography>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <HeaderNew
        title="USER DETAILS"
        subtitle={`Viewing details for ${userById.name}`}
      />

      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        {isLoading ? (
          <Skeleton variant="circular" width={100} height={100} />
        ) : (
          <Avatar
            src={userById?.photo?.filePath || "/default-profile.png"}
            alt="User Profile"
            sx={{ width: 100, height: 100 }}
          />
        )}
      </Box>

      <Formik
        enableReinitialize={true} // Allow form to update when initialValues change
        initialValues={{
          companyCode: userById.companyCode || "",
          name: userById.name || "",
          email: userById.email || "",
          phone: userById.phone || "",
          role: userById.role || "",
          status: userById.status || "",
          createdAt: new Date(userById.createdAt).toLocaleString(),
          updatedAt: new Date(userById.updatedAt).toLocaleString(),
        }}
      >
        {({ values }) => (
          <form>
            <Box display="flex" flexDirection="column" gap="16px">
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Company Code"
                  value={values.companyCode}
                  disabled
                />
              )}

              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Name"
                  value={values.name}
                  disabled
                />
              )}

              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Email"
                  value={values.email}
                  disabled
                />
              )}

              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Phone"
                  value={values.phone || "N/A"}
                  disabled
                />
              )}

              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Role"
                  value={values.role}
                  disabled
                />
              )}

              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Status"
                  value={values.status || "N/A"}
                  disabled
                />
              )}

              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Created At"
                  value={values.createdAt}
                  disabled
                />
              )}

              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Updated At"
                  value={values.updatedAt}
                  disabled
                />
              )}
            </Box>

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/users/edit-user/${userById._id}`}
                disabled={isLoading} // Disable button if loading
              >
                Edit User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ViewUserNew;
