// src/utils/salesCalculations.js

// Function to calculate total sales (dollars and liters) for the current and previous periods
export const calculateTotalSales = (salesReports) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  const previousMonthDate = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1)
  );
  const previousMonth = previousMonthDate.toLocaleString("default", {
    month: "long",
  });
  const previousYear = previousMonthDate.getFullYear();

  let totalSalesDollarsForMonth = 0;
  let totalSalesLitersForMonth = 0;
  let totalSalesDollarsForYear = 0;
  let totalSalesLitersForYear = 0;

  let totalSalesDollarsForPreviousMonth = 0;
  let totalSalesLitersForPreviousMonth = 0;
  let totalSalesDollarsForPreviousYear = 0;
  let totalSalesLitersForPreviousYear = 0;

  salesReports.forEach((report) => {
    if (report.month === currentMonth && report.year === currentYear) {
      totalSalesDollarsForMonth += report.storeTotalSales.totalSalesDollars;
      totalSalesLitersForMonth += report.storeTotalSales.totalSalesLiters;
    }
    if (report.year === currentYear) {
      totalSalesDollarsForYear += report.storeTotalSales.totalSalesDollars;
      totalSalesLitersForYear += report.storeTotalSales.totalSalesLiters;
    }
    if (report.month === previousMonth && report.year === currentYear) {
      totalSalesDollarsForPreviousMonth +=
        report.storeTotalSales.totalSalesDollars;
      totalSalesLitersForPreviousMonth +=
        report.storeTotalSales.totalSalesLiters;
    }
    if (report.year === previousYear) {
      totalSalesDollarsForPreviousYear +=
        report.storeTotalSales.totalSalesDollars;
      totalSalesLitersForPreviousYear +=
        report.storeTotalSales.totalSalesLiters;
    }
  });

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
};

// Function to calculate monthly sales for each month of the current year
export const calculateMonthlySales = (salesReports) => {
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
};

// Function to calculate total sales by store each month
export const calculateStoreMonthlySales = (salesReports) => {
  const currentYear = new Date().getFullYear();
  const storeSalesData = {};

  salesReports.forEach((report) => {
    if (report.year === currentYear) {
      const { month, storeName, storeTotalSales } = report;
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
      storeSalesData[storeName][month] += storeTotalSales.totalSalesDollars;
    }
  });

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

  return months.map((month) => {
    const dataPoint = { name: month };
    Object.keys(storeSalesData).forEach((storeName) => {
      dataPoint[storeName] = storeSalesData[storeName][month];
    });
    return dataPoint;
  });
};

// Function to calculate sales by store for the current month
export const calculateCurrentMonthSales = (salesReports) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  const storeSales = {};
  salesReports.forEach((report) => {
    if (report.month === currentMonth && report.year === currentYear) {
      const { storeName, storeTotalSales } = report;
      storeSales[storeName] =
        (storeSales[storeName] || 0) + storeTotalSales.totalSalesDollars;
    }
  });

  return Object.keys(storeSales).map((storeName) => ({
    name: storeName,
    value: storeSales[storeName],
  }));
};

// Function to calculate total sales for each store in the current year
export const calculateStoreSalesForCurrentYear = (salesReports) => {
  const currentYear = new Date().getFullYear();
  const storeSales = {};

  salesReports.forEach((report) => {
    if (report.year === currentYear) {
      const { storeName, storeTotalSales } = report;
      storeSales[storeName] =
        (storeSales[storeName] || 0) + storeTotalSales.totalSalesDollars;
    }
  });

  return Object.keys(storeSales).map((storeName) => ({
    name: storeName,
    value: storeSales[storeName],
  }));
};

// Function to calculate sales by product type for the current month
export const calculateProductSalesForCurrentMonth = (salesReports) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
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
};

// Function to calculate sales by product type for the current year
export const calculateProductSalesForCurrentYear = (salesReports) => {
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
};

// Function to calculate sales for a specific store
export const calculateStoreSales = (salesReports) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  const previousMonthDate = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1)
  );
  const previousMonth = previousMonthDate.toLocaleString("default", {
    month: "long",
  });
  const previousYear = previousMonthDate.getFullYear();

  let totalSalesDollarsForMonth = 0;
  let totalSalesLitersForMonth = 0;
  let totalSalesDollarsForYear = 0;
  let totalSalesLitersForYear = 0;

  let totalSalesDollarsForPreviousMonth = 0;
  let totalSalesLitersForPreviousMonth = 0;
  let totalSalesDollarsForPreviousYear = 0;
  let totalSalesLitersForPreviousYear = 0;

  salesReports.forEach((report) => {
    if (report.month === currentMonth && report.year === currentYear) {
      totalSalesDollarsForMonth += report.storeTotalSales.totalSalesDollars;
      totalSalesLitersForMonth += report.storeTotalSales.totalSalesLiters;
    }
    if (report.year === currentYear) {
      totalSalesDollarsForYear += report.storeTotalSales.totalSalesDollars;
      totalSalesLitersForYear += report.storeTotalSales.totalSalesLiters;
    }
    if (report.month === previousMonth && report.year === currentYear) {
      totalSalesDollarsForPreviousMonth +=
        report.storeTotalSales.totalSalesDollars;
      totalSalesLitersForPreviousMonth +=
        report.storeTotalSales.totalSalesLiters;
    }
    if (report.year === previousYear) {
      totalSalesDollarsForPreviousYear +=
        report.storeTotalSales.totalSalesDollars;
      totalSalesLitersForPreviousYear +=
        report.storeTotalSales.totalSalesLiters;
    }
  });

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
};

// Function to calculate monthly sales for a specific store
export const calculateMonthlySalesForStore = (salesReports) => {
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
};

// Function to calculate product sales by product type for the current month
export const calculateProductSalesForCurrentMonthForStore = (salesReports) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
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
};

// Function to calculate product sales by product type for the current year
export const calculateProductSalesForCurrentYearForStore = (salesReports) => {
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
};

// Function to filter reports for the current month
// this will return the actual reports and not the summed up total values
// Example filter function for current month
export const filterReportsForCurrentMonth = (reports) => {
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  return reports.filter(
    (report) => report.month === currentMonth && report.year === currentYear
  );
};

// Example filter function for current year
export const filterReportsForCurrentYear = (reports) => {
  const currentYear = new Date().getFullYear();

  return reports.filter((report) => report.year === currentYear);
};
