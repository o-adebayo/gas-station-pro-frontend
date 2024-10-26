import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
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
import Card from "../../card/Card";
import { SpinnerImg } from "../../loader/Loader";
import "./ReportDetail.scss";

import DOMPurify from "dompurify";

const ReportDetail = () => {
  const theme = useTheme();
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const report = useSelector(selectReport);
  const isLoading = useSelector(selectIsLoading);

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedImage, setSelectedImage] = useState(null); // Selected image

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
    navigate(`/edit-report/${id}`); // Navigate to edit report page with the report ID
  };

  useEffect(() => {
    const root = document.documentElement;

    // Set dynamic colors for various elements
    root.style.setProperty("--card-bg-color", theme.palette.background.default);
    root.style.setProperty("--card-shadow-color", theme.palette.background.alt);
    root.style.setProperty("--primary-color", theme.palette.primary.main);
    root.style.setProperty("--text-on-primary", theme.palette.text.primary);
    root.style.setProperty("--highlight-color", theme.palette.secondary.main);

    // Set heading color based on theme (primary for light, or white for dark)
    root.style.setProperty("--heading-color", theme.palette.primary.main); // Modify this to any color you prefer

    // Set other dynamic variables
    root.style.setProperty("--text-color", theme.palette.text.primary);
    root.style.setProperty("--divider-color", theme.palette.divider);
    root.style.setProperty("--code-bg-color", theme.palette.background.paper);
    root.style.setProperty("--code-text-color", theme.palette.text.secondary);
    root.style.setProperty(
      "--notes-bg-color",
      theme.palette.background.default
    );
    root.style.setProperty("--notes-border-color", theme.palette.divider);
    root.style.setProperty("--cancel-btn-bg", theme.palette.error.main);
    root.style.setProperty("--cancel-btn-hover-bg", theme.palette.error.dark);
    root.style.setProperty(
      "--text-on-cancel-btn",
      theme.palette.getContrastText(theme.palette.error.main)
    );
  }, [theme]);

  return (
    <div className="report-detail">
      <h3 className="--mt">Report Detail</h3>
      <Card cardClass="card">
        {isLoading && <SpinnerImg />}
        {report && (
          <div className="detail">
            {/* Image preview stays at the top */}
            <div className="report-images">
              {report?.images?.length > 0 ? (
                [...new Set(report.images)].map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Report Image ${index + 1}`}
                    className="report-image"
                    onClick={() => openModal(image)} // Open modal on click
                    style={{ cursor: "pointer" }} // Change cursor to indicate clickable
                  />
                ))
              ) : (
                <p>No images available for this report</p>
              )}
            </div>

            {/* Modal for image popup */}
            {isModalOpen && selectedImage && (
              <div className="modal" onClick={closeModal}>
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <img
                  className="modal-content"
                  src={selectedImage}
                  alt="Large"
                  onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking the image
                />
              </div>
            )}

            <hr />
            <h4>
              <span className="badge">Store Name: </span> &nbsp;{" "}
              {report.storeName}
            </h4>
            <p>
              <b>&rarr; Manager Name : </b> {report.managerName}
            </p>
            <p>
              <b>&rarr; Date : </b> {new Date(report.date).toLocaleDateString()}
            </p>
            <p>
              <b>&rarr; Total Sales (Liters) : </b>{" "}
              {report.storeTotalSales?.totalSalesLiters || 0}
            </p>
            <p>
              <b>&rarr; Total Sales (₦) : </b> ₦
              {report.storeTotalSales?.totalSalesDollars || 0}
            </p>

            <hr />
            <h4>Sales Summary</h4>
            {report.products ? (
              Object.keys(report.products).map((product) => (
                <div key={product} className="product-summary">
                  <h5>{product}</h5>
                  <p>
                    <b>&rarr; Total Sales (Liters): </b>{" "}
                    {report.products[product]?.totalSalesLiters || 0}
                  </p>
                  <p>
                    <b>&rarr; Rate: </b> ₦{report.products[product]?.rate || 0}
                  </p>
                  <p>
                    <b>&rarr; Total Sales (₦): </b> ₦
                    {report.products[product]?.totalSalesDollars || 0}
                  </p>
                  <div className="product-details">
                    <div className="detail-item">
                      <h6>Dipping Tanks:</h6>
                      {report.products[product]?.dippingTanks?.length > 0 ? (
                        report.products[product].dippingTanks.map(
                          (tank, index) => (
                            <p key={index}>
                              <b>Tank {index + 1}:</b> Opening - {tank.opening},
                              Closing - {tank.closing}, Sales - {tank.sales}
                            </p>
                          )
                        )
                      ) : (
                        <p>No dipping tank details available.</p>
                      )}
                    </div>

                    <div className="detail-item">
                      <h6>Pumps:</h6>
                      {report.products[product]?.pumps?.length > 0 ? (
                        report.products[product].pumps.map(
                          (pump, pumpIndex) => (
                            <div key={pumpIndex}>
                              <h6>Pump {pumpIndex + 1}</h6>
                              {pump.nozzles.map((nozzle, nozzleIndex) => (
                                <p key={nozzleIndex}>
                                  <b>Nozzle {nozzleIndex + 1}:</b> Opening -{" "}
                                  {nozzle.opening}, Closing - {nozzle.closing},
                                  Sales - {nozzle.sales}
                                </p>
                              ))}
                            </div>
                          )
                        )
                      ) : (
                        <p>No pump details available.</p>
                      )}
                    </div>

                    <div className="detail-item">
                      <h6>Total Sales Breakdown:</h6>
                      <p>
                        <b>POS: </b> ₦
                        {report.products[product]?.totalSalesBreakdown?.pos ||
                          0}
                      </p>
                      <p>
                        <b>Cash: </b> ₦
                        {report.products[product]?.totalSalesBreakdown?.cash ||
                          0}
                      </p>
                      <p>
                        <b>Expenses: </b> ₦
                        {report.products[product]?.totalSalesBreakdown
                          ?.expenses || 0}
                      </p>
                      <p>
                        <b>Actual Total: </b> ₦
                        {report.products[product]?.actualTotal || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No product details available</p>
            )}

            <hr />

            <div className="notes-box">
              <h4>Note</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(report.notes),
                }}
              ></div>
            </div>

            <hr />

            <code className="--color-dark --fs-larger">
              Created on: {new Date(report.createdAt).toLocaleString("en-US")}
            </code>
            <br />
            <code className="--color-dark --fs-larger">
              Last Updated: {new Date(report.updatedAt).toLocaleString("en-US")}
            </code>
            {/* Back and Edit buttons */}
            <div className="button-group">
              <button
                type="button"
                className="text-reg cancel-btn"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="button"
                className="text-reg navigation__cta"
                onClick={handleEdit}
              >
                Edit Report
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReportDetail;
