import React, { useEffect } from "react";
import { Box, Button, useTheme } from "@mui/material";
import "./UserListNew.scss";
import HeaderNew from "../../components/HeaderNew";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  adminImportUsers,
  fetchUsers,
  removeUser,
  resendUerActivationEmailByAdmin,
  sendUserReportDeleteCode,
} from "../../redux/features/auth/authSlice";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { Link } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { selectStores } from "../../redux/features/storeLocation/storeLocationSlice";

const UserListNew = () => {
  const theme = useTheme();

  useRedirectLoggedOutUser("/login"); //use this at the very top of all pages that require a user to be logged so it doesnt try to fetch data on a loggedOut state
  const dispatch = useDispatch();
  const { user, users } = useSelector((state) => state.auth);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  const isAdmin = user?.role === "admin"; // Check if the user is an admin

  useEffect(() => {
    // Fetch users when the component mounts
    dispatch(fetchUsers());
  }, [dispatch]);

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.5,
    },
    {
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
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 0.5,
      editable: true,
      renderCell: (params) => {
        return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
      field: "Store Name",
      headerName: "Store Name",
      width: 200,
      renderCell: (params) => {
        return <div>{getStoreName(params.row.storeId)}</div>;
      },
    },
    {
      field: "role",
      headerName: "Role",
      type: "singleSelect",
      valueOptions: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "user", label: "User" },
      ],
      width: 100,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      valueOptions: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "suspended", label: "Suspended" },
      ],
      width: 80,
      editable: true,
    },

    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="action" style={{ display: "flex", gap: "10px" }}>
            {/* View User */}
            <Link title="View User" to={`/users/view-user/${params.row._id}`}>
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

            {/* Edit User */}
            <Link title="Edit User" to={`/users/edit-user/${params.row._id}`}>
              <CreateOutlinedIcon
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

            {/* Resend Activation Email for Inactive Users */}
            {params.row.status === "inactive" && (
              <span
                title="Resend Activation Email"
                onClick={() => handleResendActivationEmail(params.row.email)}
                style={{ cursor: "pointer" }}
              >
                <EmailOutlinedIcon
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                    "&:hover": {
                      color: theme.palette.primary.dark,
                    },
                  }}
                />
              </span>
            )}

            {/* Send Delete Code for Active Users */}
            {params.row.status === "active" && (
              <span
                title="Send Report Delete Code"
                onClick={() => handleSendReportDeleteCode(params.row.email)}
                style={{ cursor: "pointer" }}
              >
                <VpnKeyOutlinedIcon
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
              </span>
            )}

            {/* Delete User */}
            <span title="Delete User" style={{ cursor: "pointer" }}>
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

  // the actual function to delete the user
  const delUser = async (id) => {
    await dispatch(removeUser(id));
    dispatch(fetchUsers());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete This User",
      message:
        "Deleting a user account cannot be undone. Are you sure to delete this user?",
      buttons: [
        {
          label: "Delete",
          onClick: () => delUser(id),
        },
        {
          label: "Cancel",
          //onClick: () => alert('Click No')
        },
      ],
    });
  };

  const handleResendActivationEmail = async (email) => {
    try {
      //console.log(email);

      await dispatch(resendUerActivationEmailByAdmin({ email }));
      //alert("Activation link sent!");
    } catch (error) {
      alert("Failed to resend activation email");
    }
  };

  const handleSendReportDeleteCode = async (email) => {
    try {
      //console.log(email);

      await dispatch(sendUserReportDeleteCode({ email }));
      //alert("Activation link sent!");
    } catch (error) {
      alert("Failed to resend activation email");
    }
  };

  const getStoreName = (storeId) => {
    if (!storeId) {
      return "Not Assigned";
    }
    const store = stores.find((store) => String(store._id) === String(storeId));
    return store ? store.name : "Not Assigned";
  };

  const handleUserCSVUpload = (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("csvFile", file);

      dispatch(adminImportUsers(formData))
        .unwrap()
        .then((response) => {
          // Ensure the response structure is as expected
          if (!response) {
            toast.error(
              "Unexpected response from the server. Please try again."
            );
            return;
          }

          const { count, existingUsers, invalidRows } = response;

          // Notify user of successful imports
          if (count > 0) {
            toast.success(`${count} users imported successfully.`);
          } else {
            toast.warn("No new users were imported.");
          }

          // Show skipped existing users
          if (existingUsers && existingUsers.length > 0) {
            const skippedUsers = existingUsers
              .map((user) => user.email)
              .join(", ");
            toast.info(
              `Skipped ${existingUsers.length} existing users: ${skippedUsers}`
            );
          }

          // Show invalid rows
          if (invalidRows && invalidRows.length > 0) {
            const invalidRowMessages = invalidRows
              .map((row) => `Row ${row.row}: ${row.message}`)
              .join("; ");
            toast.warn(
              `${invalidRows.length} invalid rows skipped: ${invalidRowMessages}`
            );
          }

          // Optionally reload user data
          dispatch(fetchUsers()); // This re-fetches users from the backend
        })
        .catch((error) => {
          // Check if error message exists in the response, otherwise provide a default error message
          const errorMessage =
            error?.message || "An error occurred while importing users.";
          toast.error(`Failed to import users: ${errorMessage}`);
        });
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <HeaderNew title="USERS" subtitle="List of Users" />
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
          {/* Add User Button */}
          <Link to="/add-user" style={{ textDecoration: "none" }}>
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
              Add User
            </Button>
          </Link>

          {/* Only show these buttons to admin users */}
          {isAdmin && (
            <>
              {/* Import Users Button */}
              <Button
                variant="contained"
                onClick={() =>
                  document.getElementById("import-users-input").click()
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
                Import Users
              </Button>
              <input
                id="import-users-input"
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={(e) => handleUserCSVUpload(e.target.files[0])}
              />

              {/* Download Sample File Button */}
              <Button
                variant="contained"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = `${process.env.REACT_APP_BACKEND_URL}/sample_data_files/Sample_Import_Users_File.csv`;
                  link.download = "Sample_Import_Users_File.csv";
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
      </Box>

      <Box>
        <input
          id="import-users-input"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => handleUserCSVUpload(e.target.files[0])}
        />
      </Box>
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
          loading={isLoading || !users}
          getRowId={(row) => row._id}
          rows={users || []}
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

export default UserListNew;
