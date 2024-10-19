import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../../redux/features/report/reportSlice";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from "react-paginate";
import {
  FILTER_REPORTS,
  selectFilteredReports,
} from "../../redux/features/report/filterSlice";
import {
  fetchStoreLocations,
  selectStores,
} from "../../redux/features/storeLocation/storeLocationSlice";
import {
  fetchUsers,
  selectUsers,
  selectUser,
} from "../../redux/features/auth/authSlice";
import {
  getCompany,
  selectCompany,
} from "../../redux/features/company/companySlice"; // Import necessary functions
import { toast } from "react-toastify"; // Import toast for notifications
import "./SalesList.scss";
import { SpinnerImg } from "../../components/loader/Loader";

const SalesList = () => {
  const dispatch = useDispatch();

  const reports = useSelector((state) => state.report.reports);
  const filteredReports = useSelector(selectFilteredReports);
  const { isLoading } = useSelector((state) => state.report);

  const storesData = useSelector(selectStores); // Get the stores object
  const stores = storesData?.stores || []; // Ensure stores is an array inside storesData.stores

  const users = useSelector(selectUsers) || []; // Ensure users is an array

  const currentUser = useSelector(selectUser); // Get the logged-in user
  const company = useSelector(selectCompany); // Get the company information

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const [searchParams, setSearchParams] = useState({
    startDate: null,
    endDate: null,
    reportId: "",
    storeName: "",
    managerName: "",
  });

  const [exportData, setExportData] = useState([]);
  const [totalSalesLiters, setTotalSalesLiters] = useState(0);
  const [totalSalesNaira, setTotalSalesNaira] = useState(0);

  // Fetch reports, store locations, users, and company information when the component mounts
  const fetchInitialData = async () => {
    await dispatch(getReports());
    await dispatch(fetchStoreLocations());
    await dispatch(fetchUsers());

    // Fetch the company details based on the user's company ID
    if (currentUser?.companyId) {
      await dispatch(getCompany(currentUser.companyId));
    }
  };

  // Check if export is allowed based on the company's plan
  const isExportAllowed = () => {
    const companyPlan = company.company.planType;
    return companyPlan === "Platinum" || companyPlan === "Enterprise";
  };

  // Handle export click
  const handleExportClick = () => {
    if (!isExportAllowed()) {
      toast.error(
        "Export feature is not available for Gold plan members. Please contact Sales."
      );
    }
  };

  // Handle filter and pagination when user clicks "Fetch Data"
  const applyFiltersAndFetch = () => {
    dispatch(
      FILTER_REPORTS({
        reports,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        storeName: searchParams.storeName,
        managerName: searchParams.managerName,
        reportId: searchParams.reportId, // Filter by report ID
      })
    );
  };

  // Calculate totals and update paginated items
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredReports.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredReports.length / itemsPerPage));

    // Calculate total sales liters and naira
    const totalLiters = filteredReports.reduce(
      (acc, report) => acc + (report.storeTotalSales?.totalSalesLiters || 0),
      0
    );
    const totalNaira = filteredReports.reduce(
      (acc, report) => acc + (report.storeTotalSales?.totalSalesDollars || 0),
      0
    );

    setTotalSalesLiters(totalLiters);
    setTotalSalesNaira(totalNaira);

    // Set up data for CSV export
    setExportData(
      filteredReports.map((report) => {
        const {
          _id,
          date,
          storeName,
          managerName,
          products,
          storeTotalSales,
          notes,
        } = report;

        return {
          reportId: _id.toString(),
          Date: new Date(date).toISOString().split("T")[0],
          StoreName: storeName,
          ManagerName: managerName,
          PMS_Opening: products?.PMS?.dippingTanks?.[0]?.opening || "N/A",
          PMS_Closing: products?.PMS?.dippingTanks?.[0]?.closing || "N/A",
          PMS_Sales: products?.PMS?.dippingTanks?.[0]?.sales || "N/A",
          PMS_Rate: products?.PMS?.rate || "N/A",
          PMS_POS: products?.PMS?.totalSalesBreakdown?.pos || 0,
          PMS_Cash: products?.PMS?.totalSalesBreakdown?.cash || 0,
          PMS_Expenses: products?.PMS?.totalSalesBreakdown?.expenses || 0,
          DPK_Opening: products?.DPK?.dippingTanks?.[0]?.opening || "N/A",
          DPK_Closing: products?.DPK?.dippingTanks?.[0]?.closing || "N/A",
          DPK_Sales: products?.DPK?.dippingTanks?.[0]?.sales || "N/A",
          DPK_Rate: products?.DPK?.rate || "N/A",
          DPK_POS: products?.DPK?.totalSalesBreakdown?.pos || 0,
          DPK_Cash: products?.DPK?.totalSalesBreakdown?.cash || 0,
          DPK_Expenses: products?.DPK?.totalSalesBreakdown?.expenses || 0,
          AGO_Opening: products?.AGO?.dippingTanks?.[0]?.opening || "N/A",
          AGO_Closing: products?.AGO?.dippingTanks?.[0]?.closing || "N/A",
          AGO_Sales: products?.AGO?.dippingTanks?.[0]?.sales || "N/A",
          AGO_Rate: products?.AGO?.rate || "N/A",
          AGO_POS: products?.AGO?.totalSalesBreakdown?.pos || 0,
          AGO_Cash: products?.AGO?.totalSalesBreakdown?.cash || 0,
          AGO_Expenses: products?.AGO?.totalSalesBreakdown?.expenses || 0,
          Total_Sales_Liters: storeTotalSales?.totalSalesLiters || 0,
          Total_Sales_Dollars: storeTotalSales?.totalSalesDollars || 0,
          Notes: notes || "N/A",
        };
      })
    );
  }, [itemOffset, itemsPerPage, filteredReports]);

  // Handle Pagination Click
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredReports.length;
    setItemOffset(newOffset);
    setCurrentPage(event.selected); // Update current page
  };

  // Handle input changes for search filters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  useEffect(() => {
    fetchInitialData();
  }, [dispatch]);

  return (
    <div className="detailed-sales-report">
      <h2>Detailed Sales Report</h2>

      {/* Filter Inputs */}
      <div className="filter-container">
        <div className="date-range">
          <label>From: </label>
          <DatePicker
            selected={searchParams.startDate}
            onChange={(date) =>
              setSearchParams({ ...searchParams, startDate: date })
            }
            placeholderText="Start Date"
          />
          <label>To: </label>
          <DatePicker
            selected={searchParams.endDate}
            onChange={(date) =>
              setSearchParams({ ...searchParams, endDate: date })
            }
            placeholderText="End Date"
          />
        </div>

        <div className="input-fields">
          {/* Store Dropdown */}
          <select
            name="storeName"
            value={searchParams.storeName}
            onChange={handleInputChange}
          >
            <option value="">Select Store</option>
            {stores?.length > 0 ? (
              stores.map((store) => (
                <option key={store._id} value={store.name}>
                  {store.name}
                </option>
              ))
            ) : (
              <option disabled>No stores available</option>
            )}
          </select>

          {/* Manager Dropdown */}
          <select
            name="managerName"
            value={searchParams.managerName}
            onChange={handleInputChange}
          >
            <option value="">Select Manager</option>
            {users?.length > 0 ? (
              users
                .filter((user) => user.role === "manager")
                .map((manager) => (
                  <option key={manager._id} value={manager.name}>
                    {manager.name}
                  </option>
                ))
            ) : (
              <option disabled>No managers available</option>
            )}
          </select>

          <input
            type="text"
            name="reportId"
            value={searchParams.reportId}
            onChange={handleInputChange}
            placeholder="Report ID"
          />
        </div>

        <button onClick={applyFiltersAndFetch} className="btn-fetch">
          Fetch Data
        </button>
      </div>

      {/* Display Total Sales */}
      <div className="totals-display">
        <h4>Total Sales Liters: {totalSalesLiters.toLocaleString()} Liters</h4>
        <h4>Total Sales Naira: ₦{totalSalesNaira.toLocaleString()}</h4>
      </div>

      {/* Table of Reports */}
      <div className="table-container">
        {isLoading && <SpinnerImg />}
        <table>
          <thead>
            <tr>
              <th>s/n</th>
              <th>Date</th>
              <th>Store Name</th>
              <th>Manager Name</th>
              <th>POS Rate</th>
              <th>PMS POS (₦)</th>
              <th>PMS Cash (₦)</th>
              <th>DPK Rate</th>
              <th>DPK POS (₦)</th>
              <th>DPK Cash (₦)</th>
              <th>AGO Rate</th>
              <th>AGO POS (₦)</th>
              <th>AGO Cash (₦)</th>
              <th>Total Sales (Liters)</th>
              <th>Total Sales (₦)</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((report, index) => {
              const PMS = report.products?.PMS || {};
              const DPK = report.products?.DPK || {};
              const AGO = report.products?.AGO || {};
              const PMSBreakdown = PMS?.totalSalesBreakdown || {};
              const DPKBreakdown = DPK?.totalSalesBreakdown || {};
              const AGOBreakdown = AGO?.totalSalesBreakdown || {};

              return (
                <tr key={report._id}>
                  <td>{index + 1}</td>
                  <td>{new Date(report.date).toISOString().split("T")[0]}</td>
                  <td>{report.storeName || "N/A"}</td>
                  <td>{report.managerName || "N/A"}</td>
                  <td>{PMS.rate || "N/A"}</td>
                  <td>₦{PMSBreakdown.pos || 0}</td>
                  <td>₦{PMSBreakdown.cash || 0}</td>
                  <td>{DPK.rate || "N/A"}</td>
                  <td>₦{DPKBreakdown.pos || 0}</td>
                  <td>₦{DPKBreakdown.cash || 0}</td>
                  <td>{AGO.rate || "N/A"}</td>
                  <td>₦{AGOBreakdown.pos || 0}</td>
                  <td>₦{AGOBreakdown.cash || 0}</td>
                  <td>
                    {report.storeTotalSales?.totalSalesLiters || 0} Liters
                  </td>
                  <td>
                    ₦
                    {report.storeTotalSales?.totalSalesDollars?.toLocaleString() ||
                      0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />

      {/* CSV Export */}
      <div className="export-button">
        <CSVLink
          data={exportData}
          filename={`sales_report_${new Date().toISOString()}.csv`}
          className={`btn-export ${
            exportData.length === 0 || !isExportAllowed() ? "disabled" : ""
          }`}
          style={{
            pointerEvents:
              exportData.length === 0 || !isExportAllowed() ? "none" : "auto",
          }}
          onClick={handleExportClick} // Handle export click
        >
          Export CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default SalesList;
