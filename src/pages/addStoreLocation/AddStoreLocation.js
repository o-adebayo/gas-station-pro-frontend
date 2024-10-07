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
  const [storeLocationImage, setStoreLocationImage] = useState(null);
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
      // Handle Image upload to Cloudinary if there's an image
      let imageURL = "";
      if (
        storeLocationImage &&
        (storeLocationImage.type === "image/jpeg" ||
          storeLocationImage.type === "image/jpg" ||
          storeLocationImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", storeLocationImage);
        image.append("cloud_name", cloud_name);
        image.append("upload_preset", upload_preset);

        // Upload the image to Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          { method: "post", body: image }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const imgData = await response.json();
        imageURL = imgData.url.toString();
      }

      // Prepare data to save to the database
      const formData = {
        companyCode: storeLocation.companyCode,
        name: storeLocation.name,
        location: storeLocation.location,
        pumps: storeLocation.pumps,
        nozzles: storeLocation.nozzles,
        tanks: storeLocation.tanks,
        managerEmail: storeLocation.managerEmail,
        description,
        image: imageURL, // Assign image URL after successful upload
      };

      // Dispatch the form data to create store location
      await dispatch(createStoreLocation(formData));

      toast.success("Store Location created successfully!");
      navigate("/stores"); // Redirect to the appropriate page
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
