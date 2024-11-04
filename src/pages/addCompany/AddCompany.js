import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { createCompany } from "../../redux/features/company/companySlice"; // Assuming this action exists
//import CompanyForm from "../../components/companyForm/CompanyForm";
import CompanyForm from "../../components/company/companyForm/CompanyForm";

import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const initialState = {
  name: "",
  address: "",
  ownerName: "",
  ownerEmail: "",
  phone: "",
};

const AddCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [company, setCompany] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const saveCompany = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Dispatch the form data to create a company
      await dispatch(createCompany(company));

      toast.success("Company created successfully!");
      //navigate("/companies"); // Redirect to the appropriate page
      navigate("/add-company"); // Redirect to the appropriate page
    } catch (error) {
      console.error("Failed to save company:", error);
      toast.error("Failed to save company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-company --my2">
      {isLoading && <CircularProgress />}

      {/* <h3 className="--mt">Add New Company</h3> */}
      <CompanyForm
        company={company}
        handleInputChange={handleInputChange}
        saveCompany={saveCompany}
      />
    </div>
  );
};

export default AddCompany;
