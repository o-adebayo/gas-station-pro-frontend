import React, { useEffect, useState } from "react";
import "./Profile.scss";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, selectUser } from "../../redux/features/auth/authSlice";
import { SpinnerImg } from "../../components/loader/Loader";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import {
  // Import the action to get store by user
  selectStores,
  selectIsLoading as selectStoreLoading,
  fetchStoreLocations, // Select store loading state
} from "../../redux/features/storeLocation/storeLocationSlice";

export const shortenText = (text, n) => {
  if (text.length > n) {
    return text.substring(0, n).concat("...");
  }
  return text;
};

const Profile = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const {
    isLoading: isUserLoading,
    isLoggedIn,
    user,
  } = useSelector((state) => state.auth);

  const storeLocations = useSelector(selectStores); // Select the store location from Redux
  const isStoreLoading = useSelector(selectStoreLoading); // Select store loading state
  //console.log("store location", storeLocations);

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
        photo: user?.photo,
        role: user?.role,
        status: user?.status,
      });
    }
  }, [user]);

  return (
    <div className="profile --my2">
      {(isUserLoading || isStoreLoading) && <SpinnerImg />}{" "}
      {/* Show spinner while loading */}
      {!isUserLoading && !user ? (
        <p>Something went wrong, please reload the page...</p>
      ) : (
        <Card cardClass={"card --flex-dir-column"}>
          <span className="profile-photo">
            <img src={profile?.photo} alt="Profilepic" />
          </span>
          <span className="profile-data">
            <p>
              <b>Name: </b> {profile?.name}
            </p>
            <p>
              <b>Email: </b> {profile?.email}
            </p>
            <p>
              <b>Phone: </b> {profile?.phone}
            </p>
            <p>
              <b>Role: </b> {profile?.role}
            </p>
            <p>
              <b>Store: </b> {storeLocations?.store?.name || "N/A"}{" "}
              {/* Display the fetched store name */}
            </p>
            <div className="">
              <Link to="/edit-profile">
                <button className="text-med navigation__cta">
                  Edit Profile
                </button>
              </Link>
            </div>
          </span>
        </Card>
      )}
    </div>
  );
};

// Get the user's name and display it in the Header component
export const UserName = () => {
  const user = useSelector(selectUser);

  const username = user?.name || "...";

  return (
    <h3>
      <span className="--color-white">Hi, </span>
      <span className="--color-danger">{shortenText(username, 10)}</span>
    </h3>
  );
};

export default Profile;
