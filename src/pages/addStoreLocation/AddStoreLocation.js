import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { createStoreLocation } from "../../redux/features/storeLocation/storeLocationSlice";
import StoreLocationForm from "../../components/storeLocation/storeLocationForm/StoreLocationForm";
import { toast } from "react-toastify";
import { fetchUser, selectUser } from "../../redux/features/auth/authSlice";

const cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const upload_preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const initialState = {
  companyCode: "",
  name: "",
  location: "",
  pumps: "",
  nozzles: "",
  tanks: "",
  managerId: "",
  managerEmail: "",
};

const AddStoreLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [storeLocation, setStoreLocation] = useState(initialState);
  const [storeLocationImage, setStoreLocationImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(selectUser);

  // Fetch user data when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    } else {
      setStoreLocation((prevState) => ({
        ...prevState,
        companyCode: user.companyCode,
      }));
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreLocation({ ...storeLocation, [name]: value });
  };

  const handleImageChange = (e) => {
    setStoreLocationImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const saveStoreLocation = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare form data to send to the backend
      const formData = new FormData();
      formData.append("companyCode", storeLocation.companyCode);
      formData.append("name", storeLocation.name);
      formData.append("location", storeLocation.location);
      formData.append("pumps", storeLocation.pumps);
      formData.append("nozzles", storeLocation.nozzles);
      formData.append("tanks", storeLocation.tanks);
      formData.append("managerEmail", storeLocation.managerEmail);
      formData.append("description", description);

      // Append the image if it exists
      if (storeLocationImage) {
        formData.append("image", storeLocationImage);
      }

      // Dispatch the form data to create the store location
      await dispatch(createStoreLocation(formData)).unwrap();

      toast.success("Store Location created successfully!");
      navigate("/stores"); // Redirect to the stores page after success
    } catch (error) {
      console.error("Failed to save store location:", error);
      toast.error("Failed to save store location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-store-location --my2">
      {isLoading && <Loader />}

      <h3 className="--mt">Add New Store</h3>
      <StoreLocationForm
        storeLocation={storeLocation}
        storeLocationImage={storeLocationImage}
        imagePreview={imagePreview}
        description={description}
        setDescription={setDescription}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        saveStoreLocation={saveStoreLocation}
      />
    </div>
  );
};

export default AddStoreLocation;
