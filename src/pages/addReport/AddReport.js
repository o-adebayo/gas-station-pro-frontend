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
  fetchUser, // Import the thunk action for fetching user data
  selectIsLoggedIn,
} from "../../redux/features/auth/authSlice";

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
  images: [],
};

const AddReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [report, setReport] = useState(initialState);
  const [notes, setNotes] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]); // For image preview
  const [isLoading, setIsLoading] = useState(false);

  const loadingState = useSelector(selectIsLoading);
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReport({ ...report, images: files });

    // Generate image preview
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  //const saveReport = async (e) => {
  // e.preventDefault();
  //setIsLoading(true);
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
      notes: notes || "", // Ensure notes is provided
      images: [], // Handle images separately
    };

    // Iterate over each product to calculate sales and totals
    for (const product in report.products) {
      const {
        dippingTanks,
        pumps,
        rate = 1,
        totalSalesBreakdown = { pos: 0, cash: 0, expenses: 0 },
      } = report.products[product]; // Default rate and breakdown values

      let productTotalLiters = 0;
      let productTotalDollars = 0;

      // Calculate sales for tanks (dippingTanks)
      const formattedDippingTanks = dippingTanks.map((tank) => {
        const opening = parseFloat(tank.opening) || 0;
        const closing = parseFloat(tank.closing) || 0;
        const sales = opening - closing; // Tanks decrease over time
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
          const sales = closing - opening; // Pumps increase over time
          productTotalLiters += sales;
          return {
            opening: nozzle.opening || "0",
            closing: nozzle.closing || "0",
            sales,
          };
        });
        return { nozzles: formattedNozzles };
      });

      // Calculate total sales in dollars
      productTotalDollars = productTotalLiters * rate;

      // Add product totals to overall store totals
      storeTotalLiters += productTotalLiters;
      storeTotalDollars += productTotalDollars;

      // Add the calculated product data to the formatted data
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

    // Add store totals and ensure they are correctly set
    formattedData.storeTotalSales.totalSalesLiters = storeTotalLiters || 0;
    formattedData.storeTotalSales.totalSalesDollars = storeTotalDollars || 0;

    try {
      // Handle image upload to Cloudinary if there are images
      let uploadedImages = [];
      if (report.images && report.images.length > 0) {
        for (const image of report.images) {
          if (
            image.type === "image/jpeg" ||
            image.type === "image/jpg" ||
            image.type === "image/png"
          ) {
            const formData = new FormData();
            formData.append("file", image);
            //formData.append("cloud_name", "cloud name here");
            //formData.append("upload_preset", "preset value here");
            formData.append("cloud_name", cloud_name);
            formData.append("upload_preset", upload_preset);

            // Upload to Cloudinary
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

      // Dispatch the JSON data directly
      await dispatch(createReport(formattedData)); // Await the response from createReport
      navigate("/dashboard"); // Redirect after submission if needed
    } catch (error) {
      toast.error("Failed to submit report: " + error.message); // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {(isLoading || loadingState) && <Loader />}
      {/* <h3 className="text-large primary-100">Add New Sales Report</h3> */}

      {/* Step-by-step instructions for the user */}
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
        imagePreviews={imagePreviews}
      />
    </div>
  );
};

export default AddReport;
