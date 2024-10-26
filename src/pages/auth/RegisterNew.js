import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import { TiUserAddOutline } from "react-icons/ti";
import { Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, RESET } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BsCheck2All } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";

const RegisterNew = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess } = useSelector((state) => state.auth);

  // Password strength validation states
  const [uCase, setUCase] = useState(false);
  const [num, setNum] = useState(false);
  const [sChar, setSChar] = useState(false);
  const [passLength, setPassLength] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const timesIcon = <FaTimes color="red" size={15} />;
  const checkIcon = <BsCheck2All color="green" size={15} />;

  // Yup validation schema for the form
  const validationSchema = yup.object().shape({
    companyCode: yup.string().required("Company Code is required"),
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required")
      .matches(
        /([a-z].*[A-Z])|([A-Z].*[a-z])/,
        "Password must have upper and lower case"
      )
      .matches(/\d/, "Password must contain a number")
      .matches(
        /([!,%,&,@,#,$,^,*,?,_,~])/,
        "Password must have a special character"
      ),
    password2: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Password validation function
  const validatePasswordStrength = (password) => {
    setUCase(/([a-z].*[A-Z])|([A-Z].*[a-z])/.test(password));
    setNum(/\d/.test(password));
    setSChar(/([!,%,&,@,#,$,^,*,?,_,~])/.test(password));
    setPassLength(password.length > 5);
  };

  const handleRegister = async (values) => {
    const userData = {
      companyCode: values.companyCode,
      name: values.name,
      email: values.email,
      password: values.password,
    };

    await dispatch(register(userData));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
    dispatch(RESET());
  }, [isSuccess, dispatch, navigate]);

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: theme.palette.background.default }} //BACKGROUND COLOUR OF THE PAGE IN CASE WE WANT TO CHANGE IT
    >
      <Card sx={{ padding: 4, width: "100%", maxWidth: "500px" }}>
        {isLoading && <Loader />}
        <Box display="flex" justifyContent="center" mb={2}>
          <TiUserAddOutline size={35} color="#999" />
        </Box>
        <Typography variant="h4" textAlign="center" mb={3}>
          Register
        </Typography>

        <Formik
          initialValues={{
            companyCode: "",
            name: "",
            email: "",
            password: "",
            password2: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
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
                label="Company Code"
                variant="filled"
                name="companyCode"
                value={values.companyCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.companyCode && Boolean(errors.companyCode)}
                helperText={touched.companyCode && errors.companyCode}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Name"
                variant="filled"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                variant="filled"
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
                label="Password"
                variant="filled"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={(e) => {
                  handleChange(e);
                  validatePasswordStrength(e.target.value);
                }}
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

              <TextField
                fullWidth
                label="Confirm Password"
                variant="filled"
                name="password2"
                type={showConfirmPassword ? "text" : "password"}
                value={values.password2}
                onChange={handleChange}
                onBlur={handleBlur}
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
                sx={{ mb: 2 }}
              />

              <Box mb={2}>
                <Typography variant="subtitle2">
                  Password must contain:
                </Typography>
                <Box display="flex" alignItems="center">
                  {uCase ? checkIcon : timesIcon}
                  <Typography variant="body2" ml={1}>
                    Uppercase & Lowercase Letters
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  {num ? checkIcon : timesIcon}
                  <Typography variant="body2" ml={1}>
                    Number (0-9)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  {sChar ? checkIcon : timesIcon}
                  <Typography variant="body2" ml={1}>
                    Special Character (!@#$%^&)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  {passLength ? checkIcon : timesIcon}
                  <Typography variant="body2" ml={1}>
                    At least 6 characters
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Register
              </Button>
            </form>
          )}
        </Formik>
        <Box mt={2} textAlign="center" display="flex" justifyContent="center">
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Already have an account?
            <Link
              to="/login"
              style={{
                color: theme.palette.primary.main,
                textDecoration: "none",
                marginLeft: "4px",
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

export default RegisterNew;
