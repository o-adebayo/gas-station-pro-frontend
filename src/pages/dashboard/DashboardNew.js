import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import HeaderNew from "../../components/HeaderNew";
//import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import FlexBetween from "../../components/FlexBetween";
import {
  //DownloadOutlined,
  GroupOutlined,
  LocalGasStationOutlined,
  StoreOutlined,
  PointOfSale,
} from "@mui/icons-material";

import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchUsers } from "../../redux/features/auth/authSlice";
import { selectStores } from "../../redux/features/storeLocation/storeLocationSlice";
import { getReports } from "../../redux/features/report/reportSlice";
import { selectCompany } from "../../redux/features/company/companySlice";
import StatBox from "../../components/StatBox";
import SalesOverviewChart from "../../components/Charts/SalesOverviewChart";
import StoreComparisonChart from "../../components/Charts/StoreComparisonChart";
import SalesPieChart from "../../components/Charts/SalesPieChart";
import ProductSalesBarChart from "../../components/Charts/ProductSalesBarChart";

// Importing utility functions
import {
  filterReportsForCurrentMonth,
  filterReportsForCurrentYear,
  calculateTotalSales,
  calculateMonthlySales,
  calculateStoreMonthlySales,
  calculateCurrentMonthSales,
  calculateStoreSalesForCurrentYear,
  calculateProductSalesForCurrentMonth,
  calculateProductSalesForCurrentYear,
} from "../../utils/salesCalculations";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import dayjs from "dayjs";

const DashboardNew = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { user, users, isLoggedIn } = useSelector((state) => state.auth);

  //const isLoading = useSelector((state) => state.auth.isLoading);
  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  const { reports } = useSelector((state) => {
    const reportsData = state.report.reports || {}; // Default to an empty object
    return reportsData.reports ? reportsData : { reports: reportsData }; // Return an object with reports key
  });

  //const reports = useSelector((state) => state.report.reports);
  //const reports = useMemo(() => reportsData?.reports || [], [reportsData]); // Memoize reports

  const { isError, message, isLoading } = useSelector((state) => state.report);

  const companyResponse = useSelector(selectCompany); // Fetch company details
  const company = companyResponse?.company || {}; // Destructure company details

  //console.log("logged in", isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUser()); // Fetch user data when logged in
      dispatch(fetchUsers()); // Fetch users
      dispatch(getReports()); // fecth reports
    }
  }, [isLoggedIn, dispatch]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogData, setDialogData] = useState([]);
  const [dialogColumns, setDialogColumns] = useState([]);

  // Use useMemo to memoize calculations unconditionally
  const totalSales = useMemo(() => calculateTotalSales(reports), [reports]);
  const monthlySalesData = useMemo(
    () => calculateMonthlySales(reports),
    [reports]
  );
  const storeMonthlySalesData = useMemo(
    () => calculateStoreMonthlySales(reports),
    [reports]
  );
  const currentMonthSalesData = useMemo(
    () => calculateCurrentMonthSales(reports),
    [reports]
  );
  const storeSalesData = useMemo(
    () => calculateStoreSalesForCurrentYear(reports),
    [reports]
  );
  const productSalesForMonth = useMemo(
    () => calculateProductSalesForCurrentMonth(reports),
    [reports]
  );
  const productSalesForYear = useMemo(
    () => calculateProductSalesForCurrentYear(reports),
    [reports]
  );

  // Move the conditional rendering below the useMemo hooks
  if (!user) {
    // Optionally, add a fallback or return null if user is missing
    return null;
  }

  // Only render the StoreComparisonChart if the user is an admin
  const isAdmin = user.role === "admin";

  const handleDrillDown = (title, data, columns) => {
    setDialogTitle(title);
    setDialogData(data);
    setDialogColumns(columns); // Set the columns based on the selected StatBox
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData([]);
  };

  const getManagerName = (managerId) => {
    if (!managerId) {
      return "Not Assigned";
    }
    const manager = users.find(
      (user) => String(user._id) === String(managerId)
    );
    return manager ? manager.name : "Not Assigned";
  };

  // Define different column sets
  const storeColumns = [
    { field: "_id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Store Name", width: 150 },
    {
      field: "ManagerName",
      headerName: "Manager Name",
      //width: 200,
      flex: 1,
      renderCell: (params) => {
        return <div>{getManagerName(params.row.managerId)}</div>;
      },
    },
    { field: "location", headerName: "Location", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
  ];

  const userColumns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    {
      field: "photo",
      headerName: "Avatar",
      width: 70,
      renderCell: (params) => (
        <img
          src={
            params.row.photo?.filePath || "https://i.ibb.co/4pDNDk1/avatar.png"
          }
          alt=""
          style={{ width: "32px", height: "32px", borderRadius: "50%" }}
        />
      ),
    },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) =>
        params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3"),
    },
    { field: "role", headerName: "Role", width: 100 },
    { field: "status", headerName: "Status", width: 80 },
  ];

  const salesColumns = [
    { field: "_id", headerName: "ID", flex: 1 },
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
    { field: "storeName", headerName: "Store Name", flex: 1 },
    { field: "managerName", headerName: "Store Manager", flex: 1 },
    {
      field: "storeTotalSales.totalSalesLiters",
      headerName: "Total Sales (Liters)",
      flex: 0.5,
      renderCell: (params) =>
        params.row.storeTotalSales?.totalSalesLiters || "N/A",
    },
    {
      field: "storeTotalSales.totalSalesDollars",
      headerName: "Total Sales (Naira)",
      flex: 1,
      renderCell: (params) =>
        `₦${(
          params.row.storeTotalSales?.totalSalesDollars || 0
        ).toLocaleString()}`,
    },
  ];

  const renderStatBox = (
    title,
    value,
    increase,
    description,
    icon,
    onDrillDown
  ) => {
    return isLoading ? (
      <Box
        gridColumn="span 2"
        gridRow="span 1"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        p="1.25rem 1rem"
        flex="1 1 100%"
        backgroundColor={theme.palette.background.alt}
        borderRadius="0.55rem"
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            borderRadius: "0.55rem",
            transform: "scale(1)", // Ensures the skeleton occupies full space without shrinking
            animation: "wave", // Adds the wave animation
          }}
        />
      </Box>
    ) : (
      <StatBox
        title={title}
        value={value}
        increase={increase}
        description={description}
        icon={icon}
        onDrillDown={onDrillDown}
      />
    );
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <HeaderNew
          title="DASHBOARD"
          subtitle={`Welcome to your ${
            user.role === "admin" ? "company" : "store"
          } dashboard`}
        />

        {/*  <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </FlexBetween>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        {renderStatBox(
          "Stores",
          stores?.length ?? 0,
          "+14%",
          "Since last month",
          <StoreOutlined
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />,
          () => handleDrillDown("Stores", stores, storeColumns)
        )}

        {renderStatBox(
          "Users",
          users?.length ?? 0,
          "+14%",
          "Since last month",
          <GroupOutlined
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />,
          () => handleDrillDown("Users", users, userColumns)
        )}

        {/* Monthly Sales*/}

        {renderStatBox(
          "Sales This Month (Lts)",
          totalSales.totalSalesForMonth.totalSalesLiters.toLocaleString(),
          `${totalSales.totalSalesForMonth.percentageDiffLiters.toFixed(2)}%`,
          "Since last month",
          <LocalGasStationOutlined
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />,
          () =>
            handleDrillDown(
              "Sales This Month (Lts)",
              filterReportsForCurrentMonth(reports),
              salesColumns
            )
        )}

        {renderStatBox(
          "Sales This Month (₦)",
          `₦${totalSales.totalSalesForMonth.totalSalesDollars.toLocaleString()}`,
          `${totalSales.totalSalesForMonth.percentageDiffDollars.toFixed(2)}%`,
          "Since last month",
          <PointOfSale
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />,
          () =>
            handleDrillDown(
              "Sales This Month (₦)",
              filterReportsForCurrentMonth(reports),
              salesColumns
            )
        )}

        {/* Yearly Sales*/}

        {renderStatBox(
          "Sales This Year (Lts)",
          totalSales.totalSalesForYear.totalSalesLiters.toLocaleString(),
          `${totalSales.totalSalesForYear.percentageDiffLiters.toFixed(2)}%`,
          "Since last year",
          <LocalGasStationOutlined
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />,
          () =>
            handleDrillDown(
              "Sales This Year (Lts)",
              filterReportsForCurrentYear(reports),
              salesColumns
            )
        )}

        {renderStatBox(
          "Sales This Year (₦)",
          `₦${totalSales.totalSalesForYear.totalSalesDollars.toLocaleString()}`,
          `${totalSales.totalSalesForYear.percentageDiffDollars.toFixed(2)}%`,
          "Since last ytear",
          <PointOfSale
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />,
          () =>
            handleDrillDown(
              "Sales This Year (₦)",
              filterReportsForCurrentYear(reports),
              salesColumns
            )
        )}

        {/* Sales Overview Chart */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              height={300}
              animation="wave"
              sx={{ borderRadius: "0.55rem" }}
            />
          ) : (
            <SalesOverviewChart salesData={monthlySalesData} />
          )}
        </Box>

        {/* Conditional Admin charts */}
        {isAdmin && (
          <>
            <Box
              gridColumn="span 6"
              gridRow="span 2"
              backgroundColor={theme.palette.background.alt}
              p="1rem"
              borderRadius="0.55rem"
            >
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  height={300}
                  animation="wave"
                  sx={{ borderRadius: "0.55rem" }}
                />
              ) : (
                <SalesPieChart
                  salesData={currentMonthSalesData}
                  title="Total Sales by Store (₦) - This Month"
                />
              )}
            </Box>

            <Box
              gridColumn="span 6"
              gridRow="span 2"
              backgroundColor={theme.palette.background.alt}
              p="1rem"
              borderRadius="0.55rem"
            >
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  height={300}
                  animation="wave"
                  sx={{ borderRadius: "0.55rem" }}
                />
              ) : (
                <SalesPieChart
                  salesData={storeSalesData}
                  title="Total Sales by Store (₦) - This Year"
                />
              )}
            </Box>

            <Box
              gridColumn="span 12"
              gridRow="span 2"
              backgroundColor={theme.palette.background.alt}
              p="1rem"
              borderRadius="0.55rem"
            >
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  height={300}
                  animation="wave"
                  sx={{ borderRadius: "0.55rem" }}
                />
              ) : (
                <StoreComparisonChart storeSalesData={storeMonthlySalesData} />
              )}
            </Box>
          </>
        )}

        {/* Bar chart for product sales in the current month */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              height={300}
              animation="wave"
              sx={{ borderRadius: "0.55rem" }}
            />
          ) : (
            <ProductSalesBarChart
              salesData={productSalesForMonth}
              title="Total Sales by Product (₦) - This Month"
            />
          )}
        </Box>

        {/* Bar chart for product sales in the current year */}
        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              height={300}
              animation="wave"
              sx={{ borderRadius: "0.55rem" }}
            />
          ) : (
            <ProductSalesBarChart
              salesData={productSalesForYear}
              title="Total Sales by Product (₦) - This Year"
            />
          )}
        </Box>
      </Box>

      {/* Dialog with DataGrid for drill-down data */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Box
            height={400}
            mt={2}
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
              img: {
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
              },
              ".actions": {
                display: "flex",
                gap: "15px",
              },
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                animation="wave"
              />
            ) : (
              <DataGrid
                rows={dialogData}
                columns={dialogColumns}
                //pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                getRowId={(row) => row._id} // Specify _id as the unique identifier
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                slots={{ toolbar: GridToolbar }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color={theme.palette.success.main}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardNew;
