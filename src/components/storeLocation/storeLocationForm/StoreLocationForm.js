import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../card/Card";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import {
  fetchUsers,
  selectUsers,
} from "../../../redux/features/auth/authSlice"; // Import fetchUsers and selectUsers

import "./StoreLocationForm.scss";

const StoreLocationForm = ({
  storeLocation,
  storeLocationImage,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange,
  saveStoreLocation,
}) => {
  const dispatch = useDispatch();

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers()); // Fetch all users when the form loads
  }, [dispatch]);

  const users = useSelector(selectUsers) || []; // Get the list of users

  return (
    <div className="add-storeLocation">
      <Card cardClass={"card"}>
        <form onSubmit={saveStoreLocation}>
          {
            <Card cardClass={"group"}>
              <label>Store Image</label>
              <code className="--color-dark">
                Supported Formats: jpg, jpeg, png
              </code>
              <input
                type="file"
                name="image"
                onChange={(e) => handleImageChange(e)}
              />

              {imagePreview != null ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="store location" />
                </div>
              ) : (
                <p>No image set for this store location.</p>
              )}
            </Card>
          }
          <label>
            Store Name: <span className="asterisk">*</span>
          </label>
          <input
            type="text"
            placeholder="Store Location name"
            name="name"
            required
            value={storeLocation?.name}
            onChange={handleInputChange}
          />
          <label>
            Location: <span className="asterisk">*</span>
          </label>
          <input
            type="text"
            placeholder="Store Location"
            name="location"
            required
            value={storeLocation?.location}
            onChange={handleInputChange}
          />
          <label>
            Number of Pumps: <span className="asterisk">*</span>
          </label>
          <input
            type="text"
            placeholder="Number of Pumps"
            name="pumps"
            required
            value={storeLocation?.pumps}
            onChange={handleInputChange}
          />
          <label>
            Number of Nozzles: <span className="asterisk">*</span>
          </label>
          <input
            type="text"
            placeholder="Number of Nozzles"
            name="nozzles"
            required
            value={storeLocation?.nozzles}
            onChange={handleInputChange}
          />
          <label>
            Number of Tanks: <span className="asterisk">*</span>
          </label>
          <input
            type="text"
            placeholder="Number of Tanks"
            name="tanks"
            required
            value={storeLocation?.tanks}
            onChange={handleInputChange}
          />
          {/* Manager Email Dropdown */}
          <label>Store Manager Email:</label>
          <select
            name="managerEmail"
            value={storeLocation?.managerEmail}
            onChange={handleInputChange}
          >
            <option value="">Select Manager Email</option>
            {users
              .filter((user) => user.role === "manager") // Only show managers
              .map((manager) => (
                <option key={manager._id} value={manager.email}>
                  {manager.email}
                </option>
              ))}
          </select>
          <label>Store Description:</label>
          {
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={StoreLocationForm.modules}
              formats={StoreLocationForm.formats}
            />
          }
          <div className="--my">
            <button type="submit" className="text-reg navigation__cta">
              Save Store
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

StoreLocationForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
StoreLocationForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default StoreLocationForm;
