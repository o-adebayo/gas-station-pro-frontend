import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  logout,
  RESET,
  selectUser,
  //SET_LOGIN,
} from "../../redux/features/auth/authSlice";
import { UserName } from "../../pages/profile/Profile";
import { SuperAdminLink } from "../protect/HiddenLink";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  //const name = user?.name;

  const logoutUser = async () => {
    dispatch(RESET());
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="--pad header">
      <div className="--flex-between">
        {/* <h3>
          <span className="--fw-thin">Hi, </span>
          <span className="--color-danger">{name}</span>
        </h3> */}
        <UserName />
        <div className="button-group">
          {" "}
          {/* New container for buttons */}
          <button onClick={logoutUser} className="text-med navigation__cta">
            Logout
          </button>
          <SuperAdminLink>
            <Link to="/add-company">
              <button className="--btn --btn-primary">Add Company</button>
            </Link>
          </SuperAdminLink>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Header;
