import React, { useEffect, useState } from "react";
import "./reportList.scss";
import { SpinnerImg } from "../../loader/Loader";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Search from "../../search/Search";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_REPORTS,
  selectFilteredReports,
} from "../../../redux/features/report/filterSlice";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {
  deleteReport,
  getReports,
} from "../../../redux/features/report/reportSlice";

const ReportList = ({ reports, isLoading }) => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering
  const filteredReports = useSelector(selectFilteredReports);
  const dispatch = useDispatch();

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  // actual function that dispatches the delete action
  // we need to call the function from reportSlice so we will use useDispatch
  const delReport = async (id) => {
    await dispatch(deleteReport(id));
    // Now get the latest reports again from the database so we call it from redux reportSlice
    await dispatch(getReports());
  };

  //function to add confirm delete alert dialog
  // we need to send the id of the report
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Report",
      message: "Are you sure you want to delete this report.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delReport(id),
        },
        {
          label: "Cancel",
          //onClick: () => alert('Click No')
        },
      ],
    });
  };

  //   Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredReports.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredReports.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredReports]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredReports.length;
    setItemOffset(newOffset);
  };
  //   End Pagination

  //configure for changes in the search  box
  // and then we add dependencies with [ , ] which means any time they change
  // trigger this function
  // Trigger filtering on search, date range, or reports change
  useEffect(() => {
    dispatch(FILTER_REPORTS({ reports, search, startDate, endDate }));
  }, [reports, search, startDate, endDate, dispatch]);

  return (
    <div className="report-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Sales Reports</h3>
          </span>

          {/* Date range filter */}
          <div className="date-filter --flex-between">
            <div className="--flex-dir-row --align-center">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="--flex-dir-row --align-center">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate || startDate} // Default to the start date if no end date
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <span>
            <Search
              value={search}
              placeholder="Search by store or manager"
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && reports.length === 0 ? (
            <p>-- No reports found...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Date</th>
                  <th>Store Name</th>
                  <th>Manager Name</th>
                  <th>Products</th>
                  <th>Total Sales (Lt)</th>
                  <th>Total Sales (₦)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((report, index) => {
                  const {
                    _id,
                    date,
                    storeName, // Store name field
                    managerName, // Manager name field
                    products = {}, // Default empty object for products
                    storeTotalSales = {}, // Default empty object for storeTotalSales
                  } = report;

                  // Format the date in UTC to "YYYY-MM-DD" (similar to validateDate function)
                  const reportDate = new Date(date).toISOString().split("T")[0]; // Ensures the date is in UTC and without time

                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{reportDate}</td> {/* Display formatted date */}
                      {/* <td>
                        {new Date(date).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                        })}
                      </td> */}
                      <td>{storeName || "N/A"}</td> {/* Use storeName field */}
                      <td>{managerName || "N/A"}</td>{" "}
                      {/* Use managerName field */}
                      <td>
                        {Object.keys(products).length > 0
                          ? Object.keys(products).join(", ")
                          : "N/A"}
                      </td>{" "}
                      {/* List of product names or N/A if no products */}
                      <td>
                        {storeTotalSales?.totalSalesLiters || 0}
                        {" Litres"}
                      </td>
                      <td>
                        {"₦"}
                        {storeTotalSales?.totalSalesDollars?.toLocaleString() ||
                          0}
                      </td>
                      <td className="icons">
                        <span title="View Report">
                          <Link to={`/report-detail/${_id}`}>
                            <AiOutlineEye size={25} color={"purple"} />
                          </Link>
                        </span>
                        <span title="Edit Report">
                          <Link to={`/edit-report/${_id}`}>
                            <FaEdit size={20} color={"green"} />
                          </Link>
                        </span>
                        <span title="Delete Report">
                          <FaTrashAlt
                            size={20}
                            color={"red"}
                            onClick={() => confirmDelete(_id)}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
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
      </div>
    </div>
  );
};

export default ReportList;
