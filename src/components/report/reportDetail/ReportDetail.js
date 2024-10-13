import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { id } = useParams();

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
              <div className="modal">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <img
                  className="modal-content"
                  src={selectedImage}
                  alt="Large"
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
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReportDetail;
