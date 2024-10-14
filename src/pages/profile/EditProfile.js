import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  selectUser,
  updateUserProfile,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import ChangePassword from "../../components/changePassword/ChangePassword";
import "./EditProfile.scss";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";

const cloud_name = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const upload_preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const EditProfile = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector((state) => state.auth);

  const initialState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    storeId: user?.storeId || "",
    photo: user?.photo || "",
    role: user?.role || "",
    status: user?.status || false,
  };

  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // Update profile state whenever user data is updated
  useLayoutEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        storeId: user.storeId,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      let imageURL = profile.photo;

      // Handle image upload to Cloudinary if there's an image
      if (
        profileImage &&
        (profileImage.type === "image/jpg" ||
          profileImage.type === "image/jpeg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", cloud_name);
        image.append("upload_preset", upload_preset);

        // Upload image to Cloudinary and get the URL
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          { method: "post", body: image }
        );

        const imgData = await response.json();
        imageURL = imgData.url.toString();
      }

      // Save profile data including image URL to DB
      const userData = {
        name: profile.name,
        phone: profile.phone,
        photo: imageURL,
      };

      dispatch(updateUserProfile(userData));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="edit-profile --my2">
      {isLoading && <Loader />}

      <Card cardClass={"card --flex-dir-column"}>
        <span className="profile-photo">
          <img
            src={imagePreview === null ? profile?.photo : imagePreview}
            alt="Profileimg"
          />
        </span>
        <form className="--form-control --m" onSubmit={saveProfile}>
          <span className="profile-data">
            <p>
              <label>Name: </label>
              <input
                type="text"
                name="name"
                value={profile?.name}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label>Email: </label>
              <input type="text" name="email" value={profile?.email} disabled />
            </p>
            <p>
              <label>Phone: </label>
              <input
                type="text"
                name="phone"
                value={profile?.phone}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label>Role: </label>
              <input type="text" name="role" value={profile?.role} disabled />
            </p>
            <p>
              <label>Store ID: </label>
              <input
                type="text"
                name="storeId"
                value={profile?.storeId}
                disabled
              />
            </p>
            <p>
              <label>Photo: </label>
              <input type="file" name="photo" onChange={handleImageChange} />
            </p>
            <br />
            <code>Disabled fields cannot be changed</code>
            <div className="">
              <button className="text-med navigation__cta">Save Changes</button>
            </div>
          </span>
        </form>
      </Card>
      <br />
      <br />
      <br />
      <ChangePassword />
    </div>
  );
};

export default EditProfile;
