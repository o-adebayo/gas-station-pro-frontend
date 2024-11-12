import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  Link as MuiLink,
  useTheme,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Password, Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  activateUserAccount,
  RESET,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const ActivateNew = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activationToken } = useParams();
  const { isLoading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Yup validation schema
  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    password2: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = await dispatch(activateUserAccount(activationToken));
      await dispatch(RESET());
      toast.success(data.message);
      navigate("/login");
      resetForm(); // Reset the form after successful activation
    } catch (error) {
      toast.error("Failed to activate account. Please try again.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: theme.palette.background.default }} //BACKGROUND COLOUR OF THE PAGE IN CASE WE WANT TO CHANGE IT
    >
      {isLoading && <Loader message="Activating user account..." />}
      <Card sx={{ padding: 4, width: "100%", maxWidth: "450px" }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Password fontSize="large" color="primary" />
          <Typography variant="h4" textAlign="center" mt={2}>
            Activate Account
          </Typography>
        </Box>

        <Formik
          initialValues={{ password: "", password2: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                label="New Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
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
              />

              <TextField
                fullWidth
                variant="filled"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="password2"
                value={values.password2}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password2 && Boolean(errors.password2)}
                helperText={touched.password2 && errors.password2}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
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

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mb: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Activate Account"
                )}
              </Button>
            </form>
          )}
        </Formik>

        <Box
          textAlign="center"
          mt={2}
          display="flex"
          justifyContent="center"
          gap={1}
          alignItems="center"
          flexWrap="wrap"
        >
          <MuiLink
            component={Link}
            to="/"
            underline="none"
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            Home
          </MuiLink>
          <Typography
            variant="body2"
            sx={{ color: (theme) => theme.palette.text.secondary }}
          >
            Already have an account?
          </Typography>
          <MuiLink
            component={Link}
            to="/login"
            underline="hover"
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            Login
          </MuiLink>
        </Box>
      </Card>
    </Box>
  );
};

export default ActivateNew;
