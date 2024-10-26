import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import {
  getStoreLocation,
  updateStoreLocation,
} from "../../redux/features/storeLocation/storeLocationSlice";
import { fetchUsers } from "../../redux/features/auth/authSlice"; // Assuming you have an action to fetch users
import HeaderNew from "../../components/HeaderNew";

// Yup validation schema
const validationSchema = yup.object().shape({
  storeName: yup.string().required("Store name is required"),
  storeLocation: yup.string().required("Store location is required"),
  pumps: yup
    .number()
    .min(1, "Must be greater than or equal to 1")
    .required("Pumps are required"),
  nozzles: yup
    .number()
    .min(1, "Must be greater than or equal to 1")
    .required("Nozzles are required"),
  tanks: yup
    .number()
    .min(1, "Must be greater than or equal to 1")
    .required("Tanks are required"),
  managerEmail: yup.string().notRequired("Manager email is required"),
});

const EditStoreNew = () => {
  const theme = useTheme();
  const { id } = useParams(); // Get store ID from URL params
  const dispatch = useDispatch();

  const [store, setStore] = useState(null);
  const [managers, setManagers] = useState([]); // State to store manager emails
  const { users } = useSelector((state) => state.auth); // Assuming users are in your auth slice

  useEffect(() => {
    if (id) {
      dispatch(getStoreLocation(id)).then((response) => {
        setStore(response.payload); // Assuming store data comes from response.payload
      });
    }
    // Fetch users (managers) for the dropdown
    dispatch(fetchUsers());
  }, [dispatch, id]);

  useEffect(() => {
    // Filter managers from users
    const managerList = users
      .filter(
        (user) =>
          user.role === "manager" && user.companyCode === store?.companyCode
      )
      .map((manager) => manager.email);
    setManagers(managerList);
  }, [users, store]);

  if (!store) return <Typography>Loading store details...</Typography>;

  return (
    <Box m="1.5rem 2.5rem">
      <HeaderNew
        title="EDIT STORE"
        subtitle={`Editing details for ${store.name}`}
      />

      <Formik
        enableReinitialize={true} // Allow form to update when initialValues change
        initialValues={{
          storeName: store.name || "",
          storeLocation: store.location || "",
          pumps: store.pumps || 0,
          nozzles: store.nozzles || 0,
          tanks: store.tanks || 0,
          managerEmail: "", // Manager email will be selected from the dropdown
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // Submit logic here (update store details)
          console.log("Form Submitted:", values);
          dispatch(updateStoreLocation());
          // You can dispatch an updateStore action here
        }}
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
            <Box display="flex" flexDirection="column" gap="16px">
              <TextField
                fullWidth
                variant="filled"
                label="Store Name"
                name="storeName"
                value={values.storeName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.storeName && Boolean(errors.storeName)}
                helperText={touched.storeName && errors.storeName}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Store Location"
                name="storeLocation"
                value={values.storeLocation}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.storeLocation && Boolean(errors.storeLocation)}
                helperText={touched.storeLocation && errors.storeLocation}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Pumps"
                name="pumps"
                type="number"
                value={values.pumps}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.pumps && Boolean(errors.pumps)}
                helperText={touched.pumps && errors.pumps}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Nozzles"
                name="nozzles"
                type="number"
                value={values.nozzles}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.nozzles && Boolean(errors.nozzles)}
                helperText={touched.nozzles && errors.nozzles}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Tanks"
                name="tanks"
                type="number"
                value={values.tanks}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.tanks && Boolean(errors.tanks)}
                helperText={touched.tanks && errors.tanks}
              />
              <TextField
                fullWidth
                select
                variant="filled"
                label="Manager Email"
                name="managerEmail"
                value={values.managerEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.managerEmail && Boolean(errors.managerEmail)}
                helperText={touched.managerEmail && errors.managerEmail}
              >
                {managers.map((email, index) => (
                  <MenuItem key={index} value={email}>
                    {email}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: "1rem" }}
              >
                Update Store
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditStoreNew;
