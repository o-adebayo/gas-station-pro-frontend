import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { Email } from "@mui/icons-material";
import { forgotUserPassword, RESET } from "../../redux/features/auth/authSlice";

// Yup validation schema
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const ForgotNew = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    const { email } = values;

    try {
      await dispatch(forgotUserPassword({ email }));
      await dispatch(RESET());
      toast.success("Reset password email sent successfully.");
      resetForm();
    } catch (error) {
      toast.error("Failed to send reset password email. Please try again.");
    }
  };

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
          maxWidth: "450px", // Matches the login card width
          textAlign: "center",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Optional: add shadow to match style
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Email size={35} color={theme.palette.text.secondary} />
          <Typography variant="h4" textAlign="center" mt={2}>
            Forgot Password
          </Typography>
        </Box>

        <Formik
          initialValues={{ email: "" }}
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
                    <Box component="span" mr={1}>
                      <Email color={theme.palette.text.secondary} />
                    </Box>
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
                {isLoading ? <CircularProgress size={24} /> : "Get Reset Email"}
              </Button>
            </form>
          )}
        </Formik>

        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Link
            to="/"
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
            }}
          >
            Home
          </Link>
          <Link
            to="/login"
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotNew;
