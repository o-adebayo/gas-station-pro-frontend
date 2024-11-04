import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { createStoreLocation } from "../../redux/features/storeLocation/storeLocationSlice";
import { toast } from "react-toastify";
import { fetchUser, selectUser } from "../../redux/features/auth/authSlice";
import StoreLocationFormNew from "../../components/storeLocation/storeLocationForm/StoreLocationFormNew";
import { CircularProgress } from "@mui/material";

const cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const upload_preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const AddNewStoreLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null); // For previewing the image
  const [storeLocationImage, setStoreLocationImage] = useState(null); // To store the selected image file
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUser); // Fetch logged-in user details

  // Fetch user data when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // Handle image change and create a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreLocationImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const saveStoreLocation = async (values) => {
    setIsLoading(true);

    try {
      // Prepare form data to send to the backend
      const formData = new FormData();
      formData.append("companyCode", user.companyCode); // Attach the user's company code
      formData.append("name", values.name);
      formData.append("location", values.location);
      formData.append("pumps", values.pumps);
      formData.append("nozzles", values.nozzles);
      formData.append("tanks", values.tanks);
      formData.append("managerEmail", values.managerEmail);
      formData.append("description", values.description);

      // Append the image if it exists
      if (storeLocationImage) {
        formData.append("image", storeLocationImage);
      }

      // Dispatch the form data to create the store location
      await dispatch(createStoreLocation(formData)).unwrap();

      toast.success("Store Location created successfully!");
      navigate("/allstores"); // Redirect to the stores page after success
    } catch (error) {
      console.error("Failed to save store location:", error);
      toast.error("Failed to save store location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-store-location --my2">
      {isLoading && <CircularProgress />}

      <StoreLocationFormNew
        saveStoreLocation={saveStoreLocation} // Pass save function to the form
        imagePreview={imagePreview} // Pass image preview to the form
        handleImageChange={handleImageChange} // Handle image file selection
        setImagePreview={setImagePreview} // Set image preview
        setStoreImage={setStoreLocationImage} // Set the selected image file
      />
    </div>
  );
};

export default AddNewStoreLocation;
