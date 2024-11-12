import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Card,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Visibility,
  VisibilityOff,
  Login,
  Email,
  Lock,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  login,
  RESET,
  sendUserLoginCode,
} from "../../redux/features/auth/authSlice";

const LoginNew = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, isSuccess, isError, twoFactor } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // Track step for email or password entry
  const [email, setEmail] = useState(""); // Track email across steps

  // Yup validation schema
  const emailSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const passwordSchema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });

  const handleEmailSubmit = (values) => {
    setEmail(values.email);
    setStep(2); // Move to password step
  };

  const handlePasswordSubmit = async (values) => {
    const userData = { email, password: values.password };
    await dispatch(login(userData));
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/dashboard");
    }

    if (isError && twoFactor) {
      dispatch(sendUserLoginCode(email));
      navigate(`/loginWithCode/${email}`);
    }

    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate, isError, twoFactor, email]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Card
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: "450px",
          textAlign: "center",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional: add shadow to match style
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Login size={50} color={theme.palette.primary.main} />
          <Typography variant="h4" textAlign="center" mt={2}>
            Log in to GasStationPro
          </Typography>
        </Box>

        {step === 1 ? (
          // Step 1: Email input
          <Formik
            initialValues={{ email: "" }}
            validationSchema={emailSchema}
            onSubmit={handleEmailSubmit}
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
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color={theme.palette.text.secondary} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mt: 2 }}
                >
                  Continue
                </Button>
              </form>
            )}
          </Formik>
        ) : (
          // Step 2: Password input
          <Formik
            initialValues={{ password: "" }}
            validationSchema={passwordSchema}
            onSubmit={handlePasswordSubmit}
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
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" /> {/* Lock icon added here */}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mt: 2 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Log In"}
                </Button>

                {/* Back and Forgot Password Links */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={2}
                  px={1}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.primary.main,
                      cursor: "pointer",
                    }}
                    onClick={() => setStep(1)} // Go back to email input
                  >
                    Back
                  </Typography>
                  <Link
                    to="/forgotpassword"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </form>
            )}
          </Formik>
        )}
      </Card>
    </Box>
  );
};

export default LoginNew;
