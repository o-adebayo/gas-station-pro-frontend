import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from "@mui/material";
import "./StoreListNew.scss";
import HeaderNew from "../../components/HeaderNew";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStoreLocations,
  selectStores,
  //selectIsLoading,
  deleteStoreLocation,
  importStores,
} from "../../redux/features/storeLocation/storeLocationSlice";
import {
  fetchUsers,
  selectUser,
  selectUsers,
} from "../../redux/features/auth/authSlice";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { Link } from "react-router-dom";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

const StoreListNew = () => {
  const theme = useTheme();
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  // Fetch user and store data from Redux
  const user = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.storeLocation);
  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [storeIdToDelete, setStoreIdToDelete] = useState(null);

  const isAdmin = user?.role === "admin"; // Check if the user is an admin

  // Fetch users and stores data
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user && user.companyCode) {
      dispatch(fetchStoreLocations());
    }
  }, [dispatch, user]);

  const delStore = async (id) => {
    await dispatch(deleteStoreLocation(id));
    dispatch(fetchStoreLocations());
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      //width: 200,
      flex: 1,
    },
    /*  {
      field: "photo",
      headerName: "Avatar",
      width: 70,
      renderCell: (params) => {
        return (
          <img
            src={
              params.row.photo?.filePath ||
              "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt=""
          />
        );
      },
    }, */
    {
      field: "name",
      headerName: "Name",
      //width: 150,
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      //width: 250,
      flex: 0.5,
    },
    {
      field: "pumps",
      headerName: "Pumps",
      //width: 80,
      flex: 0.5,
    },
    {
      field: "nozzles",
      headerName: "Nozzles",
      //width: 80,
      flex: 0.5,
    },
    {
      field: "tanks",
      headerName: "Tanks",
      //width: 80,
      flex: 0.5,
    },
    {
      field: "ManagerName",
      headerName: "Manager Name",
      //width: 200,
      flex: 1,
      renderCell: (params) => {
        return <div>{getManagerName(params.row.managerId)}</div>;
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="action" style={{ display: "flex", gap: "10px" }}>
            <Link title="View Store" to={`view-store/${params.row._id}`}>
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
            <Link title="Edit Store" to={`edit-store/${params.row._id}`}>
              <CreateOutlinedIcon
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.success.light
                      : theme.palette.success.main,
                  "&:hover": {
                    color: theme.palette.success.dark,
                  },
                }}
              />
            </Link>
            <span title="Delete Store" style={{ cursor: "pointer" }}>
              <DeleteOutlinedIcon
                onClick={() => confirmDelete(params.row._id)}
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.error.light
                      : theme.palette.error.main,
                  "&:hover": {
                    color: theme.palette.error.dark,
                  },
                }}
              />
            </span>
          </div>
        );
      },
    },
  ];
  /* 
  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete This Store",
      message:
        "Deleting a store cannot be undone. Are you sure you want to delete this store?",
      buttons: [
        {
          label: "Delete",
          onClick: () => delStore(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };
 */
  const getManagerName = (managerId) => {
    if (!managerId) {
      return "Not Assigned";
    }
    const manager = users.find(
      (user) => String(user._id) === String(managerId)
    );
    return manager ? manager.name : "Not Assigned";
  };

  const confirmDelete = (id) => {
    setStoreIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    delStore(storeIdToDelete);
    setOpenDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleStoreCSVUpload = (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("csvFile", file);

      dispatch(importStores(formData))
        .unwrap()
        .then((response) => {
          const { count, existingStores, invalidRows } = response;

          // Notify user of successful imports
          toast.success(`${count} stores imported successfully.`);

          // Check if any stores were skipped
          if (existingStores && existingStores.length > 0) {
            const skippedStoreNames = existingStores
              .map((store) => `${store.name} (${store.location})`)
              .join(", ");
            toast.info(
              `Skipped ${existingStores.length} existing stores: ${skippedStoreNames}`
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
          dispatch(fetchStoreLocations()); // Re-fetch stores
        })
        .catch((error) => {
          toast.error(`Failed to import stores: ${error.message}`);
        });
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <HeaderNew title="STORES" subtitle="List of Stores" />
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
        <Box display="flex" gap={2}>
          {/* Add Store Button */}
          <Link to="/add-store" style={{ textDecoration: "none" }}>
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
              Add Store
            </Button>
          </Link>

          {/* Only show these buttons to admin users */}
          {isAdmin && (
            <>
              {/* Import Stores Button */}
              <Button
                variant="contained"
                onClick={() =>
                  document.getElementById("import-stores-input").click()
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
                Import Stores
              </Button>
              <input
                id="import-stores-input"
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={(e) => handleStoreCSVUpload(e.target.files[0])}
              />

              {/* Download Sample File Button */}
              <Button
                variant="contained"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = `${process.env.REACT_APP_BACKEND_URL}/sample_data_files/Sample_Import_Stores_File.csv`;
                  link.download = "Sample_Import_Stores_File.csv";
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
        </Box>

        <input
          id="import-stores-input"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => handleStoreCSVUpload(e.target.files[0])}
        />
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Store</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Deleting a store cannot be undone. Are you sure you want to delete
            this store?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        mt="40px"
        height="75vh"
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
          loading={isLoading || !stores}
          getRowId={(row) => row._id}
          rows={stores || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default StoreListNew;
