import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Avatar,
  useTheme,
  Divider,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  updateUserProfile,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import {
  fetchStoreLocations,
  selectStores,
} from "../../redux/features/storeLocation/storeLocationSlice";
import HeaderNew from "../../components/HeaderNew";
import ChangePasswordNew from "../../components/changePassword/ChangePasswordNew";

const EditProfileNew = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector((state) => state.auth);
  const storeLocations = useSelector(selectStores); // Fetch store locations
  const theme = useTheme();

  // Yup validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    phone: yup
      .string()
      .matches(
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
        "Invalid phone number"
      )
      .required("Phone number is required"),
  });

  // Initial state for Formik
  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    photo: user?.photo?.filePath || "",
    storeId: user?.storeId || "",
    role: user?.role || "",
    status: user?.status || false,
  };

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialValues.photo);

  // Fetch user and store data when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
    dispatch(fetchStoreLocations());
  }, [dispatch, user]);

  // Update Formik values when user data changes
  useLayoutEffect(() => {
    if (user) {
      setImagePreview(user?.photo?.filePath || "/default-profile.png");
    }
  }, [user]);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
    setFieldValue("photo", file); // Update the Formik field value
  };

  const saveProfile = async (values) => {
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);

      // Append the image if a new one is selected
      if (profileImage) {
        formData.append("photo", profileImage);
      }

      // Dispatch the updateUserProfile action with the form data
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Get store name from storeLocations
  const storeName = storeLocations?.store?.name || "N/A";

  return (
    <Box m="20px">
      {isLoading && <Loader message="Updating profile details..." />}
      <HeaderNew
        title="Edit Profile"
        subtitle="Manage your profile information"
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={saveProfile}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                alt="Profile Photo"
                src={imagePreview || "/default-profile.png"}
                sx={{ width: 100, height: 100, mb: 3 }}
              />
              <Button
                variant="contained"
                component="label"
                sx={{ mb: 3 }} // Adjusted margin for spacing
              >
                Upload New Profile Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
              </Button>

              <TextField
                fullWidth
                variant="filled"
                label="Name"
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
                label="Email"
                name="email"
                value={values.email}
                disabled
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Role"
                name="role"
                value={values.role}
                disabled
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Store"
                value={storeName}
                disabled
                sx={{ mb: 2 }}
              />

              <Box display="flex" justifyContent="flex-end" width="100%">
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
      {/* Add a Divider between Edit Profile and Change Password */}
      <Divider sx={{ my: 3 }} /> {/* Adds a margin around the divider */}
      <Box mt={4}>
        <ChangePasswordNew />
      </Box>
    </Box>
  );
};

export default EditProfileNew;
