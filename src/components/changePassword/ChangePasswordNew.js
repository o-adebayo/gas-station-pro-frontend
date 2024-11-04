import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { changeUserPassword, RESET } from "../../redux/features/auth/authSlice";
import { sendAutomatedEmail } from "../../redux/features/email/emailSlice";
import Loader from "../loader/Loader";
import Card from "../card/Card";

const ChangePasswordNew = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, user } = useSelector((state) => state.auth);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Yup validation schema for password change
  const validationSchema = yup.object().shape({
    oldPassword: yup.string().required("Old Password is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("New Password is required"),
    password2: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm New Password is required"),
  });

  const handlePasswordChange = async (values) => {
    const { oldPassword, password } = values;

    const formData = { oldPassword, password };

    const emailData = {
      subject: "Gas Station Pro Account Password Changed",
      send_to: user?.email,
      reply_to: "noreply@gaststationpro.com",
      template: "passwordChangedEmail",
      url: "/forgotpassword",
    };

    try {
      await dispatch(changeUserPassword(formData)).unwrap();
      await dispatch(sendAutomatedEmail(emailData));
      await dispatch(RESET());
      toast.success("Password changed successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    }
  };

  return (
    <Box m="20px">
      <Card cardClass={"password-card"}>
        <Typography variant="h4" mb={2}>
          Change Password
        </Typography>

        <Formik
          initialValues={{ oldPassword: "", password: "", password2: "" }}
          validationSchema={validationSchema}
          onSubmit={handlePasswordChange}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Old Password"
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={values.oldPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.oldPassword && Boolean(errors.oldPassword)}
                  helperText={touched.oldPassword && errors.oldPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="New Password"
                  name="password"
                  type={showNewPassword ? "text" : "password"}
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Confirm New Password"
                  name="password2"
                  type={showConfirmPassword ? "text" : "password"}
                  value={values.password2}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.password2 && Boolean(errors.password2)}
                  helperText={touched.password2 && errors.password2}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" color="primary" variant="contained">
                  {isLoading ? <CircularProgress /> : "Change Password"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
};

export default ChangePasswordNew;
