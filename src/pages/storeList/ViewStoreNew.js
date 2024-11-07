import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { getStoreLocation } from "../../redux/features/storeLocation/storeLocationSlice";
import StatBox from "../../components/StatBox";
import {
  LocalGasStationOutlined,
  PointOfSale,
  GroupOutlined,
} from "@mui/icons-material";
import HeaderNew from "../../components/HeaderNew";
import { getReportsByStoreId } from "../../redux/features/report/reportSlice";
import SalesOverviewChart from "../../components/Charts/SalesOverviewChart";
import ProductSalesBarChart from "../../components/Charts/ProductSalesBarChart";

// Importing utility functions
import {
  calculateStoreSales,
  calculateMonthlySalesForStore,
  calculateProductSalesForCurrentMonthForStore,
  calculateProductSalesForCurrentYearForStore,
  filterReportsForCurrentMonth,
  filterReportsForCurrentYear,
} from "../../utils/salesCalculations";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const ViewStoreNew = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { id } = useParams(); // Get store ID from URL params

  const dispatch = useDispatch();

  const [store, setStore] = useState(null);
  const [managerName, setManagerName] = useState(""); // State to hold the manager's name

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogData, setDialogData] = useState([]);
  const [dialogColumns, setDialogColumns] = useState([]);

  const { reports } = useSelector((state) => {
    const reportsData = state.report.reports || {}; // Default to an empty object
    return reportsData.reports ? reportsData : { reports: reportsData }; // Return an object with reports key
  });

  const { isLoading } = useSelector((state) => state.report);

  const { users } = useSelector((state) => state.auth); // Assuming users are in your auth slice

  useEffect(() => {
    if (id) {
      dispatch(getReportsByStoreId(id)); // Fetch reports by store ID
      dispatch(getStoreLocation(id)).then((response) => {
        const storeData = response.payload; // Assuming store data comes from response.payload
        setStore(storeData);
      });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (store && users.length > 0) {
      const manager = users.find(
        (user) => String(user._id) === String(store.managerId?._id)
      );
      if (manager) {
        setManagerName(manager?.name); // Set the manager's name if found
      } else {
        console.log(`Manager with ID ${store.managerId} not found`); // Log if no manager found
      }
    }
  }, [store, users]); // Runs when either `store` or `users` are updated

  const handleDrillDown = (title, data, columns) => {
    /*     console.log("Original Data:", data); // Log raw data before filtering
    const filteredData = title.includes("Month")
      ? filterReportsForCurrentMonth(data)
      : filterReportsForCurrentYear(data);
    console.log("Filtered Data for Dialog:", filteredData); // Log filtered data to see what is being passed */
    setDialogTitle(title);
    setDialogData(data);
    setDialogColumns(columns);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData([]);
  };

  // Check if there are reports data
  const hasReportsData = reports && reports.length > 0;

  // Using utility functions to calculate necessary values
  /*   const storeSales = calculateStoreSales(reports);
  const monthlySalesData = calculateMonthlySalesForStore(reports);
  const productSalesForMonth =
    calculateProductSalesForCurrentMonthForStore(reports);
  const productSalesForYear =
    calculateProductSalesForCurrentYearForStore(reports); */

  // Using useMemo to optimize calculations by memoizing results
  const storeSales = useMemo(() => calculateStoreSales(reports), [reports]);
  const monthlySalesData = useMemo(
    () => calculateMonthlySalesForStore(reports),
    [reports]
  );
  const productSalesForMonth = useMemo(
    () => calculateProductSalesForCurrentMonthForStore(reports),
    [reports]
  );
  const productSalesForYear = useMemo(
    () => calculateProductSalesForCurrentYearForStore(reports),
    [reports]
  );

  // if !store check should always be below usememo usage for calculations
  if (!store) return <Typography>Loading store details...</Typography>;

  const usersColumns = [
    { field: "_id", headerName: "ID", width: 90 },
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
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
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
    { field: "_id", headerName: "ID", width: 90 },
    { field: "storeName", headerName: "Store Name", flex: 1 },
    {
      field: "date",
      headerName: "Date Created",
      flex: 1,
      renderCell: (params) => {
        const date = params?.row?.date ? new Date(params.row.date) : null;
        return date
          ? date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A";
      },
    },
    {
      field: "totalSalesLiters",
      headerName: "Total Sales (Liters)",
      flex: 1,
      renderCell: (params) => {
        const totalSalesLiters =
          params?.row?.storeTotalSales?.totalSalesLiters ?? "N/A";
        return totalSalesLiters;
      },
      valueGetter: (params) => {
        const totalSalesLiters = params?.row?.storeTotalSales?.totalSalesLiters;
        return totalSalesLiters !== undefined ? totalSalesLiters : "N/A";
      },
    },
    {
      field: "totalSalesDollars",
      headerName: "Total Sales (Naira)",
      flex: 1,
      renderCell: (params) => {
        const totalSalesNaira = params?.row?.storeTotalSales?.totalSalesDollars;
        return totalSalesNaira !== undefined
          ? `₦${totalSalesNaira.toLocaleString()}`
          : "N/A";
      },
      valueGetter: (params) => {
        const totalSalesNaira = params?.row?.storeTotalSales?.totalSalesDollars;
        return totalSalesNaira !== undefined ? totalSalesNaira : "N/A";
      },
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
      <HeaderNew
        title="STORE DETAILS"
        subtitle={`Viewing details for ${store.name}`}
      />
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
          "Users",
          users?.length ?? 0,
          "+14%",
          "Since last month",
          <GroupOutlined
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />,
          () => handleDrillDown("Users", users, usersColumns)
        )}

        {renderStatBox(
          "Sales This Month (Lts)",
          storeSales.totalSalesForMonth.totalSalesLiters.toLocaleString(),
          `${storeSales.totalSalesForMonth.percentageDiffLiters.toFixed(2)}%`,
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
          `₦${storeSales.totalSalesForMonth.totalSalesDollars.toLocaleString()}`,
          `${storeSales.totalSalesForMonth.percentageDiffDollars.toFixed(2)}%`,
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
          storeSales.totalSalesForYear.totalSalesLiters.toLocaleString(),
          `${storeSales.totalSalesForYear.percentageDiffLiters.toFixed(2)}%`,
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
          `₦${storeSales.totalSalesForYear.totalSalesDollars.toLocaleString()}`,
          `${storeSales.totalSalesForYear.percentageDiffDollars.toFixed(2)}%`,
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

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {isLoading ? ( // If data is still loading, show the skeleton
            <Skeleton
              variant="rectangular"
              width="100%"
              height="300px"
              sx={{ borderRadius: "0.55rem" }}
            />
          ) : hasReportsData ? ( // If loading is complete and there is data, show the chart
            <SalesOverviewChart salesData={monthlySalesData} />
          ) : (
            // If loading is complete but there's no data, show a message
            <Typography>No reports data available</Typography>
          )}
        </Box>

        {/* ROW 3 */}
        {/*  <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="20px"> */}

        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {isLoading ? ( // Show skeleton if data is loading
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: "0.55rem" }}
            />
          ) : hasReportsData ? ( // Show chart if data is loaded and available
            <ProductSalesBarChart
              salesData={productSalesForMonth}
              title="Total Sales by Product (₦) - This Month"
            />
          ) : (
            // Show message if data is loaded but unavailable
            <Typography>No reports data available</Typography>
          )}
        </Box>

        <Box
          gridColumn="span 6"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          {isLoading ? ( // Show skeleton if data is loading
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: "0.55rem" }}
            />
          ) : hasReportsData ? ( // Show chart if data is loaded and available
            <ProductSalesBarChart
              salesData={productSalesForYear}
              title="Total Sales by Product (₦) - This Year"
            />
          ) : (
            // Show message if data is loaded but unavailable
            <Typography>No reports data available</Typography>
          )}
        </Box>
      </Box>

      {/* ROW 4 */}
      <Box
        gridColumn="span 12"
        gridRow="span 5"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
        marginTop={"2rem"}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            companyCode: store.companyCode || "",
            name: store.name || "",
            location: store.location || "",
            pumps: store.pumps || 0,
            nozzles: store.nozzles || 0,
            tanks: store.tanks || 0,
            description: store.description || "",
            manager: managerName || "Not assigned",
          }}
        >
          {({ values }) => (
            <form>
              <Box display="flex" flexDirection="column" gap="16px">
                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Company Code"
                    value={values.companyCode}
                    disabled
                  />
                )}

                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Store Name"
                    value={values.name}
                    disabled
                  />
                )}

                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Location"
                    value={values.location}
                    disabled
                  />
                )}

                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Pumps"
                    value={values.pumps}
                    disabled
                  />
                )}

                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Nozzles"
                    value={values.nozzles}
                    disabled
                  />
                )}

                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Tanks"
                    value={values.tanks}
                    disabled
                  />
                )}

                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Manager"
                    value={values.manager}
                    disabled
                  />
                )}

                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Description"
                    value={values.description}
                    disabled
                  />
                )}
              </Box>
            </form>
          )}
        </Formik>
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
              <DataGrid
                rows={dialogData}
                columns={dialogColumns}
                getRowId={(row) => row._id}
                slots={{ toolbar: GridToolbar }}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
              />
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
    </Box>
  );
};

export default ViewStoreNew;
