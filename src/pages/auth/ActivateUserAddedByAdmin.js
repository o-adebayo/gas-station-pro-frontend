import React, { useEffect, useState } from "react";
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
import { FaTimes } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";

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

  // Password strength validation states
  const [uCase, setUCase] = useState(false);
  const [num, setNum] = useState(false);
  const [sChar, setSChar] = useState(false);
  const [passLength, setPassLength] = useState(false);

  // Variables for password strength checker icons
  const timesIcon = <FaTimes color="red" size={15} />;
  const checkIcon = <BsCheck2All color="green" size={15} />;

  // Function to switch icons for password strength checker
  const switchIcon = (condition) => {
    return condition ? checkIcon : timesIcon;
  };

  // Monitor text entry and update the password strength checker icons
  useEffect(() => {
    // Check Lower and Uppercase
    setUCase(/([a-z].*[A-Z])|([A-Z].*[a-z])/.test(password));
    // Check for numbers
    setNum(/\d/.test(password));
    // Check for special character
    setSChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    // Check for password length
    setPassLength(password.length >= 6);
  }, [password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const activate = async (e) => {
    e.preventDefault();
    //console.log(formData);
    //console.log(activationToken);

    // Check if all password strength requirements are met
    if (!uCase || !num || !sChar || !passLength) {
      return toast.error(
        "Password strength not met. Please meet all criteria."
      );
    }

    if (password !== password2) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      password,
      password2,
    };

    try {
      // Dispatch the activation action with both userData and token
      const data = await dispatch(
        activateUserAccountAddedByAdmin({ userData, activationToken })
      );
      await dispatch(RESET(userData));
      //await dispatch(SET_LOGIN(false));
      //await dispatch(SET_NAME(data.name));

      //setIsLoading(false);
      toast.success(data.message);
      //toast.success("Account activated successfully, please login");
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
              placeholder="Confirm Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
              onPaste={(e) => {
                e.preventDefault();
                toast.error("Cannot paste into input field");
                return false;
              }}
            />

            {/* Password Strength Checker */}
            <Card cardClass={styles.group}>
              <ul className="form-list">
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(uCase)} &nbsp; Lowercase & Uppercase
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(num)} &nbsp; Number (0-9)
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(sChar)} &nbsp; Special character (!@#$%^&*)
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(passLength)} &nbsp; At least 6 characters
                  </span>
                </li>
              </ul>
            </Card>

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
