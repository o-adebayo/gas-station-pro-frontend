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
import { BiLogIn } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  login,
  RESET,
  sendUserLoginCode,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginNew = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, isSuccess, isError, twoFactor } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Add email state

  // Yup validation schema for login form
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });

  const handleLogin = async (values) => {
    const userData = {
      email: values.email,
      password: values.password,
    };

    setEmail(values.email); // Store email in state for later use
    await dispatch(login(userData));
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/dashboard");
    }

    if (isError && twoFactor) {
      dispatch(sendUserLoginCode(email)); // Use email from state
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
      sx={{ backgroundColor: theme.palette.background.default }} //BACKGROUND COLOUR OF THE PAGE IN CASE WE WANT TO CHANGE IT
    >
      {isLoading && <CircularProgress />}
      <Card sx={{ padding: 4, width: "100%", maxWidth: "400px" }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <BiLogIn size={35} color={theme.palette.text.secondary} />
          <Typography variant="h4" textAlign="center" mt={2}>
            Login
          </Typography>
        </Box>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
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
                variant="filled"
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
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
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 3 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Login"}
              </Button>

              <Typography
                variant="body2"
                textAlign="center"
                mt={2}
                sx={{ color: "text.secondary" }}
              >
                Forgot your password?{" "}
                <Link
                  to="/forgotpassword"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                  }}
                >
                  Click here
                </Link>
              </Typography>

              <Box
                mt={2}
                textAlign="center"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Don&apos;t have an account?{" "}
                </Typography>
                <Link
                  to="/register"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    marginLeft: "4px", // Optional: Adds a slight space between the text and the link
                  }}
                >
                  Register
                </Link>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
};

export default LoginNew;
