import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, selectUser } from "../../redux/features/auth/authSlice";
import {
  selectStores,
  selectIsLoading as selectStoreLoading,
  fetchStoreLocations,
} from "../../redux/features/storeLocation/storeLocationSlice";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import Loader from "../../components/loader/Loader";

// Utility function to shorten text if needed
export const shortenText = (text, n) => {
  return text.length > n ? `${text.substring(0, n)}...` : text;
};

const ProfileNew = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const {
    isLoading: isUserLoading,
    isLoggedIn,
    user,
  } = useSelector((state) => state.auth);
  const storeLocations = useSelector(selectStores);
  const isStoreLoading = useSelector(selectStoreLoading);

  const initialState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    storeId: user?.storeId || "",
    photo: user?.photo || "",
    role: user?.role || "",
    status: user?.status || false,
  };

  const [profile, setProfile] = useState(initialState);

  // Fetch user and store data when the component mounts
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUser()); // Fetch user data on mount
      dispatch(fetchStoreLocations()); // Fetch store details based on logged-in user
    }
  }, [isLoggedIn, dispatch]);

  // Update profile state when user data changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        storeId: user?.storeId,
        photo: user?.photo || "", // Access filePath from photo object
        role: user?.role,
        status: user?.status,
      });
    }
  }, [user]);

  // If loading user data, show a loader
  if (isUserLoading || isStoreLoading) {
    return <CircularProgress />;
  }

  return (
    <Box m="20px">
      {!user ? (
        <Typography variant="h6" color="error">
          Something went wrong, please reload the page...
        </Typography>
      ) : (
        <Card sx={{ maxWidth: 600, margin: "auto" }}>
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={3}
            >
              <Avatar
                src={profile?.photo?.filePath || "/default-profile.png"}
                alt="Profile"
                sx={{ width: 100, height: 100 }}
              />
            </Box>
            <Box display="flex" flexDirection="column" gap={2} mb={3}>
              <Typography variant="h6">
                <strong>Name: </strong> {profile?.name}
              </Typography>
              <Typography variant="h6">
                <strong>Email: </strong> {profile?.email}
              </Typography>
              <Typography variant="h6">
                <strong>Phone: </strong> {profile?.phone}
              </Typography>
              <Typography variant="h6">
                <strong>Role: </strong> {profile?.role}
              </Typography>
              <Typography variant="h6">
                <strong>Store: </strong> {storeLocations?.store?.name || "N/A"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/edit-profile"
              >
                Edit Profile
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProfileNew;
