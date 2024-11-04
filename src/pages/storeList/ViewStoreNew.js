import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { getStoreLocation } from "../../redux/features/storeLocation/storeLocationSlice";
import StatBox from "../../components/StatBox";
import {
  LocalGasStationOutlined,
  PointOfSale,
  GroupOutlined,
} from "@mui/icons-material";
import HeaderNew from "../../components/HeaderNew";
import { getReportsByStoreId } from "../../redux/features/report/reportSlice";
import SalesOverviewChart from "../../components/Charts/SalesOverviewChart";
import ProductSalesBarChart from "../../components/Charts/ProductSalesBarChart";

// Importing utility functions
import {
  calculateStoreSales,
  calculateMonthlySalesForStore,
  calculateProductSalesForCurrentMonthForStore,
  calculateProductSalesForCurrentYearForStore,
} from "../../utils/salesCalculations";

const ViewStoreNew = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { id } = useParams(); // Get store ID from URL params

  const dispatch = useDispatch();

  const [store, setStore] = useState(null);
  const [managerName, setManagerName] = useState(""); // State to hold the manager's name

  const { reports } = useSelector((state) => {
    const reportsData = state.report.reports || {}; // Default to an empty object
    return reportsData.reports ? reportsData : { reports: reportsData }; // Return an object with reports key
  });

  const { users } = useSelector((state) => state.auth); // Assuming users are in your auth slice

  useEffect(() => {
    if (id) {
      dispatch(getReportsByStoreId(id)); // Fetch reports by store ID
      dispatch(getStoreLocation(id)).then((response) => {
        const storeData = response.payload; // Assuming store data comes from response.payload
        setStore(storeData);
      });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (store && users.length > 0) {
      const manager = users.find(
        (user) => String(user._id) === String(store.managerId?._id)
      );
      if (manager) {
        setManagerName(manager?.name); // Set the manager's name if found
      } else {
        console.log(`Manager with ID ${store.managerId} not found`); // Log if no manager found
      }
    }
  }, [store, users]); // Runs when either `store` or `users` are updated

  // Check if there are reports data
  const hasReportsData = reports && reports.length > 0;

  // Using utility functions to calculate necessary values
  /*   const storeSales = calculateStoreSales(reports);
  const monthlySalesData = calculateMonthlySalesForStore(reports);
  const productSalesForMonth =
    calculateProductSalesForCurrentMonthForStore(reports);
  const productSalesForYear =
    calculateProductSalesForCurrentYearForStore(reports); */

  // Using useMemo to optimize calculations by memoizing results
  const storeSales = useMemo(() => calculateStoreSales(reports), [reports]);
  const monthlySalesData = useMemo(
    () => calculateMonthlySalesForStore(reports),
    [reports]
  );
  const productSalesForMonth = useMemo(
    () => calculateProductSalesForCurrentMonthForStore(reports),
    [reports]
  );
  const productSalesForYear = useMemo(
    () => calculateProductSalesForCurrentYearForStore(reports),
    [reports]
  );

  // if !store check should always be below usememo usage for calculations
  if (!store) return <Typography>Loading store details...</Typography>;

  return (
    <Box m="1.5rem 2.5rem">
      <HeaderNew
        title="STORE DETAILS"
        subtitle={`Viewing details for ${store.name}`}
      />
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Users"
          value={users && users.length ? users.length : 0}
          increase="+14%"
          description="Since last month"
          icon={
            <GroupOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Sales This Month (Lts)"
          value={storeSales.totalSalesForMonth.totalSalesLiters.toLocaleString()}
          increase={`${storeSales.totalSalesForMonth.percentageDiffLiters.toFixed(
            2
          )}%`}
          description="Since last month"
          icon={
            <LocalGasStationOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Sales This Month (₦)"
          value={storeSales.totalSalesForMonth.totalSalesDollars.toLocaleString()}
          increase={`${storeSales.totalSalesForMonth.percentageDiffDollars.toFixed(
            2
          )}%`}
          description="Since last month"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Sales This Year (Lts)"
          value={storeSales.totalSalesForYear.totalSalesLiters.toLocaleString()}
          increase={`${storeSales.totalSalesForYear.percentageDiffLiters.toFixed(
            2
          )}%`}
          description="Since last year"
          icon={
            <LocalGasStationOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Sales This Year (₦)"
          value={storeSales.totalSalesForYear.totalSalesDollars.toLocaleString()}
          increase={`${storeSales.totalSalesForYear.percentageDiffDollars.toFixed(
            2
          )}%`}
          description="Since last year"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {hasReportsData ? (
            <SalesOverviewChart salesData={monthlySalesData} />
          ) : (
            <Typography>No reports data available</Typography>
          )}
        </Box>

        {/* ROW 3 */}
        {/*  <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="20px"> */}

        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {hasReportsData ? (
            <ProductSalesBarChart
              salesData={productSalesForMonth}
              title="Total Sales by Product (₦) - This Month"
            />
          ) : (
            <Typography>No reports data available</Typography>
          )}
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {hasReportsData ? (
            <ProductSalesBarChart
              salesData={productSalesForYear}
              title="Total Sales by Product (₦) - This Year"
            />
          ) : (
            <Typography>No reports data available</Typography>
          )}
        </Box>
      </Box>

      {/* ROW 4 */}
      <Box
        gridColumn="span 12"
        gridRow="span 5"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
        marginTop={"2rem"}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            companyCode: store.companyCode || "",
            name: store.name || "",
            location: store.location || "",
            pumps: store.pumps || 0,
            nozzles: store.nozzles || 0,
            tanks: store.tanks || 0,
            description: store.description || "",
            manager: managerName || "Not assigned",
          }}
        >
          {({ values }) => (
            <form>
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
                  label="Store Name"
                  value={values.name}
                  disabled
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Location"
                  value={values.location}
                  disabled
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Pumps"
                  value={values.pumps}
                  disabled
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Nozzles"
                  value={values.nozzles}
                  disabled
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Tanks"
                  value={values.tanks}
                  disabled
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Manager"
                  value={values.manager}
                  disabled
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="Description"
                  value={values.description}
                  disabled
                />
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ViewStoreNew;
