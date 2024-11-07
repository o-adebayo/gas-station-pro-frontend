import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Divider,
  IconButton,
  Modal,
  Skeleton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import {
  selectIsLoggedIn,
  fetchUser,
  selectUser,
} from "../../../redux/features/auth/authSlice";
import {
  getReport,
  selectReport,
  selectIsLoading,
} from "../../../redux/features/report/reportSlice";
import { SpinnerImg } from "../../loader/Loader";

import DOMPurify from "dompurify";
import HeaderNew from "../../HeaderNew";
import dayjs from "dayjs";

const ReportDetailNew = () => {
  const theme = useTheme();
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const report = useSelector(selectReport);
  const isLoading = useSelector(selectIsLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchUser());
    }
    if (isLoggedIn) {
      dispatch(getReport(id));
    }
  }, [isLoggedIn, user, dispatch, id]);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleBack = () => {
    navigate("/reports");
  };

  const handleEdit = () => {
    navigate(`/edit-report/${id}`);
  };

  // Define specific colors for each product in an array
  const productColors = [
    "#FF5733", // Red
    "#1E90FF", // Blue
    "#8A2BE2", // Purple
    "#FF1493", // Deep Pink
    "#FFD700", // Gold
  ];

  return (
    <Box sx={{ padding: "1.5rem 2.5rem" }}>
      <HeaderNew
        title="REPORT DETAILS"
        subtitle={`Detailed view of report with ID: ${id}`}
      />

      <Card sx={{ mt: 3, backgroundColor: theme.palette.background.alt }}>
        <CardContent>
          {/* Image Section */}
          {/* Image Section with Skeletons */}
          <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={150}
                  height={150}
                  sx={{ borderRadius: 1 }}
                />
              ))
            ) : report?.images?.length > 0 ? (
              report.images.map((image, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  src={image}
                  alt={`Report Image ${index + 1}`}
                  onClick={() => openModal(image)}
                  sx={{
                    cursor: "pointer",
                    height: 150,
                    width: 150,
                    borderRadius: 1,
                  }}
                />
              ))
            ) : (
              <Typography>No images available for this report</Typography>
            )}
          </Box>

          {/* Centered Image Modal */}
          <Modal
            open={isModalOpen}
            onClose={closeModal}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                maxWidth: "90vw",
                maxHeight: "90vh",
              }}
            >
              <IconButton
                onClick={closeModal}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <CloseIcon />
              </IconButton>
              <CardMedia
                component="img"
                src={selectedImage}
                alt="Large Preview"
              />
            </Box>
          </Modal>

          <Divider sx={{ my: 2 }} />

          {/* Report Details */}
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={200}
                  height={36}
                />
              ))
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{
                    color: theme.palette.background.alt,
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  {/*  Date: {new Date(report.date).toLocaleDateString()} */}
                  Date: {dayjs(report.date).utc().format("YYYY-MM-DD")}
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    color: theme.palette.background.alt,
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  Store Name: {report.storeName}
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    color: theme.palette.background.alt,
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  Manager Name: {report.managerName}
                </Button>

                {/*  <Button
                variant="contained"
                sx={{
                  color: theme.palette.background.alt,
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": { backgroundColor: theme.palette.secondary.dark },
                }}
              >
                Rate: ₦{report.products?.PMS?.rate || 0}
              </Button>
 */}
                <Button
                  variant="contained"
                  sx={{
                    color: theme.palette.background.alt,
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  Total Sales (Liters):{" "}
                  {report.storeTotalSales?.totalSalesLiters.toLocaleString() ||
                    0}
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    color: theme.palette.background.alt,
                    backgroundColor: theme.palette.secondary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  Total Sales (₦): ₦
                  {report.storeTotalSales?.totalSalesDollars.toLocaleString() ||
                    0}
                </Button>
              </>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Sales Summary */}
          <Typography variant="h6" color="text.primary">
            Sales Summary
          </Typography>
          <Grid container spacing={2}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      mb: 2,
                    }}
                  >
                    <CardContent>
                      <Skeleton variant="rectangular" width={100} height={36} />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="50%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : report.products ? (
              Object.keys(report.products).map((product, index) => (
                <Grid item xs={12} key={product}>
                  <Card
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      mb: 2,
                    }}
                  >
                    <CardContent>
                      <Button
                        variant="contained"
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          padding: "8px 16px",
                          color: theme.palette.background.alt,
                          backgroundColor:
                            productColors[index % productColors.length],
                          "&:hover": {
                            backgroundColor: theme.palette.primary.light,
                          },
                        }}
                      >
                        {product}
                      </Button>
                      <Typography mt={1}>
                        Total Sales (Liters):{" "}
                        {report.products[
                          product
                        ]?.totalSalesLiters.toLocaleString() || 0}
                      </Typography>
                      <Typography>
                        Rate: ₦{report.products[product]?.rate || 0}
                      </Typography>
                      <Typography>
                        Total Sales (₦): ₦
                        {report.products[
                          product
                        ]?.totalSalesDollars.toLocaleString() || 0}
                      </Typography>

                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1" color="secondary.main">
                        Dipping Tanks:
                      </Typography>
                      {report.products[product]?.dippingTanks?.length > 0 ? (
                        report.products[product].dippingTanks.map(
                          (tank, index) => (
                            <Typography key={index}>
                              Tank {index + 1}: Opening - {tank.opening},
                              Closing - {tank.closing}, Sales - {tank.sales}
                            </Typography>
                          )
                        )
                      ) : (
                        <Typography>
                          No dipping tank details available.
                        </Typography>
                      )}

                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1" color="secondary.main">
                        Pumps:
                      </Typography>
                      {report.products[product]?.pumps?.length > 0 ? (
                        report.products[product].pumps.map(
                          (pump, pumpIndex) => (
                            <Box key={pumpIndex}>
                              <Typography>Pump {pumpIndex + 1}</Typography>
                              {pump.nozzles.map((nozzle, nozzleIndex) => (
                                <Typography key={nozzleIndex}>
                                  Nozzle {nozzleIndex + 1}: Opening -{" "}
                                  {nozzle.opening}, Closing - {nozzle.closing},
                                  Sales - {nozzle.sales}
                                </Typography>
                              ))}
                            </Box>
                          )
                        )
                      ) : (
                        <Typography>No pump details available.</Typography>
                      )}

                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1" color="secondary.main">
                        Total Sales Breakdown:
                      </Typography>
                      <Typography>
                        POS: ₦
                        {report.products[product]?.totalSalesBreakdown?.pos ||
                          0}
                      </Typography>
                      <Typography>
                        Cash: ₦
                        {report.products[product]?.totalSalesBreakdown?.cash ||
                          0}
                      </Typography>
                      <Typography>
                        Expenses: ₦
                        {report.products[product]?.totalSalesBreakdown
                          ?.expenses || 0}
                      </Typography>
                      <Typography>
                        Actual Total: ₦
                        {report.products[product]?.actualTotal || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No product details available</Typography>
            )}
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Notes Section */}
          {isLoading ? (
            <>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="70%" />
            </>
          ) : (
            <>
              <Typography variant="h6">Note</Typography>
              <Typography
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(report.notes),
                }}
              ></Typography>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {isLoading ? (
            <Skeleton variant="text" width="50%" />
          ) : (
            <>
              <Typography>
                Created on: {new Date(report.createdAt).toLocaleString("en-US")}
              </Typography>
              <Typography>
                Last Updated:{" "}
                {new Date(report.updatedAt).toLocaleString("en-US")}
              </Typography>
            </>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            {isLoading ? (
              <>
                <Skeleton variant="rectangular" width={100} height={36} />
                <Skeleton variant="rectangular" width={100} height={36} />
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleBack}
                  sx={{ bgcolor: theme.palette.error.main }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  sx={{ bgcolor: theme.palette.primary.main }}
                >
                  Edit Report
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportDetailNew;
