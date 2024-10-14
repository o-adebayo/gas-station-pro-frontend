import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import ReportForm from "../../components/report/reportForm/ReportForm";
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

const cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const upload_preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const EditReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const reportEdit = useSelector(selectReport);
  //const company = useSelector(selectCompany);
  const companyResponse = useSelector(selectCompany); // Get the company from the state

  const [report, setReport] = useState(null);
  const [notes, setNotes] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]); // To store the displayable previews
  const [newImages, setNewImages] = useState([]); // To store newly uploaded images
  const [existingImages, setExistingImages] = useState([]); // To track already existing images

  // Fetch user and company data when component mounts
  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchUser());
    }

    if (user?.companyCode) {
      dispatch(getCompanyByCode(user.companyCode)); // Fetch company by user's company code
    }
  }, [isLoggedIn, user, dispatch]);

  // Fetch the report to be edited
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getReport(id));
    }
  }, [isLoggedIn, dispatch, id]);

  useEffect(() => {
    if (reportEdit) {
      setReport(reportEdit);
      setNotes(reportEdit.notes || "");

      // Ensure that existing images are stored and no duplicates are added
      const uniqueExistingImages = Array.from(new Set(reportEdit.images || []));
      setExistingImages(uniqueExistingImages); // Store existing images
      setImagePreviews(uniqueExistingImages); // Set image previews to existing images
    }
  }, [reportEdit]);

  // Get the company details from the response
  const company = companyResponse?.company || {};

  // Function to dynamically handle field updates
  const handleFieldChange = (path, value) => {
    setReport((prevReport) => {
      const updatedReport = { ...prevReport };
      const keys = path.split("."); // Split the path to navigate to the field

      // Traverse to the right property using the path
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = value; // Set the final key's value
        }
        return acc[key];
      }, updatedReport);

      return updatedReport;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleFieldChange(name, value); // Use the dynamic field change function
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setNewImages((prevNewImages) => [...prevNewImages, ...files]);

    // Add new previews to imagePreviews while ensuring no duplicates with existing images
    setImagePreviews((prevPreviews) => [
      ...prevPreviews,
      ...newPreviews, // Add new image previews
    ]);
  };

  const saveReport = async () => {
    // Start with the existing images from the database (unchanged)
    let updatedImages = [...existingImages];

    // Only upload new images if they exist
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

          try {
            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              { method: "post", body: formData }
            );
            const imgData = await response.json();
            // Only add the new image URL if it doesn't already exist in updatedImages
            if (!updatedImages.includes(imgData.url)) {
              updatedImages.push(imgData.url);
            }
          } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Failed to upload some images. Please try again.");
          }
        }
      }
    }

    // Ensure there are no duplicate images
    const uniqueImages = [...new Set(updatedImages)];

    // Prepare the updated report data
    const updatedData = {
      ...report,
      notes,
      images: uniqueImages, // Ensure only unique images
    };

    try {
      const resultAction = await dispatch(
        updateReport({ id, formData: updatedData })
      );

      if (updateReport.fulfilled.match(resultAction)) {
        const updatedReport = resultAction.payload; // Access the updated report

        // Send an automated email notification to the company owner
        if (company && company.ownerEmail && company.ownerName) {
          //console.log("company", company);
          //console.log("comp owner email", company?.ownerEmail);

          const updatedDate = new Date(updatedReport.date)
            .toISOString()
            .split("T")[0]; // Ensure report date is in UTC and matches format

          const emailData = {
            subject: `${company.name} - Sales Report Updated`,
            send_to: company.ownerEmail, // Use the owner’s email from the company details
            reply_to: "noreply@gasstationpro.com",
            template: "salesReportUpdatedEmail",
            name: user?.name, // name from the logged-in user
            companyCode: null,
            url: `/report-detail/${updatedReport._id}`, // Report link
            ownerName: company.ownerName,
            companyName: company.name,
            storeName: updatedReport.storeName || "Unknown Store", // Store name (if available)
            managerName: user?.name, // Manager name from the logged-in user
            reportDate: null,
            updatedDate: updatedDate,
          };

          await dispatch(sendAutomatedEmail(emailData));
          dispatch(EMAIL_RESET());
        }

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to update report:", error);
      toast.error("Failed to update report. Please try again.");
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <h3 className="--mt">Edit Report</h3>
      {report && (
        <ReportForm
          report={report}
          notes={notes}
          setNotes={setNotes}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          saveReport={saveReport}
          setReport={setReport}
          imagePreviews={imagePreviews} // Pass previews (new and existing)
          setImagePreviews={setImagePreviews} // Pass setter for previews
          newImages={newImages} // Pass new images
          setNewImages={setNewImages} // Pass setter for new images
          existingImages={existingImages} // Pass existing images
          setExistingImages={setExistingImages} // Pass setter for existing images
          isEditMode={true}
        />
      )}
    </div>
  );
};

export default EditReport;
