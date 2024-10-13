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

  const [report, setReport] = useState(null);
  const [notes, setNotes] = useState("");
  const [products, setProducts] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]); // To store the displayable previews
  const [newImages, setNewImages] = useState([]); // To store newly uploaded images
  const [existingImages, setExistingImages] = useState([]); // To track already existing images

  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(fetchUser());
    }

    if (isLoggedIn) {
      dispatch(getReport(id));
    }
  }, [isLoggedIn, user, dispatch, id]);

  useEffect(() => {
    if (reportEdit) {
      setReport(reportEdit);
      setNotes(reportEdit.notes || "");
      setProducts({ ...reportEdit.products });

      // Ensure that existing images are stored and no duplicates are added
      const uniqueExistingImages = Array.from(new Set(reportEdit.images || []));
      setExistingImages(uniqueExistingImages); // Store existing images
      setImagePreviews(uniqueExistingImages); // Set image previews to existing images
    }
  }, [reportEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
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
    console.log("new images lenght", newImages.length);
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
      products,
      images: uniqueImages, // Ensure only unique images
    };

    console.log("Final updated data:", updatedData);

    try {
      await dispatch(updateReport({ id, formData: updatedData }));
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update report:", error);
      toast.error("Failed to update report. Please try again.");
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <h3 className="--mt">Edit Report</h3>
      {report && products && (
        <ReportForm
          report={report}
          notes={notes}
          setNotes={setNotes}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          saveReport={saveReport}
          setReport={setReport}
          products={products}
          setProducts={setProducts}
          imagePreviews={imagePreviews} // Show previews (both new and existing)
          isEditMode={true}
        />
      )}
    </div>
  );
};

export default EditReport;
