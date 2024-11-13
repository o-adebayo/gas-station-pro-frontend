import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Loader from "../../components/loader/Loader";
import {
  createReport,
  selectIsLoading,
} from "../../redux/features/report/reportSlice";
import ReportFormNew from "../../components/report/reportForm/ReportFormNew";
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

import { CircularProgress } from "@mui/material";

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
  storeId: "",
};

const AddReportNew = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [report, setReport] = useState(initialState);
  const [notes, setNotes] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadingState = useSelector(selectIsLoading);
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const companyResponse = useSelector(selectCompany);

  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchUser());
    }
  }, [isLoggedIn, user, dispatch]);

  useEffect(() => {
    if (user?.companyCode) {
      dispatch(fetchStoreLocations(user.companyCode));
      dispatch(getCompanyByCode(user.companyCode));
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const saveReport = async (values) => {
    console.log("Store ID in saveReport:", values.storeId); // Confirm storeId is passed to saveReport
    setIsLoading(true);

    let storeTotalLiters = 0;
    let storeTotalDollars = 0;

    const formattedData = {
      date: values.date || dayjs(new Date()).format("YYYY-MM-DD"),
      products: values.products,
      storeTotalSales: {
        totalSalesLiters: 0,
        totalSalesDollars: 0,
      },
      notes: values.notes || "",
      images: [],
      storeId: values.storeId,
    };

    for (const product in values.products) {
      const {
        dippingTanks,
        pumps,
        rate = 1,
        totalSalesBreakdown = { pos: 0, cash: 0, expenses: 0 },
      } = values.products[product];

      let productTotalLiters = 0;
      let productTotalDollars = 0;

      const formattedDippingTanks = dippingTanks.map((tank) => {
        const opening = parseFloat(tank.opening) || 0;
        const closing = parseFloat(tank.closing) || 0;
        const sales = opening - closing;
        return { opening: tank.opening, closing: tank.closing, sales };
      });

      const formattedPumps = pumps.map((pump) => {
        const formattedNozzles = pump.nozzles.map((nozzle) => {
          const opening = parseFloat(nozzle.opening) || 0;
          const closing = parseFloat(nozzle.closing) || 0;
          const sales = closing - opening;
          productTotalLiters += sales;
          return { opening: nozzle.opening, closing: nozzle.closing, sales };
        });
        return { nozzles: formattedNozzles };
      });

      productTotalDollars = productTotalLiters * rate;

      storeTotalLiters += productTotalLiters;
      storeTotalDollars += productTotalDollars;

      formattedData.products[product] = {
        dippingTanks: formattedDippingTanks,
        pumps: formattedPumps,
        totalSalesLiters: productTotalLiters,
        totalSalesDollars: productTotalDollars,
        actualTotal: productTotalDollars,
        rate: rate || 1,
        totalSalesBreakdown,
      };
    }

    formattedData.storeTotalSales = {
      totalSalesLiters: storeTotalLiters,
      totalSalesDollars: storeTotalDollars,
    };

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(formattedData));
      newImages.forEach((image) => formData.append("images", image));

      const resultAction = await dispatch(createReport(formData));

      if (createReport.fulfilled.match(resultAction)) {
        toast.success("Report submitted successfully.");
        navigate("/reports");
      }
    } catch (error) {
      toast.error("Failed to submit report: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {(isLoading || loadingState) && (
        <Loader message="Saving Report data..." />
      )}
      <ReportFormNew
        report={report}
        notes={notes}
        setNotes={setNotes}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        saveReport={saveReport}
        setReport={setReport}
        imagePreviews={imagePreviews}
        setImagePreviews={setImagePreviews}
        newImages={newImages}
        setNewImages={setNewImages}
        stores={stores}
        user={user}
      />
    </div>
  );
};

export default AddReportNew;
