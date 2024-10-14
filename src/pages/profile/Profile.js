import React, { useEffect, useState } from "react";
import "./Profile.scss";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, selectUser } from "../../redux/features/auth/authSlice";
import { SpinnerImg } from "../../components/loader/Loader";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";

export const shortenText = (text, n) => {
  if (text.length > n) {
    return text.substring(0, n).concat("...");
  }
  return text;
};

const Profile = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { isLoading, isLoggedIn, isSuccess, message, user } = useSelector(
    (state) => state.auth
  );

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

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUser());
    }
  }, [isLoggedIn, dispatch]);

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
      {isLoading && <SpinnerImg />}
      {!isLoading && !user ? (
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
              <b>Store: </b> {profile?.storeId}
            </p>
            <div className="">
              <Link to="/edit-profile">
                <button className="--btn --btn-primary">Edit Profile</button>
              </Link>
            </div>
          </span>
        </Card>
      )}
    </div>
  );
};

//get the user and grab the user's name
// then just use the UserName on the Header.js file
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
