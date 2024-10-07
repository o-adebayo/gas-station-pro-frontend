import React from "react";
import Card from "../../card/Card";
import "./CompanyForm.scss";

const CompanyForm = ({ company, handleInputChange, saveCompany }) => {
  return (
    <div className="add-company">
      <Card cardClass={"card"}>
        <form onSubmit={saveCompany}>
          <label>Company Name:</label>
          <input
            type="text"
            placeholder="Company Name"
            name="name"
            required
            value={company?.name}
            onChange={handleInputChange}
          />

          <label>Address:</label>
          <input
            type="text"
            placeholder="Company Address"
            name="address"
            required
            value={company?.address}
            onChange={handleInputChange}
          />

          <label>Owner Name:</label>
          <input
            type="text"
            placeholder="Owner Name"
            name="ownerName"
            required
            value={company?.ownerName}
            onChange={handleInputChange}
          />

          <label>Owner Email:</label>
          <input
            type="email"
            placeholder="Owner Email"
            name="ownerEmail"
            required
            value={company?.ownerEmail}
            onChange={handleInputChange}
          />

          <label>owner Phone:</label>
          <input
            type="tel"
            placeholder="Owner Phone Number"
            name="phone"
            required
            value={company?.phone}
            onChange={handleInputChange}
          />

          <div className="--my">
            <button type="submit" className="--btn --btn-primary">
              Save Company
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanyForm;
