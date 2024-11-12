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
  Grid,
} from "@mui/material";
import { GrInsecure } from "react-icons/gr";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import {
  RESET,
  sendUserLoginCode,
  userLoginWithCode,
} from "../../redux/features/auth/authSlice";

// Yup validation schema
const validationSchema = yup.object().shape({
  loginCode: yup
    .string()
    .length(6, "Access code must be 6 characters")
    .required("Please fill in the login code"),
});

const LoginWithCodeNew = () => {
  const theme = useTheme();
  const { email } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn, isSuccess } = useSelector(
    (state) => state.auth
  );

  // Function to resend login code
  const sendLoginCode = async () => {
    await dispatch(sendUserLoginCode(email));
    await dispatch(RESET());
    toast.success("Login code has been resent.");
  };

  // Function to handle form submission
  /*   const handleLoginWithCode = async (values) => {
    const { loginCode } = values;

    try {
      await dispatch(userLoginWithCode({ code: { loginCode }, email }));
      toast.success("Logged in successfully.");
    } catch (error) {
      toast.error("Failed to login with code. Please try again.");
    }
  }; */

  // Function to handle form submission
  const handleLoginWithCode = async (values) => {
    const { loginCode } = values;

    try {
      // Use unwrap to throw an error if the action is rejected
      await dispatch(
        userLoginWithCode({ code: { loginCode }, email })
      ).unwrap();
      toast.success("Logged in successfully.");
    } catch (error) {
      toast.error("Failed to login with code. Please try again.");
    }
  };

  // Redirect after successful login
  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/dashboard");
    }
    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      {isLoading && <CircularProgress />}
      <Card sx={{ padding: 4, width: "100%", maxWidth: "450px" }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <GrInsecure size={35} color="#999" />
          <Typography variant="h4" textAlign="center" mt={2}>
            Two-factor Authentication
          </Typography>
          <Typography textAlign="center" mt={1} color="textSecondary">
            Enter the six-digit access code from your email
          </Typography>
        </Box>

        <Formik
          initialValues={{ loginCode: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLoginWithCode}
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
              <Grid
                container
                spacing={1}
                justifyContent="center"
                sx={{ mb: 2 }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={2} key={index}>
                    <TextField
                      variant="outlined"
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center", fontSize: "1.5rem" },
                      }}
                      name={`loginCode[${index}]`}
                      value={values.loginCode[index] || ""}
                      onChange={(e) => {
                        const loginCodeArray = values.loginCode.split("");
                        loginCodeArray[index] = e.target.value;
                        handleChange({
                          target: {
                            name: "loginCode",
                            value: loginCodeArray.join(""),
                          },
                        });
                      }}
                      onBlur={handleBlur}
                      error={touched.loginCode && Boolean(errors.loginCode)}
                    />
                  </Grid>
                ))}
              </Grid>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2 }}
                disabled={isLoading || values.loginCode.length < 6}
              >
                {isLoading ? <CircularProgress size={24} /> : "Verify"}
              </Button>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={1}
                mt={2}
              >
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Didn’t receive a code?
                </Typography>
                <Button
                  onClick={sendLoginCode}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.getContrastText(
                      theme.palette.secondary.main
                    ),
                    fontSize: "0.75rem",
                    padding: "2px 6px",
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.light,
                    },
                  }}
                >
                  Resend Code
                </Button>
              </Box>

              <Box textAlign="center" mt={2}>
                <MuiLink
                  component={Link}
                  to="/"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                  }}
                >
                  Home
                </MuiLink>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
};
export default LoginWithCodeNew;
