import React, { useState } from "react";
import styles from "./auth.module.scss";
import { MdPassword } from "react-icons/md";
import Card from "../../components/card/Card";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { activateUserByAdmin } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  activateUserAccountAddedByAdmin,
  RESET,
  SET_LOGIN,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import PasswordInput from "../../components/passwordInput/PasswordInput";

const initialState = {
  password: "",
  password2: "",
};

const ActivateUserAddedByAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setformData] = useState(initialState);
  const { password, password2 } = formData;

  const { activationToken } = useParams();
  const { isLoading } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const activate = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log(activationToken);

    if (password.length < 6) {
      return toast.error("Passwords must be up to 6 characters");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      password,
      password2,
    };

    try {
      const data = await dispatch(
        activateUserAccountAddedByAdmin(userData, activationToken)
      );
      await dispatch(RESET(userData));
      //await dispatch(SET_LOGIN(false));
      //await dispatch(SET_NAME(data.name));

      //setIsLoading(false);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <MdPassword size={35} color="#999" />
          </div>
          <h2>Activate Account</h2>

          <form onSubmit={activate}>
            <PasswordInput
              placeholder="New Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            <PasswordInput
              placeholder="Confirm New Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
            />

            <button type="submit" className="--btn --btn-primary --btn-block">
              Activate Account
            </button>
            <div className={styles.links}>
              <p>
                <Link to="/">- Home</Link>
              </p>
              <p>
                <Link to="/login">- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ActivateUserAddedByAdmin;
