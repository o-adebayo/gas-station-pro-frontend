import React from "react";
import "./UserForm.scss";
import Card from "../../card/Card";

// Destructure props passed into the UserForm from the AddUser file
const UserForm = ({ user, handleInputChange, saveUser, stores }) => {
  return (
    <div className="add-user">
      <Card cardClass={"card form-card"}>
        <form onSubmit={saveUser} className="user-form">
          <div className="form-group">
            <label>User Name</label>
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
            <label>User Email</label>
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
            <label>User Role</label>
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
              required
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

          <div className="form-actions">
            <button type="submit" className="--btn --btn-primary --btn-block">
              Save User
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;
