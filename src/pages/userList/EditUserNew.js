import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Avatar,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup"; // For validation
import {
  fetchUserById,
  updateUserProfileByAdmin,
} from "../../redux/features/auth/authSlice";
import HeaderNew from "../../components/HeaderNew";
import Loader from "../../components/loader/Loader";
import {
  fetchStoreLocations,
  selectStores,
} from "../../redux/features/storeLocation/storeLocationSlice"; // Updated import for fetching stores
import { Visibility, VisibilityOff } from "@mui/icons-material"; // For hide/show password

const EditUserNew = () => {
  const { id } = useParams(); // Get user ID from URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.auth.isLoading); // Loading state
  const userById = useSelector((state) => state.auth.userById); // Select user fetched by ID from Redux state
  //const stores = useSelector((state) => state.storeLocation.stores); // Select stores fetched by company code
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  useEffect(() => {
    // Fetch user by ID when the component mounts
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Fetch the stores for the user's company code when the user is loaded
    if (userById && userById.companyCode) {
      dispatch(fetchStoreLocations()); // Fetch stores based on companyCode
    }
  }, [dispatch, userById]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    role: Yup.string().required("Role is required"),
    status: Yup.string().required("Status is required"),
    storeId: Yup.string().required("Please select a store"),
    password: Yup.string().min(6, "Password should be at least 6 characters"), // Optional, but minimum of 6 characters if provided
  });

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If loading, show a loader
  if (isLoading) {
    return <Loader />;
  }

  // If user is not found or something went wrong
  if (!userById) {
    return (
      <Typography variant="h6" color="error">
        User not found or something went wrong.
      </Typography>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <HeaderNew
        title="EDIT USER"
        subtitle={`Editing details for ${userById.name}`}
      />

      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <Avatar
          src={userById?.photo?.filePath || "/default-profile.png"}
          alt="User Profile"
          sx={{ width: 100, height: 100 }}
        />
      </Box>

      <Formik
        enableReinitialize={true}
        initialValues={{
          companyCode: userById.companyCode || "",
          name: userById.name || "",
          email: userById.email || "",
          phone: userById.phone || "",
          role: userById.role || "",
          status: userById.status || "inactive",
          storeId: userById.storeId || "",
          password: "", // New password field
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const updatedData = { ...values };
            console.log("🚀 ~ onSubmit={ ~ updatedData:", updatedData);
            await dispatch(updateUserProfileByAdmin({ id, updatedData }));
            navigate("/users"); // Redirect back to the user view page
          } catch (error) {
            setErrors({ submit: error.message || "Something went wrong" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="16px">
              <TextField
                fullWidth
                variant="filled"
                label="Company Code"
                value={values.companyCode}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                label="Phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
              {/* Role dropdown */}
              <FormControl fullWidth variant="filled">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  error={touched.role && Boolean(errors.role)}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
              {/* Store dropdown */}
              <FormControl fullWidth variant="filled">
                <InputLabel id="storeId-label">Store</InputLabel>
                <Select
                  labelId="storeId-label"
                  name="storeId"
                  value={values.storeId}
                  onChange={handleChange}
                  error={touched.storeId && Boolean(errors.storeId)}
                >
                  {/* Check if stores is defined and is an array before mapping */}
                  {stores && stores.length > 0 ? (
                    stores.map((store) => (
                      <MenuItem key={store._id} value={store._id}>
                        {store.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No stores available</MenuItem>
                  )}
                </Select>
              </FormControl>
              {/* Status dropdown */}
              <FormControl fullWidth variant="filled">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  error={touched.status && Boolean(errors.status)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
              {/* Password field with visibility toggle */}
              <TextField
                fullWidth
                variant="filled"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handlePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errors.submit && (
                <Typography color="error" variant="body2">
                  {errors.submit}
                </Typography>
              )}
              <Button type="submit" variant="contained" color="primary">
                Update User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditUserNew;
