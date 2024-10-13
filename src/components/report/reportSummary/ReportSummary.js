import React from "react";
import "./ReportSummary.scss";
import { BiCategory } from "react-icons/bi";
import { FaGasPump, FaStore, FaUserTie } from "react-icons/fa";
import InfoBox from "../../infoBox/InfoBox";
import { TbCurrencyNaira } from "react-icons/tb";

// Icons
const earningIcon = <TbCurrencyNaira size={40} color="#fff" />;
const pumpIcon = <FaGasPump size={40} color="#fff" />;
const categoryIcon = <BiCategory size={40} color="#fff" />;
const storeIcon = <FaStore size={40} color="#fff" />;
const managerIcon = <FaUserTie size={40} color="#fff" />;

const ReportSummary = ({ reports = [], userRole }) => {
  // Get unique store count (by storeId)

  const uniqueStores = new Set(
    reports.map((report) => report.storeId.toString())
  ).size;

  // Loop through reports to get all unique products
  const uniqueProducts = new Set(
    reports.flatMap((report) => Object.keys(report.products || {}))
  ).size;

  // Get unique manager count (by managerName)
  const uniqueManagers = new Set(reports.map((report) => report.managerName))
    .size;

  // Calculate total sales in Liters across all products
  const totalSalesLiters = reports.reduce((total, report) => {
    const productSalesLiters = Object.values(report.products || {}).reduce(
      (sum, product) => sum + (product.totalSalesLiters || 0),
      0
    );
    return total + productSalesLiters;
  }, 0);

  // Calculate total sales in Dollars across all products
  const totalSalesDollars = reports.reduce((total, report) => {
    const productSalesDollars = Object.values(report.products || {}).reduce(
      (sum, product) => sum + (product.totalSalesDollars || 0),
      0
    );
    return total + productSalesDollars;
  }, 0);

  // Determine whether to show "Company Stats" or "Store Stats"
  const title = userRole === "admin" ? "Company Stats" : "Store Stats";

  // Return the final summary display
  return (
    <div className="report-summary">
      <h3 className="--mt">{title}</h3>
      <div className="info-summary">
        {userRole === "admin" && (
          <InfoBox
            icon={storeIcon}
            title={"Stores"}
            count={uniqueStores}
            bgColor="card1"
          />
        )}
        <InfoBox
          icon={managerIcon}
          title={"Managers"}
          count={uniqueManagers}
          bgColor="card5"
        />
        <InfoBox
          icon={categoryIcon}
          title={"Products"}
          count={uniqueProducts}
          bgColor="card3"
        />
        <InfoBox
          icon={pumpIcon}
          title={"Total Sales (Litres)"}
          count={totalSalesLiters.toLocaleString()} // Formatting liters
          bgColor="card4"
        />
        <InfoBox
          icon={earningIcon}
          title={"Total Sales"}
          count={`₦${totalSalesDollars.toLocaleString()}`} // Formatting money
          bgColor="card2"
        />
      </div>
    </div>
  );
};

export default ReportSummary;
