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
import { AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
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
      sx={{ backgroundColor: theme.palette.background.default }} //BACKGROUND COLOUR OF THE PAGE IN CASE WE WANT TO CHANGE IT
    >
      {isLoading && <CircularProgress />}
      <Card sx={{ padding: 4, width: "100%", maxWidth: "400px" }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <AiOutlineMail size={35} color={theme.palette.text.secondary} />
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
                variant="filled"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 3 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Get Reset Email"}
              </Button>
            </form>
          )}
        </Formik>

        <Box
          mt={2}
          textAlign="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
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
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: theme.palette.primary.main,
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotNew;
