import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import {
  createReport,
  selectIsLoading,
} from "../../redux/features/report/reportSlice";
import ReportForm from "../../components/report/reportForm/ReportForm";
import { toast } from "react-toastify";
import {
  selectUser,
  fetchUser,
  selectIsLoggedIn,
} from "../../redux/features/auth/authSlice";
import {
  fetchStoreLocations,
  selectStores,
} from "../../redux/features/storeLocation/storeLocationSlice";
import {
  getCompanyByCode,
  selectCompany,
} from "../../redux/features/company/companySlice";
import {
  EMAIL_RESET,
  sendAutomatedEmail,
} from "../../redux/features/email/emailSlice";

const cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const upload_preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const initialState = {
  date: "",
  products: {
    PMS: {
      dippingTanks: [],
      pumps: [],
      rate: 0,
      totalSalesBreakdown: { pos: 0, cash: 0, expenses: 0 },
    },
    DPK: {
      dippingTanks: [],
      pumps: [],
      rate: 0,
      totalSalesBreakdown: { pos: 0, cash: 0, expenses: 0 },
    },
    AGO: {
      dippingTanks: [],
      pumps: [],
      rate: 0,
      totalSalesBreakdown: { pos: 0, cash: 0, expenses: 0 },
    },
  },
  storeTotalSales: { totalSalesLiters: 0, totalSalesDollars: 0 },
  notes: "",
  images: [], // Handle images separately
  storeId: "", // Store ID for associating report with a store
};

const AddReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [report, setReport] = useState(initialState);
  const [notes, setNotes] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]); // For image preview
  const [newImages, setNewImages] = useState([]); // Separate state for new image uploads
  const [isLoading, setIsLoading] = useState(false);

  const loadingState = useSelector(selectIsLoading);
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  //const company = useSelector(selectCompany);
  const companyResponse = useSelector(selectCompany); // Get the company from the state

  // Fetch stores for dropdown selection
  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleInstructions = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Fetch user data when component mounts if user is logged in
  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchUser());
    }
  }, [isLoggedIn, user, dispatch]);

  // Fetch store locations based on company code if logged in
  useEffect(() => {
    if (user?.companyCode) {
      dispatch(fetchStoreLocations(user.companyCode)); // Fetch stores for this company
      dispatch(getCompanyByCode(user.companyCode)); // Fetch company by user's company code
    }
  }, [dispatch, user]);

  // Handle input field changes for date, store, etc.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  // Get the company details from the response
  const company = companyResponse?.company || {};

  // Handle image selection and previews
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]); // Append new images

    // Generate previews and append them without overwriting existing previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const saveReport = async () => {
    setIsLoading(true);

    let storeTotalLiters = 0;
    let storeTotalDollars = 0;

    const formattedData = {
      date: report.date || new Date().toISOString().split("T")[0], // Ensure date is provided
      products: {},
      storeTotalSales: {
        totalSalesLiters: 0,
        totalSalesDollars: 0,
      },
      notes: notes || "", // Ensure notes are provided
      images: [], // Images will be handled separately after Cloudinary upload
      storeId: report.storeId, // Use the storeId from the report object
    };

    // Process product sales data for PMS, DPK, AGO
    for (const product in report.products) {
      const {
        dippingTanks,
        pumps,
        rate = 1,
        totalSalesBreakdown = { pos: 0, cash: 0, expenses: 0 },
      } = report.products[product];

      let productTotalLiters = 0;
      let productTotalDollars = 0;

      // Calculate sales for dippingTanks
      const formattedDippingTanks = dippingTanks.map((tank) => {
        const opening = parseFloat(tank.opening) || 0;
        const closing = parseFloat(tank.closing) || 0;
        const sales = opening - closing;
        productTotalLiters += sales;
        return {
          opening: tank.opening || "0",
          closing: tank.closing || "0",
          sales,
        };
      });

      // Calculate sales for nozzles within pumps
      const formattedPumps = pumps.map((pump) => {
        const formattedNozzles = pump.nozzles.map((nozzle) => {
          const opening = parseFloat(nozzle.opening) || 0;
          const closing = parseFloat(nozzle.closing) || 0;
          const sales = closing - opening;
          productTotalLiters += sales;
          return {
            opening: nozzle.opening || "0",
            closing: nozzle.closing || "0",
            sales,
          };
        });
        return { nozzles: formattedNozzles };
      });

      // Calculate total sales in currency
      productTotalDollars = productTotalLiters * rate;

      // Update overall store totals
      storeTotalLiters += productTotalLiters;
      storeTotalDollars += productTotalDollars;

      // Add the product data to the formatted data object
      formattedData.products[product] = {
        dippingTanks: formattedDippingTanks,
        pumps: formattedPumps,
        totalSalesLiters: productTotalLiters,
        totalSalesDollars: productTotalDollars,
        actualTotal: productTotalDollars,
        rate: rate || 1,
        totalSalesBreakdown: {
          pos: totalSalesBreakdown.pos || 0,
          cash: totalSalesBreakdown.cash || 0,
          expenses: totalSalesBreakdown.expenses || 0,
        },
      };
    }

    // Final store total calculations
    formattedData.storeTotalSales.totalSalesLiters = storeTotalLiters || 0;
    formattedData.storeTotalSales.totalSalesDollars = storeTotalDollars || 0;

    try {
      // Upload new images to Cloudinary if available
      let uploadedImages = [];
      if (newImages.length > 0) {
        for (const image of newImages) {
          if (
            image.type === "image/jpeg" ||
            image.type === "image/jpg" ||
            image.type === "image/png"
          ) {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("cloud_name", cloud_name);
            formData.append("upload_preset", upload_preset);

            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              { method: "post", body: formData }
            );
            const imgData = await response.json();
            uploadedImages.push(imgData.url.toString());
          }
        }
      }

      formattedData.images = uploadedImages;

      // Dispatch the formatted data and get the response with report ID
      const resultAction = await dispatch(createReport(formattedData));

      if (createReport.fulfilled.match(resultAction)) {
        const createdReport = resultAction.payload; // Access the created report
        const reportId = createdReport._id; // Get the report ID from the response

        // Send an automated email notification to the company owner
        if (company && company.ownerEmail && company.ownerName) {
          const reportDate = new Date(report.date).toISOString().split("T")[0]; // Ensure report date is in UTC and matches format

          const emailData = {
            subject: `${company.name} - Daily Sales Report Submitted`,
            send_to: company.ownerEmail, // Use the owner’s email from the company details
            reply_to: "noreply@gasstationpro.com",
            template: "salesReportSubmittedEmail",
            name: user?.name, // Owner name from company details
            companyCode: null,
            url: `/report-detail/${reportId}`,
            ownerName: company.ownerName,
            companyName: company.name,
            storeName: stores.find((store) => store._id === report.storeId)
              ?.name, // Store name
            managerName: user?.name, // Manager name from the logged-in user
            reportDate: reportDate,
          };

          await dispatch(sendAutomatedEmail(emailData));
          dispatch(EMAIL_RESET());
        }

        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (error) {
      toast.error("Failed to submit report: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {(isLoading || loadingState) && <Loader />}
      <div className="instructions">
        <h4 onClick={toggleInstructions} className="instructions__toggle">
          Instructions (Click to expand/collapse)
        </h4>
        <div
          className={`instructions__content ${isCollapsed ? "collapsed" : ""}`}
        >
          <ol>
            <li>Step 1: Select the date</li>
            <li>Step 2: For each product, select Add DippingTanks...</li>
            <li>Step 3: Select Add Pumps and add all your pump values</li>
            <li>Step 4: Enter the rate</li>
            <li>Step 5: Enter the Sales Breakdown (POS, Cash, Expenses)</li>
            <li>Step 6: Repeat the same steps for other products</li>
            <li>Step 7: Add any notes in the notes section</li>
            <li>Step 8: Upload your images</li>
            <li>Step 9: Click Save Report</li>
          </ol>
        </div>
      </div>

      <ReportForm
        report={report}
        notes={notes}
        setNotes={setNotes}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        saveReport={saveReport}
        setReport={setReport}
        imagePreviews={imagePreviews} // Image preview feature
        setImagePreviews={setImagePreviews} // Pass state setter for previews
        newImages={newImages} // Pass the new image uploads
        setNewImages={setNewImages} // Pass the setter for new images
        stores={stores} // Pass stores for admin selection
        user={user} // Pass user data for admin check
      />
    </div>
  );
};

export default AddReport;
