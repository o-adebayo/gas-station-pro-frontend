import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import HeaderNew from "../../components/HeaderNew";
import SalesOverviewAreaChart from "../../components/Charts/SalesOverviewAreaChart";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../../redux/features/report/reportSlice";
import FlexBetween from "../../components/FlexBetween";
import ProductRatesLineChart from "../../components/Charts/ProductRatesLineChart";
import ProductSalesByStoreBarChart from "../../components/Charts/ProductSalesByStoreBarChart";
import SalesRadarChart from "../../components/Charts/SalesRadarChart";
import AIPoweredInsights from "../../components/Charts/AIPoweredInsights";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Import helper functions
import {
  getDailySalesData,
  getDailyProductRatesData,
  getProductSalesByStoreData,
  getDailyProductSalesData,
  getTotalSalesByProduct,
  getTotalSalesByStore,
  getTotalSalesByManager,
} from "../../utils/salesAnalyticsCalculations";

dayjs.extend(utc);

const Analytics = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [timePeriod, setTimePeriod] = useState("thismonth"); // Default to "This Month"

  const { reports } = useSelector((state) => {
    const reportsData = state.report.reports || {};
    return reportsData.reports ? reportsData : { reports: reportsData };
  });

  useEffect(() => {
    dispatch(getReports());
  }, [dispatch, timePeriod]);

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const filterReportsByTimePeriod = (reports, timePeriod) => {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // Set now to midnight UTC

    return reports.filter((report) => {
      const reportDate = new Date(report.date);
      reportDate.setUTCHours(0, 0, 0, 0); // Set reportDate to midnight UTC

      if (timePeriod === "today") {
        return reportDate.toDateString() === now.toDateString();
      } else if (timePeriod === "last3Days") {
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setDate(now.getDate() - 3);
        return reportDate >= threeDaysAgo && reportDate <= now;
      } else if (timePeriod === "last7Days") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return reportDate >= sevenDaysAgo && reportDate <= now;
      } else if (timePeriod === "thisweek") {
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(
          now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
        );
        return reportDate >= startOfWeek && reportDate <= now;
      } else if (timePeriod === "lastmonth") {
        const firstDayOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const lastDayOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        );
        return (
          reportDate >= firstDayOfLastMonth && reportDate <= lastDayOfLastMonth
        );
      } else if (timePeriod === "thismonth") {
        const firstDayOfThisMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );
        return reportDate >= firstDayOfThisMonth && reportDate <= now;
      } else if (timePeriod === "lastquarter") {
        const currentQuarter = Math.floor((now.getMonth() + 3) / 3); // 1 for Q1, 2 for Q2, etc.
        let startOfLastQuarter, endOfLastQuarter;

        // Set the start and end dates for the last quarter based on the current quarter
        if (currentQuarter === 1) {
          // Last quarter is Q4 of the previous year
          startOfLastQuarter = new Date(now.getFullYear() - 1, 9, 1); // October 1
          endOfLastQuarter = new Date(now.getFullYear() - 1, 11, 31); // December 31
        } else if (currentQuarter === 2) {
          // Last quarter is Q1 of this year
          startOfLastQuarter = new Date(now.getFullYear(), 0, 1); // January 1
          endOfLastQuarter = new Date(now.getFullYear(), 2, 31); // March 31
        } else if (currentQuarter === 3) {
          // Last quarter is Q2 of this year
          startOfLastQuarter = new Date(now.getFullYear(), 3, 1); // April 1
          endOfLastQuarter = new Date(now.getFullYear(), 5, 30); // June 30
        } else {
          // Last quarter is Q3 of this year
          startOfLastQuarter = new Date(now.getFullYear(), 6, 1); // July 1
          endOfLastQuarter = new Date(now.getFullYear(), 8, 30); // September 30
        }

        return (
          reportDate >= startOfLastQuarter && reportDate <= endOfLastQuarter
        );
      } else if (timePeriod === "thisquarter") {
        const startOfQuarter = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        );
        return reportDate >= startOfQuarter && reportDate <= now;
      } else if (timePeriod === "thisyear") {
        const firstDayOfThisYear = new Date(now.getFullYear(), 0, 1);
        return reportDate >= firstDayOfThisYear && reportDate <= now;
      } else if (timePeriod === "lastYear") {
        const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);
        return reportDate >= lastYearStart && reportDate <= lastYearEnd;
      }
      return true; // Default case: no filtering
    });
  };

  // Memoize filteredReports first before using it in other calculations
  const filteredReports = useMemo(
    () => filterReportsByTimePeriod(reports, timePeriod),
    [reports, timePeriod]
  );

  // Memoize function calls with filteredReports dependency
  const dailyProductRatesData = useMemo(
    () => getDailyProductRatesData(filteredReports),
    [filteredReports]
  );
  const dailySalesData = useMemo(
    () => getDailySalesData(filteredReports),
    [filteredReports]
  );
  const productSalesByStoreData = useMemo(
    () => getProductSalesByStoreData(filteredReports),
    [filteredReports]
  );
  const dailyProductSalesData = useMemo(
    () => getDailyProductSalesData(filteredReports),
    [filteredReports]
  );
  const productSalesData = useMemo(
    () => getTotalSalesByProduct(filteredReports),
    [filteredReports]
  );
  const storeSalesData = useMemo(
    () => getTotalSalesByStore(filteredReports),
    [filteredReports]
  );
  const managerSalesData = useMemo(
    () => getTotalSalesByManager(filteredReports),
    [filteredReports]
  );

  return (
    <Box m="1.5rem 2.5rem">
      <HeaderNew
        title="Sales Analytics"
        subtitle="Dive deep into your sales data"
      />

      {/* Time Period Selector */}
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h6" color="textSecondary" mr={2}>
          Time Period:
        </Typography>
        <Select
          value={timePeriod}
          onChange={handleTimePeriodChange}
          variant="outlined"
          style={{ color: "white", backgroundColor: theme.palette.grey[800] }}
        >
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="last3Days">Last 3 Days</MenuItem>
          <MenuItem value="last7Days">Last 7 Days</MenuItem>
          <MenuItem value="lastmonth">Last Month</MenuItem>
          <MenuItem value="thisweek">This Week</MenuItem>
          <MenuItem value="thismonth">This Month</MenuItem>
          <MenuItem value="thisquarter">This Quarter</MenuItem>
          <MenuItem value="thisyear">This Year</MenuItem>
          <MenuItem value="lastYear">Last Year</MenuItem>
        </Select>
      </Box>

      {/* Sales Overview Area Chart */}
      <Box
        gridColumn="span 12"
        gridRow="span 2"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
        mb={4}
      >
        <SalesOverviewAreaChart salesData={dailySalesData} />
      </Box>

      {/* Product Rates Line Chart */}
      <Box
        gridColumn="span 12"
        gridRow="span 2"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
        mb={4}
      >
        <ProductRatesLineChart ratesData={dailyProductRatesData} />
      </Box>

      {/* Product Sales by Store Bar Chart */}
      <Box
        gridColumn="span 12"
        gridRow="span 2"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
        mb={4}
      >
        <ProductSalesByStoreBarChart salesData={dailyProductSalesData} />
      </Box>

      {/* Radar Charts Display */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="20px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
      >
        <SalesRadarChart
          title="Sales by Product"
          salesData={productSalesData}
        />
        <SalesRadarChart title="Sales by Store" salesData={storeSalesData} />
        <SalesRadarChart
          title="Sales by Manager"
          salesData={managerSalesData}
        />
      </Box>

      {/* AI-Powered Insights */}
      <Box
        gridColumn="span 12"
        gridRow="span 2"
        mt={4}
        p="1rem"
        borderRadius="0.55rem"
        backgroundColor={theme.palette.background.alt}
      >
        <AIPoweredInsights />
      </Box>
    </Box>
  );
};

export default Analytics;
