import React, { useEffect, useState } from "react";
import { SpinnerImg } from "../../loader/Loader";
import { Link } from "react-router-dom";
import Search from "../../search/Search";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Skeleton,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import HeaderNew from "../../HeaderNew";
import DataGridCustomToolbar from "../../DataGridCustomToolbar";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useDispatch, useSelector } from "react-redux";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {
  deleteReport,
  getDetailedSalesReports,
  //getReports,
  importReports,
} from "../../../redux/features/report/reportSlice";
import { selectUser } from "../../../redux/features/auth/authSlice";
import "reactjs-popup/dist/index.css"; // Import css for popup
import { toast } from "react-toastify";
import {
  //getCompanyByCode,
  selectCompany,
} from "../../../redux/features/company/companySlice";
import {
  EMAIL_RESET,
  sendAutomatedEmail,
} from "../../../redux/features/email/emailSlice";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import dayjs from "dayjs";
//import FlexBetween from "../../FlexBetween";

const ReportListNew = () => {
  const theme = useTheme();
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  // values to be sent to the backend
  //const [page, setPage] = useState(0);
  //const [pageSize, setPageSize] = useState(20);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  //const [sortModel, setSortModel] = useState([]);
  const [sortModel, setSortModel] = useState([
    {
      field: "date", // Specify the column to sort
      sort: "desc", // Set the default sort order to descending
    },
  ]);

  // Get initial pageSize from localStorage or use default 25
  /*   const [pageSize, setPageSize] = useState(
    () => parseInt(localStorage.getItem("pageSize")) || 20
  ); */

  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [deleteCode, setDeleteCode] = useState(""); // Store delete code
  const [selectedReportId, setSelectedReportId] = useState(null); // Store selected report ID for delete
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reportIdToDelete, setReportIdToDelete] = useState(null);
  const [deleteCodeInput, setDeleteCodeInput] = useState("");
  const [openCodeDialog, setOpenCodeDialog] = useState(false); // For managers

  const user = useSelector(selectUser);
  const companyResponse = useSelector(selectCompany); // Fetch company details
  const company = companyResponse?.company || {}; // Destructure company details
  //const reports = useSelector(selectReports);
  const { reports } = useSelector((state) => {
    const reportsData = state.report.reports || {}; // Default to an empty object
    return reportsData.reports ? reportsData : { reports: reportsData }; // Return an object with reports key
  });
  const { total } = useSelector((state) => state.report.reports);
  const { isLoading } = useSelector((state) => state.report);
  console.log("🚀 ~ ReportListNew ~ isLoading:", isLoading);

  const isAdmin = user?.role === "admin"; // Check if the user is an admin

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date Created",
      flex: 1,
      renderCell: (params) => {
        //const date = new Date(params.value);
        //const date = dayjs(params.value).utc(true).format("LL");
        //const date = dayjs(params.value).utc().format("YYYY-MMMM-DD");
        const date = dayjs(params.value).utc().format("MMMM DD, YYYY");
        return date;
      },
    },

    {
      field: "storeName",
      headerName: "Store Name",
      flex: 1,
    },
    {
      field: "managerName",
      headerName: "Store Manager",
      flex: 1,
    },
    {
      field: "storeTotalSales.totalSalesLiters",
      headerName: "Total Sales (Liters)",
      flex: 0.5,
      renderCell: (params) => {
        // Safely access totalSalesLiters
        return params.row.storeTotalSales?.totalSalesLiters || "N/A"; // Handle cases where it's undefined
      },
    },

    {
      field: "storeTotalSales.totalSalesDollars",
      headerName: "Total Sales (Naira)",
      flex: 1,
      renderCell: (params) => {
        const totalSalesNaira =
          params.row.storeTotalSales?.totalSalesDollars || 0;
        return `₦${totalSalesNaira.toLocaleString()}`; // Format the number with commas
      },
    },

    /*  {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    }, */
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="action" style={{ display: "flex", gap: "10px" }}>
            <Link title="View Report" to={`/report-detail/${params.row._id}`}>
              <VisibilityOutlinedIcon
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.info.light
                      : theme.palette.info.main,
                  "&:hover": {
                    color: theme.palette.info.dark,
                  },
                }}
              />
            </Link>
            <Link title="Edit Report" to={`/edit-report/${params.row._id}`}>
              <EditOutlinedIcon
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.warning.light
                      : theme.palette.warning.main,
                  "&:hover": {
                    color: theme.palette.warning.dark,
                  },
                }}
              />
            </Link>
            <span title="Delete Report" style={{ cursor: "pointer" }}>
              <DeleteOutlinedIcon
                onClick={() => handleDeleteClick(params.row._id)}
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.error.light
                      : theme.palette.error.main,
                  "&:hover": { color: theme.palette.error.dark },
                }}
              />
            </span>
          </div>
        );
      },
    },
  ];

  // Fetch reports when component mounts or when page, pageSize, sort, or search changes
  useEffect(() => {
    dispatch(
      getDetailedSalesReports({
        page: paginationModel.page + 1, // For backend 1-based indexing
        pageSize: paginationModel.pageSize,
        sort: sortModel[0] ? JSON.stringify(sortModel[0]) : "{}", // Send as JSON string
        search,
      })
    );
  }, [dispatch, paginationModel, sortModel, search]);

  // Function to delete the report without a code (for admins)
  const delReport = async (id) => {
    try {
      const reportToDelete = reports.find((report) => report._id === id); // Get report details

      await dispatch(deleteReport({ id })); // Pass the id as an object
      await dispatch(
        getDetailedSalesReports({
          page: paginationModel.page + 1, // For backend 1-based indexing
          pageSize: paginationModel.pageSize,
          sort: sortModel[0] ? JSON.stringify(sortModel[0]) : "{}", // Send as JSON string
          search,
        })
      );

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
      dispatch(
        getDetailedSalesReports({
          page: paginationModel.page + 1, // For backend 1-based indexing
          pageSize: paginationModel.pageSize,
          sort: sortModel[0] ? JSON.stringify(sortModel[0]) : "{}", // Send as JSON string
          search,
        })
      );

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

  /*   const handleOnClickEdit = () => {
    toast.info(
      "Edit feature coming soon, please delete and recreate in the meantime"
    );
  };
 */
  // Function to handle the delete action with reactjs-popup
  const handleDeleteClick = (id) => {
    setReportIdToDelete(id);
    if (isAdmin) {
      setOpenDeleteDialog(true); // Admins see confirm-only dialog
    } else {
      setOpenCodeDialog(true); // Managers see code entry dialog
    }
  };

  const handleConfirmDelete = async () => {
    if (reportIdToDelete) await delReport(reportIdToDelete);
    setOpenDeleteDialog(false);
  };

  const handleConfirmDeleteWithCode = async () => {
    if (reportIdToDelete && deleteCodeInput) {
      await delReportWithCode(reportIdToDelete, deleteCodeInput);
      setOpenCodeDialog(false);
      setDeleteCodeInput("");
    } else {
      toast.error("Please enter a valid delete code.");
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  // Function to log and set the sort model
  const handleSortModelChange = (newSortModel) => {
    console.log("Updated Sort Model:", newSortModel);
    setSortModel(newSortModel);
  };

  const handleReportCSVUpload = (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("csvFile", file);

      dispatch(importReports(formData))
        .unwrap()
        .then((response) => {
          const { count, existingReports, invalidRows } = response;

          // Notify user of successful imports
          toast.success(`${count} reports imported successfully.`);

          // Check if any stores were skipped
          if (existingReports && existingReports.length > 0) {
            const skippedStoreNames = existingReports
              .map((store) => `${store.name} (${store.location})`)
              .join(", ");
            toast.info(
              `Skipped ${existingReports.length} existing stores: ${skippedStoreNames}`
            );
          }

          // Check if any invalid rows were found
          if (invalidRows && invalidRows.length > 0) {
            const invalidRowMessages = invalidRows
              .map((row) => `Row ${row.row}: ${row.message}`)
              .join("; ");
            toast.warn(
              `${invalidRows.length} invalid rows skipped: ${invalidRowMessages}`
            );
          }

          // Refresh store data
          dispatch(
            getDetailedSalesReports({
              page: paginationModel.page + 1, // For backend 1-based indexing
              pageSize: paginationModel.pageSize,
              sort: sortModel[0] ? JSON.stringify(sortModel[0]) : "{}", // Send as JSON string
              search,
            })
          );
        })
        .catch((error) => {
          toast.error(`Failed to import reports: ${error.message}`);
        });
    }
  };

  const renderButtonSkeleton = () => (
    <Skeleton variant="rectangular" width={120} height={36} />
  );

  const renderDataGridSkeleton = () =>
    [...Array(10)].map((_, i) => (
      <Skeleton key={i} variant="rectangular" width="100%" height={40} />
    ));

  return (
    <Box m="1.5rem 2.5rem">
      <HeaderNew title="REPORTS" subtitle="Entire list of reports" />
      <Box
        sx={{
          button: {
            alignItems: "center",
            gap: "20px",

            padding: "5px",
            cursor: "pointer",
          },
        }}
      >
        <Box display="flex" gap={2} mb={2}>
          {/* Add Report Button */}
          {/*         {isLoading ? (
            renderButtonSkeleton()
          ) : ( */}
          <Link to="/add-report" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.main
                    : theme.palette.primary.light,
                color: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Add Report
            </Button>
          </Link>
          {/*  )} */}

          {/* Only show these buttons to admin users */}
          {isAdmin && (
            <>
              {/* Import Reports Button */}
              {/*  {isLoading ? (
                <>
                  {renderButtonSkeleton()}
                  {renderButtonSkeleton(180)}
                </>
              ) : (
                <> */}
              <Button
                variant="contained"
                onClick={() =>
                  document.getElementById("import-reports-input").click()
                }
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.secondary.main
                      : theme.palette.secondary.light,
                  color: theme.palette.getContrastText(
                    theme.palette.secondary.main
                  ),
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                Import Reports
              </Button>
              <input
                id="import-reports-input"
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={(e) => handleReportCSVUpload(e.target.files[0])} // Ensure to add this function if necessary
              />

              {/* Download Sample File Button */}
              <Button
                variant="contained"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = `${process.env.REACT_APP_BACKEND_URL}/sample_data_files/Sample_Import_Reports_File.csv`;
                  link.download = "Sample_Import_Reports_File.csv";
                  link.click();
                }}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.info.main
                      : theme.palette.info.light,
                  color: theme.palette.getContrastText(theme.palette.info.main),
                  "&:hover": {
                    backgroundColor: theme.palette.info.dark,
                  },
                }}
              >
                Download Sample File
              </Button>
            </>
          )}
          {/*   </>
          )} */}
        </Box>

        <input
          id="import-reports-input"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => handleReportCSVUpload(e.target.files[0])}
        />
      </Box>

      {/* Delete confirmation Dialog for admins */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this report? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete authorization code Dialog for non-admins (i.e. store managers)*/}
      <Dialog
        open={openCodeDialog}
        onClose={() => setOpenCodeDialog(false)}
        aria-labelledby="code-dialog-title"
      >
        <DialogTitle id="code-dialog-title">Enter Delete Code</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the delete code to confirm report deletion.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Delete Code"
            fullWidth
            variant="outlined"
            value={deleteCodeInput}
            onChange={(e) => setDeleteCodeInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCodeDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteWithCode} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        {/*   {isLoading ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {renderDataGridSkeleton()}
          </Box>
        ) : ( */}
        <DataGrid
          loading={isLoading || !reports}
          getRowId={(row) => row._id}
          rows={reports || []}
          columns={columns}
          rowCount={total}
          paginationMode="server"
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          paginationModel={paginationModel}
          pageSizeOptions={[20, 50, 100]}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{ toolbar: DataGridCustomToolbar }}
          slotProps={{
            toolbar: {
              searchInput,
              setSearchInput,
              setSearch,
            },
          }}
        />
        {/*     )} */}
      </Box>
    </Box>
  );
};

export default ReportListNew;
