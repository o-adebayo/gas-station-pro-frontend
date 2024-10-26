import React, { useEffect, useState } from "react";
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

  // Function to filter and calculate store sales for the specific store
  function calculateStoreSales(salesReports) {
    if (!hasReportsData) {
      return {
        totalSalesForMonth: {
          totalSalesDollars: 0,
          totalSalesLiters: 0,
          percentageDiffDollars: 0,
          percentageDiffLiters: 0,
        },
        totalSalesForYear: {
          totalSalesDollars: 0,
          totalSalesLiters: 0,
          percentageDiffDollars: 0,
          percentageDiffLiters: 0,
        },
      };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();

    let previousMonthDate = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    );
    const previousMonth = previousMonthDate.toLocaleString("default", {
      month: "long",
    });
    const previousYear = previousMonthDate.getFullYear();

    // Initialize accumulators for the current and previous periods
    let totalSalesDollarsForMonth = 0;
    let totalSalesLitersForMonth = 0;
    let totalSalesDollarsForYear = 0;
    let totalSalesLitersForYear = 0;

    let totalSalesDollarsForPreviousMonth = 0;
    let totalSalesLitersForPreviousMonth = 0;
    let totalSalesDollarsForPreviousYear = 0;
    let totalSalesLitersForPreviousYear = 0;

    salesReports.forEach((report) => {
      // Totals for the current month
      if (report.month === currentMonth && report.year === currentYear) {
        totalSalesDollarsForMonth += report.storeTotalSales.totalSalesDollars;
        totalSalesLitersForMonth += report.storeTotalSales.totalSalesLiters;
      }
      // Totals for the current year
      if (report.year === currentYear) {
        totalSalesDollarsForYear += report.storeTotalSales.totalSalesDollars;
        totalSalesLitersForYear += report.storeTotalSales.totalSalesLiters;
      }
      // Totals for the previous month
      if (report.month === previousMonth && report.year === currentYear) {
        totalSalesDollarsForPreviousMonth +=
          report.storeTotalSales.totalSalesDollars;
        totalSalesLitersForPreviousMonth +=
          report.storeTotalSales.totalSalesLiters;
      }
      // Totals for the previous year
      if (report.year === previousYear) {
        totalSalesDollarsForPreviousYear +=
          report.storeTotalSales.totalSalesDollars;
        totalSalesLitersForPreviousYear +=
          report.storeTotalSales.totalSalesLiters;
      }
    });

    // Calculate percentage differences
    const percentageDiffDollarsMonth = totalSalesDollarsForPreviousMonth
      ? ((totalSalesDollarsForMonth - totalSalesDollarsForPreviousMonth) /
          totalSalesDollarsForPreviousMonth) *
        100
      : 0;

    const percentageDiffLitersMonth = totalSalesLitersForPreviousMonth
      ? ((totalSalesLitersForMonth - totalSalesLitersForPreviousMonth) /
          totalSalesLitersForPreviousMonth) *
        100
      : 0;

    const percentageDiffDollarsYear = totalSalesDollarsForPreviousYear
      ? ((totalSalesDollarsForYear - totalSalesDollarsForPreviousYear) /
          totalSalesDollarsForPreviousYear) *
        100
      : 0;

    const percentageDiffLitersYear = totalSalesLitersForPreviousYear
      ? ((totalSalesLitersForYear - totalSalesLitersForPreviousYear) /
          totalSalesLitersForPreviousYear) *
        100
      : 0;

    return {
      totalSalesForMonth: {
        totalSalesDollars: totalSalesDollarsForMonth,
        totalSalesLiters: totalSalesLitersForMonth,
        percentageDiffDollars: percentageDiffDollarsMonth,
        percentageDiffLiters: percentageDiffLitersMonth,
      },
      totalSalesForYear: {
        totalSalesDollars: totalSalesDollarsForYear,
        totalSalesLiters: totalSalesLitersForYear,
        percentageDiffDollars: percentageDiffDollarsYear,
        percentageDiffLiters: percentageDiffLitersYear,
      },
    };
  }

  // Function to calculate monthly sales for the current year for a single store
  function calculateMonthlySalesForStore(salesReports) {
    const currentYear = new Date().getFullYear();

    const monthlySales = {
      January: { totalSalesDollars: 0, totalSalesLiters: 0 },
      February: { totalSalesDollars: 0, totalSalesLiters: 0 },
      March: { totalSalesDollars: 0, totalSalesLiters: 0 },
      April: { totalSalesDollars: 0, totalSalesLiters: 0 },
      May: { totalSalesDollars: 0, totalSalesLiters: 0 },
      June: { totalSalesDollars: 0, totalSalesLiters: 0 },
      July: { totalSalesDollars: 0, totalSalesLiters: 0 },
      August: { totalSalesDollars: 0, totalSalesLiters: 0 },
      September: { totalSalesDollars: 0, totalSalesLiters: 0 },
      October: { totalSalesDollars: 0, totalSalesLiters: 0 },
      November: { totalSalesDollars: 0, totalSalesLiters: 0 },
      December: { totalSalesDollars: 0, totalSalesLiters: 0 },
    };

    salesReports.forEach((report) => {
      if (report.year === currentYear) {
        const { month, storeTotalSales } = report;

        if (monthlySales[month]) {
          monthlySales[month].totalSalesDollars +=
            storeTotalSales.totalSalesDollars;
          monthlySales[month].totalSalesLiters +=
            storeTotalSales.totalSalesLiters;
        }
      }
    });

    return Object.keys(monthlySales).map((month) => ({
      name: month,
      totalSalesDollars: monthlySales[month].totalSalesDollars,
      totalSalesLiters: monthlySales[month].totalSalesLiters,
    }));
  }

  // Function to calculate product sales (PMS, AGO, DPK) for the current month for the store
  function calculateProductSalesForCurrentMonthForStore(salesReports) {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();

    const productSales = { PMS: 0, AGO: 0, DPK: 0 };

    salesReports.forEach((report) => {
      if (report.month === currentMonth && report.year === currentYear) {
        productSales.PMS += report.products.PMS.totalSalesDollars || 0;
        productSales.AGO += report.products.AGO.totalSalesDollars || 0;
        productSales.DPK += report.products.DPK.totalSalesDollars || 0;
      }
    });

    return Object.keys(productSales).map((product) => ({
      name: product,
      totalSales: productSales[product],
    }));
  }

  // Function to calculate product sales (PMS, AGO, DPK) for the current year for the store
  function calculateProductSalesForCurrentYearForStore(salesReports) {
    const currentYear = new Date().getFullYear();

    const productSales = { PMS: 0, AGO: 0, DPK: 0 };

    salesReports.forEach((report) => {
      if (report.year === currentYear) {
        productSales.PMS += report.products.PMS.totalSalesDollars || 0;
        productSales.AGO += report.products.AGO.totalSalesDollars || 0;
        productSales.DPK += report.products.DPK.totalSalesDollars || 0;
      }
    });

    return Object.keys(productSales).map((product) => ({
      name: product,
      totalSales: productSales[product],
    }));
  }

  // Call the functions and pass the reports array for the specific store
  const storeSales = calculateStoreSales(reports); // Calculate store sales data
  const monthlySalesData = calculateMonthlySalesForStore(reports);
  const productSalesForMonth =
    calculateProductSalesForCurrentMonthForStore(reports);
  const productSalesForYear =
    calculateProductSalesForCurrentYearForStore(reports);

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
