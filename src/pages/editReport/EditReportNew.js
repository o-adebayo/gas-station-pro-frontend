import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import dayjs from "dayjs";
import EditReportFormNew from "../../components/report/reportForm/EditReportFormNew";
import {
  getReport,
  selectIsLoading,
  selectReport,
  updateReport,
} from "../../redux/features/report/reportSlice";
import {
  selectIsLoggedIn,
  fetchUser,
  selectUser,
} from "../../redux/features/auth/authSlice";
import {
  getCompanyByCode,
  selectCompany,
} from "../../redux/features/company/companySlice";
import {
  EMAIL_RESET,
  sendAutomatedEmail,
} from "../../redux/features/email/emailSlice";
import { toast } from "react-toastify";
import { selectStores } from "../../redux/features/storeLocation/storeLocationSlice";
import { CircularProgress } from "@mui/material";

const EditReportNew = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const reportEdit = useSelector(selectReport);
  const companyResponse = useSelector(selectCompany);

  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  const [report, setReport] = useState(null);
  const [notes, setNotes] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [step, setStep] = useState(0);

  const productKeys = report ? Object.keys(report.products) : [];
  const isLastStep = step === productKeys.length;

  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchUser());
    }

    if (user?.companyCode) {
      dispatch(getCompanyByCode(user.companyCode));
    }
  }, [isLoggedIn, user, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getReport(id));
    }
  }, [isLoggedIn, dispatch, id]);

  useEffect(() => {
    if (reportEdit) {
      setReport({
        ...reportEdit,
        products: reportEdit.products || {
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
      });
      setNotes(reportEdit.notes || "");

      const uniqueExistingImages = Array.from(new Set(reportEdit.images || []));
      setExistingImages(uniqueExistingImages);
      setImagePreviews(uniqueExistingImages);
    }
  }, [reportEdit]);

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
    let storeTotalLiters = 0;
    let storeTotalDollars = 0;

    const updatedProducts = Object.keys(values.products).reduce(
      (acc, product) => {
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
          return { opening, closing, sales };
        });

        const formattedPumps = pumps.map((pump) => {
          const formattedNozzles = pump.nozzles.map((nozzle) => {
            const opening = parseFloat(nozzle.opening) || 0;
            const closing = parseFloat(nozzle.closing) || 0;
            const sales = closing - opening;
            productTotalLiters += sales;
            return { opening, closing, sales };
          });
          return { nozzles: formattedNozzles };
        });

        productTotalDollars = productTotalLiters * rate;
        storeTotalLiters += productTotalLiters;
        storeTotalDollars += productTotalDollars;

        acc[product] = {
          dippingTanks: formattedDippingTanks,
          pumps: formattedPumps,
          totalSalesLiters: productTotalLiters,
          totalSalesDollars: productTotalDollars,
          rate,
          totalSalesBreakdown,
        };

        return acc;
      },
      {}
    );

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        ...report,
        notes: values.notes || "",
        images: existingImages,
        date: values.date || dayjs(new Date()).format("YYYY-MM-DD"),
        products: updatedProducts,
        storeTotalSales: {
          totalSalesLiters: storeTotalLiters,
          totalSalesDollars: storeTotalDollars,
        },
      })
    );

    newImages.forEach((image) => formData.append("images", image));

    try {
      const resultAction = await dispatch(updateReport({ id, formData }));

      if (updateReport.fulfilled.match(resultAction)) {
        const updatedReport = resultAction.payload;

        if (companyResponse.company && companyResponse.company.ownerEmail) {
          const emailData = {
            subject: `${companyResponse.company.name} - Sales Report Updated`,
            send_to: companyResponse.company.ownerEmail,
            reply_to: "noreply@gasstationpro.com",
            template: "salesReportUpdatedEmail",
            name: user?.name,
            companyCode: null,
            url: `/report-detail/${updatedReport._id}`,
            ownerName: companyResponse.company.ownerName,
            companyName: companyResponse.company.name,
            storeName: updatedReport.storeName || "Unknown Store",
            managerName: user?.name,
            updatedDate: dayjs(new Date()).format("YYYY-MM-DD"),
          };

          await dispatch(sendAutomatedEmail(emailData));
          dispatch(EMAIL_RESET());
        }

        navigate("/reports");
      }
    } catch (error) {
      toast.error("Failed to update report. Please try again.");
    }
  };

  const handleNextStep = () => {
    if (step < productKeys.length) setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    if (step > 0) setStep((prevStep) => prevStep - 1);
  };

  return (
    <div>
      {isLoading && <CircularProgress />}
      {report && (
        <EditReportFormNew
          report={report}
          notes={notes}
          setNotes={setNotes}
          handleImageChange={handleImageChange}
          saveReport={saveReport}
          setReport={setReport}
          imagePreviews={imagePreviews}
          setImagePreviews={setImagePreviews}
          newImages={newImages}
          setNewImages={setNewImages}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          step={step}
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
          isLastStep={isLastStep}
          stores={stores}
          user={user}
        />
      )}
    </div>
  );
};

export default EditReportNew;
