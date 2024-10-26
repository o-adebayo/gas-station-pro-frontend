import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import HeaderNew from "../../components/HeaderNew";
//import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import FlexBetween from "../../components/FlexBetween";
import {
  //DownloadOutlined,
  GroupOutlined,
  LocalGasStationOutlined,
  StoreOutlined,
  PointOfSale,
} from "@mui/icons-material";

import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchUsers } from "../../redux/features/auth/authSlice";
import { selectStores } from "../../redux/features/storeLocation/storeLocationSlice";
import { getReports } from "../../redux/features/report/reportSlice";
import { selectCompany } from "../../redux/features/company/companySlice";
import StatBox from "../../components/StatBox";
import SalesOverviewChart from "../../components/Charts/SalesOverviewChart";
import StoreComparisonChart from "../../components/Charts/StoreComparisonChart";
import SalesPieChart from "../../components/Charts/SalesPieChart";
import ProductSalesBarChart from "../../components/Charts/ProductSalesBarChart";

const DashboardNew = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { user, users, isLoggedIn } = useSelector((state) => state.auth);

  //const isLoading = useSelector((state) => state.auth.isLoading);
  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  const { reports } = useSelector((state) => {
    const reportsData = state.report.reports || {}; // Default to an empty object
    return reportsData.reports ? reportsData : { reports: reportsData }; // Return an object with reports key
  });

  //const reports = useSelector((state) => state.report.reports);
  //const reports = useMemo(() => reportsData?.reports || [], [reportsData]); // Memoize reports

  const { isError, message } = useSelector((state) => state.report);

  const companyResponse = useSelector(selectCompany); // Fetch company details
  const company = companyResponse?.company || {}; // Destructure company details

  //console.log("logged in", isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUser()); // Fetch user data when logged in
      dispatch(fetchUsers()); // Fetch user data when logged in
      dispatch(getReports());
    }
  }, [isLoggedIn, dispatch]);

  if (!user) {
    // Optionally, add a fallback or return null if user is missing
    return null;
  }

  // function to calculate store total sales in dollars and liters
  function calculateTotalSales(salesReports) {
    // Get the current date, month, and year
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();

    // Calculate previous month and previous year
    let previousMonthDate = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    );
    const previousMonth = previousMonthDate.toLocaleString("default", {
      month: "long",
    });
    const previousYear = previousMonthDate.getFullYear();

    // Initialize accumulators for monthly and yearly sales
    let totalSalesDollarsForMonth = 0;
    let totalSalesLitersForMonth = 0;
    let totalSalesDollarsForYear = 0;
    let totalSalesLitersForYear = 0;

    let totalSalesDollarsForPreviousMonth = 0;
    let totalSalesLitersForPreviousMonth = 0;
    let totalSalesDollarsForPreviousYear = 0;
    let totalSalesLitersForPreviousYear = 0;

    // Iterate over each sales report
    salesReports.forEach((report) => {
      // Calculate totals for current month
      if (report.month === currentMonth && report.year === currentYear) {
        totalSalesDollarsForMonth += report.storeTotalSales.totalSalesDollars;
        totalSalesLitersForMonth += report.storeTotalSales.totalSalesLiters;
      }
      // Calculate totals for current year
      if (report.year === currentYear) {
        totalSalesDollarsForYear += report.storeTotalSales.totalSalesDollars;
        totalSalesLitersForYear += report.storeTotalSales.totalSalesLiters;
      }

      // Calculate totals for previous month
      if (report.month === previousMonth && report.year === currentYear) {
        totalSalesDollarsForPreviousMonth +=
          report.storeTotalSales.totalSalesDollars;
        totalSalesLitersForPreviousMonth +=
          report.storeTotalSales.totalSalesLiters;
      }
      // Calculate totals for previous year
      if (report.year === previousYear) {
        totalSalesDollarsForPreviousYear +=
          report.storeTotalSales.totalSalesDollars;
        totalSalesLitersForPreviousYear +=
          report.storeTotalSales.totalSalesLiters;
      }
    });

    // Calculate percentage difference for dollars (month over month)
    let percentageDiffDollarsMonth = totalSalesDollarsForPreviousMonth
      ? ((totalSalesDollarsForMonth - totalSalesDollarsForPreviousMonth) /
          totalSalesDollarsForPreviousMonth) *
        100
      : 0;

    // Calculate percentage difference for liters (month over month)
    let percentageDiffLitersMonth = totalSalesLitersForPreviousMonth
      ? ((totalSalesLitersForMonth - totalSalesLitersForPreviousMonth) /
          totalSalesLitersForPreviousMonth) *
        100
      : 0;

    // Calculate percentage difference for dollars (year over year)
    let percentageDiffDollarsYear = totalSalesDollarsForPreviousYear
      ? ((totalSalesDollarsForYear - totalSalesDollarsForPreviousYear) /
          totalSalesDollarsForPreviousYear) *
        100
      : 0;

    // Calculate percentage difference for liters (year over year)
    let percentageDiffLitersYear = totalSalesLitersForPreviousYear
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
      totalSalesForPreviousMonth: {
        totalSalesDollars: totalSalesDollarsForPreviousMonth,
        totalSalesLiters: totalSalesLitersForPreviousMonth,
      },
      totalSalesForPreviousYear: {
        totalSalesDollars: totalSalesDollarsForPreviousYear,
        totalSalesLiters: totalSalesLitersForPreviousYear,
      },
    };
  }

  // function to create monthly sales for all stores for admin and for 1 store for managers
  function calculateMonthlySales(salesReports) {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Initialize an object to hold total sales for each month
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

    // Iterate over each sales report
    salesReports.forEach((report) => {
      if (report.year === currentYear) {
        const { month, storeTotalSales } = report;

        // Aggregate total sales for each month
        if (monthlySales[month]) {
          monthlySales[month].totalSalesDollars +=
            storeTotalSales.totalSalesDollars;
          monthlySales[month].totalSalesLiters +=
            storeTotalSales.totalSalesLiters;
        }
      }
    });

    // Convert the result to an array format that can be used for charting
    return Object.keys(monthlySales).map((month) => ({
      name: month,
      totalSalesDollars: monthlySales[month].totalSalesDollars,
      totalSalesLiters: monthlySales[month].totalSalesLiters,
    }));
  }

  // Function to calculate total sales in dollars for each month of the current year by store
  function calculateStoreMonthlySales(salesReports) {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Initialize an object to hold total sales for each store for each month
    const storeSalesData = {};

    // Iterate over each sales report
    salesReports.forEach((report) => {
      if (report.year === currentYear) {
        const { month, storeName, storeTotalSales } = report;

        // Initialize the store in the storeSalesData if not already present
        if (!storeSalesData[storeName]) {
          storeSalesData[storeName] = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
          };
        }

        // Add the total sales for the month
        storeSalesData[storeName][month] += storeTotalSales.totalSalesDollars;
      }
    });

    // Convert the result into an array format for charting
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Create an array for charting where each store has a line
    const formattedData = months.map((month) => {
      const dataPoint = { name: month };

      // Add each store's sales for that month to the data point
      Object.keys(storeSalesData).forEach((storeName) => {
        dataPoint[storeName] = storeSalesData[storeName][month];
      });

      return dataPoint;
    });

    return formattedData;
  }

  // Function to calculate total sales in dollars for each store during the current month
  function calculateCurrentMonthSales(salesReports) {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();

    // Initialize an object to hold total sales for each store
    const storeSales = {};

    // Iterate over each sales report
    salesReports.forEach((report) => {
      if (report.month === currentMonth && report.year === currentYear) {
        const { storeName, storeTotalSales } = report;

        // If storeName already exists in storeSales, add to its total; otherwise, initialize it
        if (storeSales[storeName]) {
          storeSales[storeName] += storeTotalSales.totalSalesDollars;
        } else {
          storeSales[storeName] = storeTotalSales.totalSalesDollars;
        }
      }
    });

    // Convert storeSales object to an array format for the pie chart
    return Object.keys(storeSales).map((storeName) => ({
      name: storeName,
      value: storeSales[storeName],
    }));
  }

  // Function to calculate total sales in dollars for each store in the current year
  function calculateStoreSalesForCurrentYear(salesReports) {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Create an object to store total sales for each store
    const storeSales = {};

    // Iterate over each sales report
    salesReports.forEach((report) => {
      if (report.year === currentYear) {
        const { storeName, storeTotalSales } = report;

        // If the storeName exists, add to its totalSalesDollars
        if (storeSales[storeName]) {
          storeSales[storeName] += storeTotalSales.totalSalesDollars;
        } else {
          // Otherwise, initialize with current totalSalesDollars
          storeSales[storeName] = storeTotalSales.totalSalesDollars;
        }
      }
    });

    // Convert the result to an array format that can be used for charting
    return Object.keys(storeSales).map((storeName) => ({
      name: storeName,
      value: storeSales[storeName],
    }));
  }

  // Function to calcluate sales by product type for all stores for admin and 1 store for managers in the current month
  function calculateProductSalesForCurrentMonth(salesReports) {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const currentYear = currentDate.getFullYear();

    const productSales = {
      PMS: 0,
      AGO: 0,
      DPK: 0,
    };

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

  // Function to calcluate sales by product type for all stores for admin and 1 store for managers in the current year
  function calculateProductSalesForCurrentYear(salesReports) {
    const currentYear = new Date().getFullYear();

    const productSales = {
      PMS: 0,
      AGO: 0,
      DPK: 0,
    };

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

  // CALL ALL NECESSARY FUNCTIONS TO GET THE APPROPRIATE VALUES FOR CHARTS
  // call the function and pass the reports array of the entire company for admins and entire store for managers
  const totalSales = calculateTotalSales(reports);
  // Calculate total monthly sales from reports
  const monthlySalesData = calculateMonthlySales(reports);
  // Calculate total montly sales by store each month
  const storeMonthlySalesData = calculateStoreMonthlySales(reports);
  // Call the function to calculate sales for the current month
  const currentMonthSalesData = calculateCurrentMonthSales(reports);
  // Calculate the total sales for each store for the current year
  const storeSalesData = calculateStoreSalesForCurrentYear(reports);
  // Calculate total product sales for the current month and year
  const productSalesForMonth = calculateProductSalesForCurrentMonth(reports);
  const productSalesForYear = calculateProductSalesForCurrentYear(reports);

  /*   console.log(
    `Total Sales for the Month (Dollars): ${totalSales.totalSalesForMonth.totalSalesDollars}`
  );
  console.log(
    `Total Sales for the Month (Liters): ${totalSales.totalSalesForMonth.totalSalesLiters}`
  );
  console.log(
    `Percentage Difference for the Month (Dollars): ${totalSales.totalSalesForMonth.percentageDiffDollars}%`
  );
  console.log(
    `Percentage Difference for the Month (Liters): ${totalSales.totalSalesForMonth.percentageDiffLiters}%`
  );

  console.log(
    `Total Sales for the Year (Dollars): ${totalSales.totalSalesForYear.totalSalesDollars}`
  );
  console.log(
    `Total Sales for the Year (Liters): ${totalSales.totalSalesForYear.totalSalesLiters}`
  );
  console.log(
    `Percentage Difference for the Year (Dollars): ${totalSales.totalSalesForYear.percentageDiffDollars}%`
  );
  console.log(
    `Percentage Difference for the Year (Liters): ${totalSales.totalSalesForYear.percentageDiffLiters}%`
  ); */

  // Only render the StoreComparisonChart if the user is an admin
  const isAdmin = user.role === "admin";

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <HeaderNew
          title="DASHBOARD"
          subtitle={`Welcome to your ${
            user.role === "admin" ? "company" : "store"
          } dashboard`}
        />

        {/*  <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </FlexBetween>
      {/* GRID & CHARTS */}
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
          title="Stores"
          value={stores && stores.length ? stores.length : 0}
          increase="+14%"
          description="Since last month"
          icon={
            <StoreOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

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

        {/* Monthly Sales*/}
        <StatBox
          title="Sales This Month (Lts)"
          value={totalSales.totalSalesForMonth.totalSalesLiters.toLocaleString()}
          increase={`${totalSales.totalSalesForMonth.percentageDiffLiters.toFixed(
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
          value={`₦${totalSales.totalSalesForMonth.totalSalesDollars.toLocaleString()}`}
          increase={`${totalSales.totalSalesForMonth.percentageDiffDollars.toFixed(
            2
          )}%`}
          description="Since last month"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* Yearly Sales*/}
        <StatBox
          title="Sales This Year (Lts)"
          value={totalSales.totalSalesForYear.totalSalesLiters.toLocaleString()}
          increase={`${totalSales.totalSalesForYear.percentageDiffLiters.toFixed(
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
          value={`₦${totalSales.totalSalesForYear.totalSalesDollars.toLocaleString()}`}
          increase={`${totalSales.totalSalesForYear.percentageDiffDollars.toFixed(
            2
          )}%`}
          description="Since last year"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* Sales Overview Chart */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <SalesOverviewChart salesData={monthlySalesData} />
        </Box>

        {isAdmin && (
          <>
            <Box
              gridColumn="span 6"
              gridRow="span 2"
              backgroundColor={theme.palette.background.alt}
              p="1rem"
              borderRadius="0.55rem"
            >
              <SalesPieChart
                salesData={currentMonthSalesData}
                title="Total Sales by Store (₦) - This Month"
              />
            </Box>

            <Box
              gridColumn="span 6"
              gridRow="span 2"
              backgroundColor={theme.palette.background.alt}
              p="1rem"
              borderRadius="0.55rem"
            >
              <SalesPieChart
                salesData={storeSalesData}
                title="Total Sales by Store (₦) - This Year"
              />
            </Box>

            <Box
              gridColumn="span 12"
              gridRow="span 2"
              backgroundColor={theme.palette.background.alt}
              p="1rem"
              borderRadius="0.55rem"
            >
              <StoreComparisonChart storeSalesData={storeMonthlySalesData} />
            </Box>
          </>
        )}

        {/* Bar chart for product sales in the current month */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <ProductSalesBarChart
            salesData={productSalesForMonth}
            title="Total Sales by Product (₦) - This Month"
          />
        </Box>

        {/* Bar chart for product sales in the current year */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <ProductSalesBarChart
            salesData={productSalesForYear}
            title="Total Sales by Product (₦) - This Year"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardNew;
