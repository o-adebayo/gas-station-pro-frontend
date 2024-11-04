import React, { useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CircularProgress,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import { MdPassword } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RESET, resetUserPassword } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

// Yup validation schema
const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetNew = () => {
  const theme = useTheme();
  const { resetToken } = useParams();
  const { isLoading, isSuccess, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle password reset form submission
  const handlePasswordReset = async (values) => {
    const { password } = values;
    try {
      await dispatch(resetUserPassword({ password, resetToken })).unwrap();
      toast.success("Password reset successful!");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  };

  // Redirect after success
  useEffect(() => {
    if (isSuccess && message.includes("Reset Successful")) {
      navigate("/login");
    }
    dispatch(RESET());
  }, [dispatch, navigate, isSuccess, message]);

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
          <MdPassword size={35} color="#999" />
          <Typography variant="h4" textAlign="center" mt={2}>
            Reset Password
          </Typography>
        </Box>

        <Formik
          initialValues={{ password: "", password2: "" }}
          validationSchema={validationSchema}
          onSubmit={handlePasswordReset}
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
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Confirm Password"
                name="password2"
                type="password"
                value={values.password2}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password2 && Boolean(errors.password2)}
                helperText={touched.password2 && errors.password2}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 3 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Reset Password"}
              </Button>

              <Box
                textAlign="center"
                mt={2}
                display="flex"
                justifyContent="center"
                gap={1}
              >
                <MuiLink
                  component={Link}
                  to="/"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Home
                </MuiLink>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  &nbsp; | &nbsp;
                </Typography>
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Login
                </MuiLink>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
};
export default ResetNew;
