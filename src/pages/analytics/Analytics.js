import React, { useEffect, useState } from "react";
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

const Analytics = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [timePeriod, setTimePeriod] = useState("month"); // Default to "This Month"

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

  // Transform reports data into daily sales totals
  const getDailySalesData = (reports) => {
    const dailySalesMap = {};

    reports.forEach((report) => {
      const date = report.date.split("T")[0];
      const storeName = report.storeName;
      const salesAmount = report.storeTotalSales?.totalSalesDollars || 0;

      if (!dailySalesMap[date]) {
        dailySalesMap[date] = {};
      }

      dailySalesMap[date][storeName] =
        (dailySalesMap[date][storeName] || 0) + salesAmount;
    });

    // Convert dailySalesMap into an array format compatible with the chart
    return Object.keys(dailySalesMap).map((date) => {
      const entry = { date };
      Object.keys(dailySalesMap[date]).forEach((storeName) => {
        entry[storeName] = dailySalesMap[date][storeName];
      });
      return entry;
    });
  };

  // Function to get daily rates data for each product (PMS, AGO, DPK)
  const getDailyProductRatesData = (reports) => {
    const productRatesMap = {};

    reports.forEach((report) => {
      const date = report.date.split("T")[0];

      if (!productRatesMap[date]) {
        productRatesMap[date] = { date, PMS: null, AGO: null, DPK: null };
      }

      // Store rates for each product if available
      if (report.products.PMS) {
        productRatesMap[date].PMS = report.products.PMS.rate || null;
      }
      if (report.products.AGO) {
        productRatesMap[date].AGO = report.products.AGO.rate || null;
      }
      if (report.products.DPK) {
        productRatesMap[date].DPK = report.products.DPK.rate || null;
      }
    });

    // Convert to array format for charting
    return Object.values(productRatesMap);
  };

  // Function to get totalSalesDollars by Product for each store
  const getProductSalesByStoreData = () => {
    const productSalesMap = {
      PMS: {},
      AGO: {},
      DPK: {},
    };

    reports.forEach((report) => {
      const storeName = report.storeName;

      if (report.products.PMS) {
        productSalesMap.PMS[storeName] =
          (productSalesMap.PMS[storeName] || 0) +
            report.products.PMS.totalSalesDollars || 0;
      }

      if (report.products.AGO) {
        productSalesMap.AGO[storeName] =
          (productSalesMap.AGO[storeName] || 0) +
            report.products.AGO.totalSalesDollars || 0;
      }

      if (report.products.DPK) {
        productSalesMap.DPK[storeName] =
          (productSalesMap.DPK[storeName] || 0) +
            report.products.DPK.totalSalesDollars || 0;
      }
    });

    // Convert to array format for charting
    return ["PMS", "AGO", "DPK"].map((product) => ({
      product,
      ...productSalesMap[product],
    }));
  };

  const getDailyProductSalesData = (reports) => {
    const dailySalesMap = {};

    reports.forEach((report) => {
      const date = report.date.split("T")[0];
      const products = report.products || {};

      if (!dailySalesMap[date]) {
        dailySalesMap[date] = { date, PMS: 0, AGO: 0, DPK: 0 };
      }

      // Sum up total sales for each product type
      dailySalesMap[date].PMS += products.PMS?.totalSalesDollars || 0;
      dailySalesMap[date].AGO += products.AGO?.totalSalesDollars || 0;
      dailySalesMap[date].DPK += products.DPK?.totalSalesDollars || 0;
    });

    // Convert to array format for the chart
    return Object.values(dailySalesMap);
  };

  // Total sales by product
  const getTotalSalesByProduct = (reports) => {
    const productSales = { PMS: 0, AGO: 0, DPK: 0 };

    reports.forEach((report) => {
      const products = report.products || {};
      productSales.PMS += products.PMS?.totalSalesDollars || 0;
      productSales.AGO += products.AGO?.totalSalesDollars || 0;
      productSales.DPK += products.DPK?.totalSalesDollars || 0;
    });

    return Object.keys(productSales).map((product) => ({
      category: product,
      totalSales: productSales[product],
    }));
  };

  // Total sales by store
  const getTotalSalesByStore = (reports) => {
    const storeSales = {};

    reports.forEach((report) => {
      const storeName = report.storeName;
      const salesAmount = report.storeTotalSales?.totalSalesDollars || 0;

      storeSales[storeName] = (storeSales[storeName] || 0) + salesAmount;
    });

    return Object.keys(storeSales).map((storeName) => ({
      category: storeName,
      totalSales: storeSales[storeName],
    }));
  };

  // Total sales by manager
  const getTotalSalesByManager = (reports) => {
    const managerSales = {};

    reports.forEach((report) => {
      const managerName = report.managerName;
      const salesAmount = report.storeTotalSales?.totalSalesDollars || 0;

      managerSales[managerName] =
        (managerSales[managerName] || 0) + salesAmount;
    });

    return Object.keys(managerSales).map((manager) => ({
      category: manager,
      totalSales: managerSales[manager],
    }));
  };

  // helper function to filter by time period
  /*   const filterReportsByTimePeriod = (reports, timePeriod) => {
    const now = new Date();
    let startDate;

    switch (timePeriod) {
      case "week":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "lastYear":
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      default:
        return reports;
    }

    return reports.filter((report) => new Date(report.date) >= startDate);
  }; */

  const filterReportsByTimePeriod = (reports, timePeriod) => {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // Set now to midnight UTC

    console.log("🚀 ~ filterReportsByTimePeriod ~ now:", now);
    return reports.filter((report) => {
      const reportDate = new Date(report.date);
      reportDate.setUTCHours(0, 0, 0, 0); // Set reportDate to midnight UTC

      if (timePeriod === "today") {
        return reportDate.toDateString() === now.toDateString();
      } else if (timePeriod === "last3Days") {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(now.getDate() - 3);
        return reportDate >= threeDaysAgo && reportDate <= now;
      } else if (timePeriod === "last7Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return reportDate >= sevenDaysAgo && reportDate <= now;
      } else if (timePeriod === "week") {
        const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
        const startOfWeek = new Date(now);
        startOfWeek.setDate(
          now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
        ); // Adjust for Monday start
        return reportDate >= startOfWeek && reportDate <= now;
      } else if (timePeriod === "month") {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return reportDate >= oneMonthAgo && reportDate <= now;
      } else if (timePeriod === "quarter") {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return reportDate >= threeMonthsAgo && reportDate <= now;
      } else if (timePeriod === "year") {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return reportDate >= oneYearAgo && reportDate <= now;
      } else if (timePeriod === "lastYear") {
        const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);
        return reportDate >= lastYearStart && reportDate <= lastYearEnd;
      }
      return true; // Default case: no filtering
    });
  };

  // apply the time period filter helpr function
  const filteredReports = filterReportsByTimePeriod(reports, timePeriod);
  // check if the time period selected has data
  const hasData = filteredReports && filteredReports.length > 0;

  // call all the functions so we can use the data in our charts
  const dailyProductRatesData = getDailyProductRatesData(filteredReports);
  const dailySalesData = getDailySalesData(filteredReports);
  //const productSalesByStoreData = getProductSalesByStoreData();
  const dailyProductSalesData = getDailyProductSalesData(filteredReports);
  // Generate data for radar charts
  const productSalesData = getTotalSalesByProduct(filteredReports);
  const storeSalesData = getTotalSalesByStore(filteredReports);
  const managerSalesData = getTotalSalesByManager(filteredReports);
  console.log("🚀 ~ Analytics ~ filteredReports:", filteredReports);

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
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="quarter">This Quarter</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
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
