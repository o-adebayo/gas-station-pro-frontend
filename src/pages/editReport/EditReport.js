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
  const [products, setProducts] = useState(null); // State to handle tanks and other products
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]); // Separate state to handle new images

  useEffect(() => {
    if (isLoggedIn && !user) {
      // Fetch user data if not available
      dispatch(fetchUser());
    }

    if (isLoggedIn) {
      // Fetch the report detail when the user is logged in
      dispatch(getReport(id));
    }
  }, [isLoggedIn, user, dispatch, id]);

  useEffect(() => {
    if (reportEdit) {
      // Set report data and initialize other states
      setReport(reportEdit);
      setNotes(reportEdit.notes || "");
      setProducts({ ...reportEdit.products }); // Make a shallow copy to ensure mutability
      setImagePreviews(reportEdit.images ? [...reportEdit.images] : []); // Make a copy of the array
    }
  }, [reportEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    // Generate image preview for new images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleProductFieldChange = (
    productType,
    fieldType,
    itemId,
    field,
    value
  ) => {
    // Update specific product (dippingTanks, pumps, etc.) data using _id to identify the right item
    setProducts((prevProducts) => {
      // Find the nested field to update using itemId
      const updatedField = prevProducts[productType][fieldType].map((item) => {
        console.log("item id", item._id);
        if (item._id === itemId) {
          return { ...item, [field]: value }; // Update the specific field (e.g., opening or closing)
        }
        return item; // Return unchanged item if it's not the one we're updating
      });

      return {
        ...prevProducts,
        [productType]: {
          ...prevProducts[productType],
          [fieldType]: updatedField, // Update the specific fieldType (dippingTanks, pumps, etc.)
        },
      };
    });
  };

  // Function to handle rate change for a product
  const handleRateChange = (productType, value) => {
    setProducts((prevProducts) => ({
      ...prevProducts,
      [productType]: {
        ...prevProducts[productType],
        rate: value, // Update the rate for the specific product
      },
    }));
  };

  // Save the report after updating products and other fields
  const saveReport = async () => {
    // Create a new copy of the `updatedImages` array
    let updatedImages = [...reportEdit.images]; // Use existing images from reportEdit

    // Handle image upload to Cloudinary for new images
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

          // Upload to Cloudinary
          try {
            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              { method: "post", body: formData }
            );
            const imgData = await response.json();
            updatedImages.push(imgData.url.toString()); // Append only new image URLs
          } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Failed to upload some images. Please try again.");
          }
        }
      }
    }

    // Prepare the updated data
    const updatedData = {
      ...report,
      notes,
      products, // Include products (dippingTanks, pumps, etc.)
      images: updatedImages, // Combine existing and newly uploaded images
    };

    console.log("Updated data:", updatedData);

    try {
      await dispatch(updateReport({ id, formData: updatedData }));
      //toast.success("Report updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update report:", error);
      toast.error("Failed to update report. Please try again.");
    }
  };

  //const saveReport = async (e) => {
  //e.preventDefault();
  /*   const saveReport = async () => {
    // Create a new copy of the `updatedImages` array
    let updatedImages = reportEdit.images ? [...reportEdit.images] : [];

    // Handle image upload to Cloudinary for new images
    if (newImages.length > 0) {
      for (const image of newImages) {
        if (
          image.type === "image/jpeg" ||
          image.type === "image/jpg" ||
          image.type === "image/png"
        ) {
          const formData = new FormData();
          formData.append("file", image);
          //formData.append("cloud_name", "cloud name here");
          //formData.append("upload_preset", "upload preset value here");
          formData.append("cloud_name", cloud_name);
          formData.append("upload_preset", upload_preset);

          // Upload to Cloudinary
          try {
            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              { method: "post", body: formData }
            );
            const imgData = await response.json();
            updatedImages = [...updatedImages, imgData.url.toString()]; // Update the copy with new image URL
          } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Failed to upload some images. Please try again.");
          }
        }
      }
    }

    // Prepare the updated data - now we are sending JSON instead of FormData
    const updatedData = {
      ...report,
      notes,
      products, // Include products (dippingTanks, pumps, etc.) data
      images: updatedImages, // Combine existing and newly uploaded images
    };

    console.log(updatedData);

    try {
      // Send updatedData as a JSON object instead of FormData
      await dispatch(updateReport({ id, formData: updatedData }));
      toast.success("Report updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update report:", error);
      toast.error("Failed to update report. Please try again.");
    }
  }; */

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
          handleProductFieldChange={handleProductFieldChange}
          saveReport={saveReport}
          setReport={setReport}
          products={products}
          setProducts={setProducts}
          imagePreviews={imagePreviews}
          isEditMode={true} // Ensure the date picker is in read-only mode because we don't want users to change the date
          handleRateChange={handleRateChange} // Added handleRateChange to update rate properly
        />
      )}
    </div>
  );
};

export default EditReport;
