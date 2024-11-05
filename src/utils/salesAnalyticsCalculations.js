// Helper functions to be used in different files

// Transform reports data into daily sales totals
export const getDailySalesData = (reports) => {
  const dailySalesMap = {};

  reports.forEach((report) => {
    const date = report.date.split("T")[0];
    console.log("🚀 ~ reports.forEach ~ date:", date);

    const storeName = report.storeName;
    const salesAmount = report.storeTotalSales?.totalSalesDollars || 0;

    if (!dailySalesMap[date]) {
      dailySalesMap[date] = {};
    }

    dailySalesMap[date][storeName] =
      (dailySalesMap[date][storeName] || 0) + salesAmount;
  });

  return Object.keys(dailySalesMap).map((date) => {
    const entry = { date };
    Object.keys(dailySalesMap[date]).forEach((storeName) => {
      entry[storeName] = dailySalesMap[date][storeName];
    });
    return entry;
  });
};

// Function to get daily rates data for each product (PMS, AGO, DPK)
export const getDailyProductRatesData = (reports) => {
  const productRatesMap = {};

  reports.forEach((report) => {
    const date = report.date.split("T")[0];

    if (!productRatesMap[date]) {
      productRatesMap[date] = { date, PMS: null, AGO: null, DPK: null };
    }

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

  return Object.values(productRatesMap);
};

// Function to get totalSalesDollars by Product for each store
export const getProductSalesByStoreData = (reports) => {
  const productSalesMap = { PMS: {}, AGO: {}, DPK: {} };

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

  return ["PMS", "AGO", "DPK"].map((product) => ({
    product,
    ...productSalesMap[product],
  }));
};

export const getDailyProductSalesData = (reports) => {
  const dailySalesMap = {};

  reports.forEach((report) => {
    const date = report.date.split("T")[0];
    const products = report.products || {};

    if (!dailySalesMap[date]) {
      dailySalesMap[date] = { date, PMS: 0, AGO: 0, DPK: 0 };
    }

    dailySalesMap[date].PMS += products.PMS?.totalSalesDollars || 0;
    dailySalesMap[date].AGO += products.AGO?.totalSalesDollars || 0;
    dailySalesMap[date].DPK += products.DPK?.totalSalesDollars || 0;
  });

  return Object.values(dailySalesMap);
};

// Total sales by product
export const getTotalSalesByProduct = (reports) => {
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
export const getTotalSalesByStore = (reports) => {
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
export const getTotalSalesByManager = (reports) => {
  const managerSales = {};

  reports.forEach((report) => {
    const managerName = report.managerName;
    const salesAmount = report.storeTotalSales?.totalSalesDollars || 0;

    managerSales[managerName] = (managerSales[managerName] || 0) + salesAmount;
  });

  return Object.keys(managerSales).map((manager) => ({
    category: manager,
    totalSales: managerSales[manager],
  }));
};
