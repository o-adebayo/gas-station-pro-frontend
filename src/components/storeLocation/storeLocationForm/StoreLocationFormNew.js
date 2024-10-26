import React, { useEffect } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  selectUsers,
} from "../../../redux/features/auth/authSlice";
import HeaderNew from "../../HeaderNew";

// Define Yup validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required("Store name is required"),
  location: yup.string().required("Location is required"),
  pumps: yup.number().required("Number of pumps is required").positive(),
  nozzles: yup.number().required("Number of nozzles is required").positive(),
  tanks: yup.number().required("Number of tanks is required").positive(),
  managerEmail: yup.string().email("Invalid email").notRequired(),
  description: yup.string().notRequired(),
});

// Define initial form values
const initialValues = {
  name: "",
  location: "",
  pumps: "",
  nozzles: "",
  tanks: "",
  managerEmail: "",
  description: "",
};

const StoreLocationFormNew = ({
  saveStoreLocation, // Function to save the store
  imagePreview, // Preview for selected image
  handleImageChange, // Image change handler
  setImagePreview, // Setter for image preview
  setStoreImage, // Setter for the actual image
}) => {
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Fetch users when the component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const users = useSelector(selectUsers) || []; // Get the users from the Redux store

  const handleFormSubmit = (values) => {
    saveStoreLocation(values); // Save store location when form is submitted
  };

  // Function to handle image removal
  const handleRemoveImage = () => {
    setImagePreview(null); // Remove image preview
    setStoreImage(null); // Remove the actual image file
  };

  return (
    <Box m="20px">
      <HeaderNew title="ADD STORE" subtitle="Add a new store location" />

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
              {/* Store Image Upload */}
              <Box sx={{ gridColumn: "span 4" }}>
                <label>Store Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "block", marginTop: "10px" }}
                />
                {imagePreview ? (
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="store location"
                      style={{ maxWidth: "100px", marginTop: "10px" }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleRemoveImage}
                      style={{ marginTop: "10px" }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <p>No image set for this store location.</p>
                )}
              </Box>

              {/* Store Name */}
              <TextField
                fullWidth
                variant="filled"
                label="Store Name"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Location */}
              <TextField
                fullWidth
                variant="filled"
                label="Location"
                name="location"
                value={values.location}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.location && !!errors.location}
                helperText={touched.location && errors.location}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Number of Pumps */}
              <TextField
                fullWidth
                variant="filled"
                label="Number of Pumps"
                name="pumps"
                type="number"
                value={values.pumps}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.pumps && !!errors.pumps}
                helperText={touched.pumps && errors.pumps}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Number of Nozzles */}
              <TextField
                fullWidth
                variant="filled"
                label="Number of Nozzles"
                name="nozzles"
                type="number"
                value={values.nozzles}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.nozzles && !!errors.nozzles}
                helperText={touched.nozzles && errors.nozzles}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Number of Tanks */}
              <TextField
                fullWidth
                variant="filled"
                label="Number of Tanks"
                name="tanks"
                type="number"
                value={values.tanks}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.tanks && !!errors.tanks}
                helperText={touched.tanks && errors.tanks}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Store Manager Email */}
              <TextField
                fullWidth
                select
                variant="filled"
                label="Store Manager Email"
                name="managerEmail"
                value={values.managerEmail}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.managerEmail && !!errors.managerEmail}
                helperText={touched.managerEmail && errors.managerEmail}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="">Select Manager Email</MenuItem>
                {users
                  .filter((user) => user.role === "manager")
                  .map((manager) => (
                    <MenuItem key={manager._id} value={manager.email}>
                      {manager.email}
                    </MenuItem>
                  ))}
              </TextField>

              {/* Store Description */}
              <TextField
                fullWidth
                variant="filled"
                label="Store Description"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                multiline
                rows={5}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Save Store
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default StoreLocationFormNew;
