import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom"; // Import useLocation to access state
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { createCompany } from "../../redux/features/company/companySlice";
import Loader from "../../components/loader/Loader";

const initialState = {
  name: "",
  address: "",
  ownerName: "",
  ownerEmail: "", // Email will be prefilled from Hero.js or PricingTile.js
  phone: "",
  planType: "Gold", // Default to Gold
  planCycle: "Monthly", // Default to Monthly
};

const CompanySignUp = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Access location to get the planType and planCycle

  const [formData, setFormData] = useState(initialState);
  const { name, address, ownerName, ownerEmail, phone, planType, planCycle } =
    formData;

  const [isLoading, setIsLoading] = useState(false);

  // Prefill the ownerEmail from Hero.js and plan details from PricingTile.js if available
  useEffect(() => {
    const { email, planType: plan, planCycle: cycle } = location.state || {};

    console.log("Email:", email);
    console.log("Plan Type:", plan);
    console.log("Plan Cycle:", cycle);

    setFormData((prevState) => ({
      ...prevState,
      ownerEmail: email || prevState.ownerEmail, // Prefill email from Hero.js
      planType: plan || prevState.planType, // Prefill planType from PricingTile.js
      planCycle: cycle || prevState.planCycle, // Prefill planCycle from PricingTile.js
    }));
  }, [location.state]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleCompanySignUp = async (e) => {
    e.preventDefault();

    if (!name || !address || !ownerName || !ownerEmail || !phone) {
      return toast.error("All fields are required.");
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(ownerEmail)) {
      return toast.error("Please enter a valid email.");
    }

    const companyData = {
      name,
      address,
      ownerName,
      ownerEmail,
      phone,
      planType,
      planCycle,
    };

    setIsLoading(true);
    try {
      await dispatch(createCompany(companyData));
      setFormData(initialState); // Clear the form after submission
      toast.success("Company created successfully!");
    } catch (error) {
      console.error("Failed to create company:", error);
      toast.error("Failed to create company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <h2>Company Sign Up</h2>
          <form onSubmit={handleCompanySignUp}>
            <input
              type="text"
              placeholder="Company Name"
              name="name"
              value={name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={address}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              placeholder="Owner Name"
              name="ownerName"
              value={ownerName}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              placeholder="Owner Email"
              name="ownerEmail"
              value={ownerEmail} // Prefilled from Hero.js or PricingTile.js
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              placeholder="Owner Phone"
              name="phone"
              value={phone}
              onChange={handleInputChange}
              required
            />

            {/* Plan Type Dropdown */}
            <div className={styles.dropdown}>
              <label htmlFor="planType">Plan Type:</label>
              <select
                name="planType"
                value={planType}
                onChange={handleInputChange}
              >
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>

            {/* Plan Cycle Dropdown */}
            <div className={styles.dropdown}>
              <label htmlFor="planCycle">Plan Cycle:</label>
              <select
                name="planCycle"
                value={planCycle}
                onChange={handleInputChange}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <button type="submit" className="--btn --btn-primary --btn-block">
              Sign Up
            </button>
          </form>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p> &nbsp; Already have a company code? &nbsp;</p>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default CompanySignUp;
