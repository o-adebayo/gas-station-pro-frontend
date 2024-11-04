import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Avatar,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import HeaderNew from "../../components/HeaderNew";
import Loader from "../../components/loader/Loader";
import {
  deleteCompany,
  getCompanyByCode,
} from "../../redux/features/company/companySlice";
import { selectUser } from "../../redux/features/auth/authSlice";
import dayjs from "dayjs";

const ViewCompany = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const companyData = useSelector((state) => state.company.company);
  const company = companyData?.company; // Extract the nested company data
  const isLoading = useSelector((state) => state.company.isLoading);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    if (user?.role === "admin" && user?.companyCode) {
      dispatch(getCompanyByCode(user.companyCode));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <Loader message="Loading company data..." />;
  }

  if (user?.role !== "admin" || !company) {
    return (
      <Typography variant="h6" color="error">
        Access denied or company details not found.
      </Typography>
    );
  }

  const openDeleteDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDialogOpen(false);
    setDeleteInput("");
  };

  const handleUpgradePlan = () => {
    /* dispatch(upgradeCompanyPlan(company._id))
      .then(() => {
        alert("Plan upgraded to paid successfully!");
      })
      .catch((error) => {
        alert(`Error upgrading plan: ${error.message}`);
      }); */
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCompany(company._id))
      .then(() => {
        alert("Company deleted successfully.");
        navigate("/"); // Redirect after deletion
      })
      .catch((error) => {
        alert(`Error deleting company: ${error.message}`);
      });
    closeDeleteDialog();
  };

  return (
    <Box m="1.5rem 2.5rem">
      <HeaderNew
        title="COMPANY DETAILS"
        subtitle={`Viewing details for: ${company.name}`}
      />

      <Formik
        enableReinitialize
        initialValues={{
          name: company.name || "",
          ownerName: company.ownerName || "",
          ownerEmail: company.ownerEmail || "",
          phone: company.phone || "N/A",
          address: company.address || "N/A",
          companyCode: company.companyCode || "",
          planTier: company.planTier || "Free",
          planType: company.planType || "",
          planCost: company.planCost || 0,
          planCycle: company.planCycle || "",
          planExpiryDate: company.planExpiryDate
            ? dayjs(company.planExpiryDate).format("MMMM D, YYYY")
            : "N/A",
          planRenewalDate: company.planRenewalDate
            ? dayjs(company.planRenewalDate).format("MMMM D, YYYY")
            : "N/A",
          createdAt: dayjs(company.createdAt).format("MMMM D, YYYY"),
          updatedAt: dayjs(company.updatedAt).format("MMMM D, YYYY"),
        }}
      >
        {({ values }) => (
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Company Name"
                  value={values.name}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Owner Name"
                  value={values.ownerName}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Owner Email"
                  value={values.ownerEmail}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Phone"
                  value={values.phone}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Address"
                  value={values.address}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Company Code"
                  value={values.companyCode}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Plan Tier"
                  value={values.planTier}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Plan Type"
                  value={values.planType}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Plan Cost"
                  value={`₦${values.planCost}`}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Plan Cycle"
                  value={values.planCycle}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Plan Expiry Date"
                  value={values.planExpiryDate}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Plan Renewal Date"
                  value={values.planRenewalDate}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Created At"
                  value={values.createdAt}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Updated At"
                  value={values.updatedAt}
                  disabled
                />
              </Grid>
            </Grid>

            {/* Upgrade Button */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpgradePlan}
              >
                Upgrade to Paid Plan
              </Button>
            </Box>

            {/* Danger Zone */}
            <Box mt={4}>
              <Divider />
              <Typography variant="h6" color="error" mt={2} mb={1}>
                Danger Zone
              </Typography>
              <Typography color="textSecondary" mb={2}>
                Deleting this company is permanent and cannot be undone.
              </Typography>
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="error"
                  onClick={openDeleteDialog}
                  sx={{
                    backgroundColor: theme.palette.error.main,
                    "&:hover": { backgroundColor: theme.palette.error.dark },
                  }}
                >
                  Delete Company
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Company Deletion</DialogTitle>
        <DialogContent>
          <Typography color="error" mb={2}>
            Warning: This action is permanent and cannot be undone.
          </Typography>
          <Typography mb={2}>
            To confirm, please type the word <strong>"delete"</strong> below:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            label="Type 'delete' to confirm"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            error={deleteInput !== "" && deleteInput !== "delete"}
            helperText={
              deleteInput !== "" && deleteInput !== "delete"
                ? "Please type 'delete' exactly to confirm."
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={deleteInput !== "delete"}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewCompany;
