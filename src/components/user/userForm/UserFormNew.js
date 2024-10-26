import React from "react";
import { Box, Button, TextField, MenuItem, IconButton } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Close as CloseIcon } from "@mui/icons-material";
import HeaderNew from "../../HeaderNew";

// Define Yup validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required("User name is required"),
  email: yup.string().email("Invalid email").required("User email is required"),
  role: yup.string().required("User role is required"),
  storeName: yup.string().notRequired(),
  phone: yup
    .string()
    .matches(
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      "Invalid phone number"
    )
    .required("Phone number is required"),
});

// Define initial form values
const initialValues = {
  name: "",
  email: "",
  role: "",
  storeName: "",
  phone: "",
};

const UserFormNew = ({
  saveUser,
  stores,
  imagePreview,
  handleImageChange,
  setImagePreview, // Pass in a setter for imagePreview
  setUserImage, // Pass in a setter for userImage
}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Handle removing the selected image
  const handleRemoveImage = () => {
    setImagePreview(null); // Reset the image preview
    setUserImage(null); // Reset the user image file
  };

  const handleFormSubmit = (values) => {
    saveUser(values);
  };

  return (
    <Box m="20px">
      <HeaderNew
        title="ADD NEW USER"
        subtitle="Fill out the form to add a new user"
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="User Name"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="User Email"
                name="email"
                type="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                select
                variant="filled"
                label="User Role"
                name="role"
                value={values.role}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>

              <TextField
                fullWidth
                select
                variant="filled"
                label="Store Name"
                name="storeName"
                value={values.storeName}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.storeName && !!errors.storeName}
                helperText={touched.storeName && errors.storeName}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="">Select Store</MenuItem>
                {stores.map((store) => (
                  <MenuItem key={store._id} value={store.name}>
                    {store.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                label="Phone Number"
                name="phone"
                value={values.phone}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 4" }}
              />

              <Box sx={{ gridColumn: "span 4" }}>
                <label>User Profile Picture</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "block", marginTop: "10px" }}
                />
                {imagePreview ? (
                  <div
                    className="image-preview"
                    style={{ position: "relative" }}
                  >
                    <img
                      src={imagePreview}
                      alt="User profile"
                      style={{ maxWidth: "100px", marginTop: "10px" }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        backgroundColor: "red",
                        border: "1px solid #ccc",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ) : (
                  <p>No image set for this user.</p>
                )}
              </Box>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Save User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default UserFormNew;
