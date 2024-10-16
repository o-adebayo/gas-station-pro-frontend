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
import { selectUser } from "../../../redux/features/auth/authSlice";
import Popup from "reactjs-popup"; // Import reactjs-popup
import "reactjs-popup/dist/index.css"; // Import css for popup
import { toast } from "react-toastify";
import {
  getCompanyByCode,
  selectCompany,
} from "../../../redux/features/company/companySlice";
import {
  EMAIL_RESET,
  sendAutomatedEmail,
} from "../../../redux/features/email/emailSlice";

const ReportList = ({ reports, isLoading }) => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(""); // Start date for filtering
  const [endDate, setEndDate] = useState(""); // End date for filtering
  const [deleteCode, setDeleteCode] = useState(""); // Store delete code
  const [selectedReportId, setSelectedReportId] = useState(null); // Store selected report ID for delete
  const filteredReports = useSelector(selectFilteredReports);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const companyResponse = useSelector(selectCompany); // Fetch company details
  const company = companyResponse?.company || {}; // Destructure company details

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  useEffect(() => {
    // Fetch company details by user's company code when the component mounts
    if (user?.companyCode) {
      dispatch(getCompanyByCode(user.companyCode));
    }
  }, [dispatch, user]);

  // Function to delete the report without a code (for admins)
  /*   const delReport = async (id) => {
    await dispatch(deleteReport({ id })); // Pass the id as an object
    await dispatch(getReports());
  }; */
  // Function to delete the report without a code (for admins)
  const delReport = async (id) => {
    try {
      const reportToDelete = reports.find((report) => report._id === id); // Get report details

      await dispatch(deleteReport({ id })); // Pass the id as an object
      await dispatch(getReports()); // Refresh report list

      // Send email to company owner after deletion
      if (company && company.ownerEmail) {
        const emailData = {
          subject: `${company.name} - Sales Report Deleted`,
          send_to: company.ownerEmail,
          reply_to: "noreply@gasstationpro.com",
          template: "reportDeleted", // Use the "reportDeleted" template you created
          name: user?.name, // The user who deleted the report
          companyCode: null,
          url: null,
          ownerName: company.ownerName,
          companyName: company.name,
          storeName: reportToDelete.storeName, // Store name
          managerName: null,
          reportDate: new Date(reportToDelete.date).toISOString().split("T")[0], // Format the date
          updatedDate: new Date().toISOString().split("T")[0], // updatedDate used as Deletion date as today's date
        };

        await dispatch(sendAutomatedEmail(emailData));
        dispatch(EMAIL_RESET());
        toast.success("Email notification sent to the owner.");
      }
    } catch (error) {
      toast.error("Error deleting report or sending email: " + error.message);
    }
  };

  // Function to delete the report with a code (for non-admins)
  // Function to delete the report with a code (for non-admins)
  /*   const delReportWithCode = async (id, deleteCode) => {
    await dispatch(deleteReport({ id, deleteCode })); // Pass both id and deleteCode
    await dispatch(getReports()); // Refresh the report list
  };
 */
  // Function to delete the report with a code (for non-admins)
  const delReportWithCode = async (id, deleteCode) => {
    try {
      const reportToDelete = reports.find((report) => report._id === id);

      await dispatch(deleteReport({ id, deleteCode })); // Pass both id and deleteCode
      await dispatch(getReports()); // Refresh report list

      // Send email to company owner after deletion
      if (company && company.ownerEmail) {
        const emailData = {
          subject: `${company.name} - Sales Report Deleted`,
          send_to: company.ownerEmail,
          reply_to: "noreply@gasstationpro.com",
          template: "reportDeleted",
          name: user?.name,
          companyCode: null,
          ownerName: company.ownerName,
          storeName: reportToDelete.storeName,
          reportCreationDate: new Date(reportToDelete.date)
            .toISOString()
            .split("T")[0],
          deletionDate: new Date().toISOString().split("T")[0],
          deletedBy: user?.name,
        };

        await dispatch(sendAutomatedEmail(emailData));
        dispatch(EMAIL_RESET());
        toast.success("Email notification sent to the owner.");
      }
    } catch (error) {
      toast.error("Error deleting report or sending email: " + error.message);
    }
  };

  const handleOnClickEdit = () => {
    toast.info(
      "Edit feature coming soon, please delete and recreate in the meantime"
    );
  };

  // Function to handle the delete action with reactjs-popup
  const handleDeleteClick = (id) => {
    if (user.role === "admin") {
      // Admins do not need a delete code
      confirmAlert({
        title: "Delete Report",
        message: "Are you sure you want to delete this report?",
        buttons: [
          {
            label: "Delete",
            onClick: () => delReport(id),
          },
          {
            label: "Cancel",
          },
        ],
      });
    } else {
      // For non-admins, show the popup
      setSelectedReportId(id); // Store the ID of the selected report
    }
  };

  // Begin Pagination
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
  // End Pagination

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

                  // Format the date in UTC to "YYYY-MM-DD"
                  const reportDate = new Date(date).toISOString().split("T")[0]; // Ensures the date is in UTC and without time

                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{reportDate}</td> {/* Display formatted date */}
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
                        {
                          <span title="Edit Report">
                            <Link to={`/edit-report/${_id}`}>
                              <FaEdit size={20} color={"green"} />
                            </Link>
                          </span>
                        }

                        {/* <span title="Edit Report">
                          <FaEdit
                            size={20}
                            color={"green"}
                            onClick={() => handleOnClickEdit()} // Handle delete click. Once we fix issue with edit report sharing values with multiple fields, use the commented one above
                          />
                        </span> */}
                        <span title="Delete Report">
                          <FaTrashAlt
                            size={20}
                            color={"red"}
                            onClick={() => handleDeleteClick(_id)} // Handle delete click
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

        {/* Reactjs-popup for asking delete code */}
        <Popup
          open={!!selectedReportId}
          onClose={() => setSelectedReportId(null)}
        >
          <div className="popup-content">
            <h4>Enter Delete Code</h4>
            <input
              type="text"
              value={deleteCode}
              onChange={(e) => setDeleteCode(e.target.value)}
              placeholder="Delete Code"
            />
            <div className="popup-actions">
              <button
                className="--btn --btn-primary"
                onClick={() => {
                  if (deleteCode) {
                    //console.log("report id", selectedReportId);
                    //console.log("delete code", deleteCode);

                    delReportWithCode(selectedReportId, deleteCode);
                    setSelectedReportId(null); // Close popup
                    setDeleteCode(""); // Reset delete code input
                  } else {
                    toast.info("Delete code is required.");
                  }
                }}
              >
                Submit
              </button>
              <button
                className="--btn --btn-secondary"
                onClick={() => {
                  setSelectedReportId(null); // Close popup
                  setDeleteCode(""); // Reset delete code input
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Popup>

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
