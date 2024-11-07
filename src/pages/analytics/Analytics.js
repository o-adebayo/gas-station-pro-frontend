import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Typography,
  useTheme,
  Skeleton,
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

  const { isLoading } = useSelector((state) => state.report);

  /*   useEffect(() => {
    dispatch(getReports());
  }, [dispatch, timePeriod]); */

  useEffect(() => {
    if (!reports || reports.length === 0) {
      // Only fetch reports if the reports array is empty or undefined
      dispatch(getReports());
    }
  }, [dispatch, timePeriod, reports]);

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const filterReportsByTimePeriod = (reports, timePeriod) => {
    const now = dayjs().utc().startOf("day");

    return reports.filter((report) => {
      const reportDate = dayjs(report.date).utc().startOf("day");

      if (timePeriod === "today") {
        /*  console.log(
          "🚀 ~ returnreports.filter ~ timePeriod:",
          now.utc().date()
        ); */
        return reportDate.isSame(now, "day");
      } else if (timePeriod === "last3Days") {
        // Include today plus the last two full days
        const twoDaysAgo = now.subtract(2, "day");
        return reportDate.isBetween(twoDaysAgo, now, null, "[]");
      } else if (timePeriod === "last7Days") {
        const sevenDaysAgo = now.subtract(7, "day");
        return reportDate.isBetween(sevenDaysAgo, now, null, "[]");
      } else if (timePeriod === "thisweek") {
        const startOfWeek = now.startOf("week").add(1, "day"); // Start week on Monday
        return reportDate.isBetween(startOfWeek, now, null, "[]");
      } else if (timePeriod === "lastmonth") {
        const startOfLastMonth = now.subtract(1, "month").startOf("month");
        const endOfLastMonth = now.subtract(1, "month").endOf("month");
        return reportDate.isBetween(
          startOfLastMonth,
          endOfLastMonth,
          null,
          "[]"
        );
      } else if (timePeriod === "thismonth") {
        const startOfThisMonth = now.startOf("month");
        return reportDate.isBetween(startOfThisMonth, now, null, "[]");
      } else if (timePeriod === "lastquarter") {
        const currentQuarter = Math.floor((now.month() + 3) / 3);
        let startOfLastQuarter, endOfLastQuarter;

        if (currentQuarter === 1) {
          startOfLastQuarter = dayjs(`${now.year() - 1}-10-01`).utc();
          endOfLastQuarter = dayjs(`${now.year() - 1}-12-31`).utc();
        } else if (currentQuarter === 2) {
          startOfLastQuarter = dayjs(`${now.year()}-01-01`).utc();
          endOfLastQuarter = dayjs(`${now.year()}-03-31`).utc();
        } else if (currentQuarter === 3) {
          startOfLastQuarter = dayjs(`${now.year()}-04-01`).utc();
          endOfLastQuarter = dayjs(`${now.year()}-06-30`).utc();
        } else {
          startOfLastQuarter = dayjs(`${now.year()}-07-01`).utc();
          endOfLastQuarter = dayjs(`${now.year()}-09-30`).utc();
        }
        return reportDate.isBetween(
          startOfLastQuarter,
          endOfLastQuarter,
          null,
          "[]"
        );
      } else if (timePeriod === "thisquarter") {
        // Manually calculate the start of the current quarter
        const currentMonth = now.month();
        let startOfQuarter;

        if (currentMonth >= 0 && currentMonth <= 2) {
          startOfQuarter = dayjs(`${now.year()}-01-01`).utc();
        } else if (currentMonth >= 3 && currentMonth <= 5) {
          startOfQuarter = dayjs(`${now.year()}-04-01`).utc();
        } else if (currentMonth >= 6 && currentMonth <= 8) {
          startOfQuarter = dayjs(`${now.year()}-07-01`).utc();
        } else {
          startOfQuarter = dayjs(`${now.year()}-10-01`).utc();
        }

        // Debugging logs
        /*  console.log(
          "Start of this quarter (manual):",
          startOfQuarter.format("YYYY-MM-DD")
        );
        console.log("Current date:", now.format("YYYY-MM-DD")); */

        return reportDate.isBetween(startOfQuarter, now, null, "[]");
      } else if (timePeriod === "thisyear") {
        const startOfYear = now.startOf("year");
        return reportDate.isBetween(startOfYear, now, null, "[]");
      } else if (timePeriod === "lastYear") {
        const startOfLastYear = dayjs()
          .subtract(1, "year")
          .startOf("year")
          .utc();
        const endOfLastYear = dayjs().subtract(1, "year").endOf("year").utc();
        return reportDate.isBetween(startOfLastYear, endOfLastYear, null, "[]");
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

  const renderNoDataMessage = () => (
    <Typography
      variant="h6"
      color="textSecondary"
      align="center"
      sx={{ mt: 2 }}
    >
      No data available, please select a different time period.
    </Typography>
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
          <MenuItem value="thisweek">This Week</MenuItem>
          <MenuItem value="thismonth">This Month</MenuItem>
          <MenuItem value="thisquarter">This Quarter</MenuItem>
          <MenuItem value="thisyear">This Year</MenuItem>
          <MenuItem value="lastmonth">Last Month</MenuItem>
          <MenuItem value="lastquarter">Last Quarter</MenuItem>
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
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="300px"
            sx={{ borderRadius: "0.55rem", animation: "wave" }}
          />
        ) : filteredReports.length > 0 ? (
          <SalesOverviewAreaChart salesData={dailySalesData} />
        ) : (
          renderNoDataMessage()
        )}
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
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="300px"
            sx={{ borderRadius: "0.55rem", animation: "wave" }}
          />
        ) : filteredReports.length > 0 ? (
          <ProductRatesLineChart ratesData={dailyProductRatesData} />
        ) : (
          renderNoDataMessage()
        )}
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
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="300px"
            sx={{ borderRadius: "0.55rem", animation: "wave" }}
          />
        ) : filteredReports.length > 0 ? (
          <ProductSalesByStoreBarChart salesData={dailyProductSalesData} />
        ) : (
          renderNoDataMessage()
        )}
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
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height="300px"
              sx={{ borderRadius: "0.55rem", animation: "wave" }}
            />
          ))
        ) : filteredReports.length > 0 ? (
          <>
            <SalesRadarChart
              title="Sales by Product"
              salesData={productSalesData}
            />
            <SalesRadarChart
              title="Sales by Store"
              salesData={storeSalesData}
            />
            <SalesRadarChart
              title="Sales by Manager"
              salesData={managerSalesData}
            />
          </>
        ) : (
          <>
            {renderNoDataMessage()}
            {renderNoDataMessage()}
            {renderNoDataMessage()}
          </>
        )}
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
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="300px"
            sx={{ borderRadius: "0.55rem", animation: "wave" }}
          />
        ) : filteredReports.length > 0 ? (
          <AIPoweredInsights />
        ) : (
          renderNoDataMessage()
        )}
      </Box>
    </Box>
  );
};

export default Analytics;
