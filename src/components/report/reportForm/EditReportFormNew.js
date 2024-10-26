import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  MenuItem,
  Card,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import dayjs from "dayjs";
import { FaTimes } from "react-icons/fa";

const EditReportForm = ({
  report,
  notes,
  setNotes,
  handleImageChange,
  saveReport,
  setReport,
  imagePreviews,
  setImagePreviews,
  newImages,
  setNewImages,
  existingImages,
  setExistingImages,
  step,
  handleNextStep,
  handlePreviousStep,
  isLastStep,
  stores,
  user,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const productKeys = Object.keys(report.products);

  // Validation schema for Formik
  const validationSchema = yup.object().shape({
    date: yup.date().required("Date is required").nullable(),
    notes: yup.string(),
    storeId: yup.string().required("Store is required"),
    products: yup
      .object()
      .test(
        "atLeastOneProduct",
        "At least one product is required",
        (value) => Object.keys(value).length > 0
      ),
  });

  // Handling the removal of images correctly, ensuring arrays exist
  const handleRemoveNewImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews); // Update previews

    const updatedNewImages = (newImages || []).filter((_, i) => i !== index); // Safely access newImages
    setNewImages(updatedNewImages); // Update newImages
  };

  const handleRemoveExistingImage = (index) => {
    const updatedExistingImages = (existingImages || []).filter(
      (_, i) => i !== index
    ); // Safely access existingImages
    setExistingImages(updatedExistingImages); // Update existing images

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews); // Update imagePreviews
  };

  const calculateActualTotal = (pos, cash, expenses) => {
    const actualTotal =
      parseFloat(pos) + parseFloat(cash) - parseFloat(expenses);
    return isNaN(actualTotal) ? 0 : actualTotal; // Return 0 if NaN
  };

  return (
    <Box p={3}>
      <Card sx={{ padding: 4 }}>
        <Typography variant="h4" mb={3}>
          Edit Report
        </Typography>
        <Formik
          initialValues={{
            date: report.date ? dayjs(report.date) : null,
            notes: notes || "",
            storeId: report.storeId || "",
            products: report.products || {},
          }}
          validationSchema={validationSchema}
          onSubmit={saveReport}
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
              <Grid container spacing={2}>
                {/* Store Selection for Admin */}
                {user?.role === "admin" && step === 0 && (
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Select Store"
                      name="storeId"
                      value={values.storeId}
                      onChange={(e) => setFieldValue("storeId", e.target.value)}
                      error={touched.storeId && Boolean(errors.storeId)}
                      helperText={touched.storeId && errors.storeId}
                    >
                      {stores.map((store) => (
                        <MenuItem key={store._id} value={store._id}>
                          {store.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

                {/* Date Picker */}
                {step === 0 && (
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
                        value={values.date}
                        onChange={(newValue) => setFieldValue("date", newValue)}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            error={touched.date && Boolean(errors.date)}
                            helperText={touched.date && errors.date}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                )}

                {/* Product Fields */}
                {step < productKeys.length && (
                  <FieldArray
                    name={`products.${productKeys[step]}`}
                    render={() => (
                      <>
                        <Typography variant="h5">
                          {productKeys[step]} Details
                        </Typography>

                        {/* Rate Field */}
                        <Grid container spacing={2} mt={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label={`Rate for ${productKeys[step]}`}
                              name={`products.${productKeys[step]}.rate`}
                              value={values.products[productKeys[step]].rate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                        </Grid>

                        {/* Dipping Tanks */}
                        <FieldArray
                          name={`products.${productKeys[step]}.dippingTanks`}
                          render={(arrayHelpers) => (
                            <>
                              {values.products[
                                productKeys[step]
                              ].dippingTanks?.map((tank, tankIndex) => (
                                <Grid container spacing={2} key={tankIndex}>
                                  <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      label={`Tank ${tankIndex + 1} Opening`}
                                      name={`products.${productKeys[step]}.dippingTanks[${tankIndex}].opening`}
                                      value={tank.opening}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      label={`Tank ${tankIndex + 1} Closing`}
                                      name={`products.${productKeys[step]}.dippingTanks[${tankIndex}].closing`}
                                      value={tank.closing}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      onClick={() =>
                                        arrayHelpers.remove(tankIndex)
                                      }
                                      sx={{
                                        mt: 1,
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(255, 69, 58, 0.8)",
                                          color: "#fff",
                                        },
                                      }}
                                    >
                                      Remove Dipping Tank
                                    </Button>
                                  </Grid>
                                </Grid>
                              ))}
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "#FFD700"
                                      : "#FFC107",
                                  color: "#000",
                                  "&:hover": {
                                    backgroundColor: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "#FFC107"
                                        : "#FFD700",
                                  },
                                }}
                                onClick={() =>
                                  arrayHelpers.push({
                                    opening: "",
                                    closing: "",
                                  })
                                }
                              >
                                Add Dipping Tank
                              </Button>
                            </>
                          )}
                        />

                        {/* Pumps and Nozzles */}
                        <FieldArray
                          name={`products.${productKeys[step]}.pumps`}
                          render={(pumpHelpers) => (
                            <>
                              {values.products[productKeys[step]].pumps?.map(
                                (pump, pumpIndex) => (
                                  <Box key={pumpIndex}>
                                    <Typography variant="h6">
                                      Pump {pumpIndex + 1}
                                    </Typography>

                                    <FieldArray
                                      name={`products.${productKeys[step]}.pumps[${pumpIndex}].nozzles`}
                                      render={(nozzleHelpers) => (
                                        <>
                                          {pump.nozzles?.map(
                                            (nozzle, nozzleIndex) => (
                                              <Grid
                                                container
                                                spacing={2}
                                                key={nozzleIndex}
                                              >
                                                <Grid item xs={6}>
                                                  <TextField
                                                    fullWidth
                                                    label={`Nozzle ${
                                                      pumpIndex + 1
                                                    }${String.fromCharCode(
                                                      65 + nozzleIndex
                                                    )} Opening`}
                                                    name={`products.${productKeys[step]}.pumps[${pumpIndex}].nozzles[${nozzleIndex}].opening`}
                                                    value={nozzle.opening}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                </Grid>
                                                <Grid item xs={6}>
                                                  <TextField
                                                    fullWidth
                                                    label={`Nozzle ${
                                                      pumpIndex + 1
                                                    }${String.fromCharCode(
                                                      65 + nozzleIndex
                                                    )} Closing`}
                                                    name={`products.${productKeys[step]}.pumps[${pumpIndex}].nozzles[${nozzleIndex}].closing`}
                                                    value={nozzle.closing}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                  />
                                                </Grid>
                                              </Grid>
                                            )
                                          )}
                                        </>
                                      )}
                                    />
                                    <Button
                                      variant="outlined"
                                      color="secondary"
                                      onClick={() =>
                                        pumpHelpers.remove(pumpIndex)
                                      }
                                    >
                                      Remove Pump
                                    </Button>
                                  </Box>
                                )
                              )}
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "#00E5FF"
                                      : "#00B8D4",
                                  color: "#000",
                                  "&:hover": {
                                    backgroundColor: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "#00B8D4"
                                        : "#00E5FF",
                                  },
                                }}
                                onClick={() =>
                                  pumpHelpers.push({
                                    nozzles: [
                                      { opening: "", closing: "" },
                                      { opening: "", closing: "" },
                                    ],
                                  })
                                }
                              >
                                Add Pump (with 2 Nozzles)
                              </Button>
                            </>
                          )}
                        />

                        {/* Sales Breakdown */}
                        <Grid container spacing={2} mt={2}>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              label="POS"
                              name={`products.${productKeys[step]}.totalSalesBreakdown.pos`}
                              value={
                                values.products[productKeys[step]]
                                  .totalSalesBreakdown?.pos || ""
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              label="Cash"
                              name={`products.${productKeys[step]}.totalSalesBreakdown.cash`}
                              value={
                                values.products[productKeys[step]]
                                  .totalSalesBreakdown?.cash || ""
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              label="Expenses"
                              name={`products.${productKeys[step]}.totalSalesBreakdown.expenses`}
                              value={
                                values.products[productKeys[step]]
                                  .totalSalesBreakdown?.expenses || ""
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                        </Grid>

                        {/* Display Calculated Actual Total */}
                        <Grid container spacing={2} mt={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label={`Actual Total for ${productKeys[step]}`}
                              value={calculateActualTotal(
                                values.products[productKeys[step]]
                                  .totalSalesBreakdown?.pos,
                                values.products[productKeys[step]]
                                  .totalSalesBreakdown?.cash,
                                values.products[productKeys[step]]
                                  .totalSalesBreakdown?.expenses
                              )}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}
                  />
                )}

                {/* Last Step: Notes and Image Upload */}
                {isLastStep && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Notes"
                        name="notes"
                        value={values.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.notes && Boolean(errors.notes)}
                        helperText={touched.notes && errors.notes}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body2">Upload Images:</Typography>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreviews.length > 0 && (
                        <Box mt={2}>
                          {imagePreviews.map((preview, index) => (
                            <Box
                              key={index}
                              position="relative"
                              display="inline-block"
                              mr={2}
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                style={{ width: "150px", borderRadius: "4px" }}
                              />
                              <IconButton
                                size="small"
                                onClick={() =>
                                  index < (existingImages || []).length
                                    ? handleRemoveExistingImage(index)
                                    : handleRemoveNewImage(
                                        index - (existingImages || []).length
                                      )
                                }
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  background: "rgba(255, 255, 255, 0.8)",
                                }}
                              >
                                <FaTimes style={{ color: "red" }} />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="I have entered all information correctly"
                      />
                    </Grid>
                  </>
                )}

                <Grid container spacing={2} mt={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handlePreviousStep}
                      disabled={step === 0}
                    >
                      Previous
                    </Button>
                  </Grid>

                  <Grid item xs={6}>
                    {isLastStep ? (
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!isConfirmed} // Disable until checkbox is checked
                      >
                        Save Report
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNextStep}
                      >
                        Next
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
};

export default EditReportForm;
