import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../card/Card";

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
          <label>Store Name:</label>
          <input
            type="text"
            placeholder="Store Location name"
            name="name"
            required
            value={storeLocation?.name}
            onChange={handleInputChange}
          />
          <label>Location:</label>
          <input
            type="text"
            placeholder="Store Location"
            name="location"
            required
            value={storeLocation?.location}
            onChange={handleInputChange}
          />
          <label>Number of Pumps:</label>
          <input
            type="text"
            placeholder="Number of Pumps"
            name="pumps"
            required
            value={storeLocation?.pumps}
            onChange={handleInputChange}
          />
          <label>Number of Nozzles:</label>
          <input
            type="text"
            placeholder="Number of Nozzles"
            name="nozzles"
            required
            value={storeLocation?.nozzles}
            onChange={handleInputChange}
          />
          <label>Number of Tanks:</label>
          <input
            type="text"
            placeholder="Number of Tanks"
            name="tanks"
            required
            value={storeLocation?.tanks}
            onChange={handleInputChange}
          />
          <label>Store Manager Email:</label>
          <input
            type="text"
            placeholder="Store Manager Email"
            name="managerEmail" // Make sure this matches the property in the state
            value={storeLocation?.managerEmail} // Accessing value from storeLocation state
            onChange={handleInputChange} // Updating state on input change
          />
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
