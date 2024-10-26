import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Card,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
//import Loader from "../../components/loader/Loader";
import { createCompany } from "../../redux/features/company/companySlice";

const CompanySignUpNew = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation(); // Access location to get the planType, planCycle, and email

  // Set initial form values
  const [initialValues, setInitialValues] = useState({
    name: "",
    address: "",
    ownerName: "",
    ownerEmail: "", // This will be filled by Hero page email
    phone: "",
    planType: "Gold", // Default to Gold, will be overwritten if passed
    planCycle: "Monthly", // Default to Monthly, will be overwritten if passed
  });

  // Prefill the ownerEmail, planType, and planCycle from Hero and PricingTile if available
  useEffect(() => {
    const { email, planType: plan, planCycle: cycle } = location.state || {};

    setInitialValues((prevValues) => ({
      ...prevValues,
      ownerEmail: email || prevValues.ownerEmail, // Prefill email from Hero.js
      planType: plan || prevValues.planType, // Prefill planType from PricingTile.js
      planCycle: cycle || prevValues.planCycle, // Prefill planCycle from PricingTile.js
    }));
  }, [location.state]);

  // Yup validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("Company name is required"),
    address: yup.string().required("Address is required"),
    ownerName: yup.string().required("Owner name is required"),
    ownerEmail: yup
      .string()
      .email("Invalid email")
      .required("Owner email is required"),
    phone: yup
      .string()
      .matches(
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
        "Invalid phone number"
      )
      .required("Phone number is required"),
    planType: yup.string().required("Plan type is required"),
    planCycle: yup.string().required("Plan cycle is required"),
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(createCompany(values));
      resetForm(); // Reset form after submission
      toast.success("Company created successfully!");
    } catch (error) {
      toast.error("Failed to create company. Please try again.");
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: theme.palette.background.default }} //BACKGROUND COLOUR OF THE PAGE IN CASE WE WANT TO CHANGE IT
    >
      <Card sx={{ padding: 4, width: "100%", maxWidth: "500px" }}>
        <Typography variant="h4" textAlign="center" mb={3}>
          Company Sign Up
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize // This ensures the form updates when initialValues change
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
                label="Company Name"
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
                variant="filled"
                label="Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Owner Name"
                name="ownerName"
                value={values.ownerName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ownerName && Boolean(errors.ownerName)}
                helperText={touched.ownerName && errors.ownerName}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Owner Email"
                name="ownerEmail"
                type="email"
                value={values.ownerEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ownerEmail && Boolean(errors.ownerEmail)}
                helperText={touched.ownerEmail && errors.ownerEmail}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Owner Phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
                <InputLabel>Plan Type</InputLabel>
                <Select
                  name="planType"
                  value={values.planType}
                  onChange={handleChange}
                >
                  <MenuItem value="Gold">Gold</MenuItem>
                  <MenuItem value="Platinum">Platinum</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="filled" sx={{ mb: 3 }}>
                <InputLabel>Plan Cycle</InputLabel>
                <Select
                  name="planCycle"
                  value={values.planCycle}
                  onChange={handleChange}
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Sign Up
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
            Already have a company code?{" "}
            <Link
              to="/register"
              style={{
                color: theme.palette.primary.main,
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default CompanySignUpNew;
