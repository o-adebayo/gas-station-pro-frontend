import React from "react";
import "./UserForm.scss";
import Card from "../../card/Card";

// Destructure props passed into the UserForm from the AddUser file
const UserForm = ({
  user,
  handleInputChange,
  handleImageChange, // For handling image changes
  imagePreview, // For previewing the selected image
  saveUser,
  stores,
}) => {
  return (
    <div className="add-user">
      <Card cardClass={"card form-card"}>
        <form onSubmit={saveUser} className="user-form">
          <div className="form-group">
            <label>
              User Name <span className="asterisk">*</span>
            </label>
            <input
              type="text"
              placeholder="User Name"
              name="name"
              value={user?.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              User Email <span className="asterisk">*</span>
            </label>
            <input
              type="email"
              placeholder="User Email"
              name="email"
              value={user?.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              User Role <span className="asterisk">*</span>
            </label>
            <select
              name="role"
              value={user?.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Store Name</label>
            <select
              name="storeName"
              value={user?.storeName}
              onChange={handleInputChange}
              /* required */
            >
              <option value="">Select Store</option>
              {stores.map((store) => (
                <option key={store._id} value={store.name}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>User Phone</label>
            <input
              type="text"
              placeholder="User Phone"
              name="phone"
              value={user?.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>User Profile Picture</label>
            <code className="--color-dark">
              Supported Formats: jpg, jpeg, png
            </code>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview != null ? (
              <div className="image-preview">
                <img src={imagePreview} alt="User profile" />
              </div>
            ) : (
              <p>No image set for this user.</p>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="text-reg navigation__cta">
              Save User
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;
