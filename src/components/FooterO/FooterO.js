import React, { useState } from "react";
import "./FooterO.css";
import logo from "../../assets/logo.svg";
import arrow from "../../assets/colored-arrow.svg";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const FooterO = () => {
  const [email, setEmail] = useState(""); // State to store email
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Function to handle Sign Up button click
  const handleSignUpClick = () => {
    navigate("/company-signup", { state: { email } }); // Navigate and pass the email
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content-left">
          <div className="footer__company-container">
            <img className="footer__logo" src={logo} alt="icon" />
            <h2 className="footer__company">GasStationPro</h2>
          </div>
          <div className="footer__input-container">
            <input
              className="footer__input"
              type="email"
              placeholder="Enter email"
              value={email} // Bind email input to state
              onChange={handleEmailChange} // Handle input changes
            />
            <img
              className="footer__input-icon"
              src={arrow}
              alt="arrow"
              onClick={handleSignUpClick} // Navigate to sign-up with email on click
            />
          </div>
        </div>
        <div className="footer__content-right">
          <div className="footer__link-col">
            <p className="text-reg footer__col-heading">Product</p>
            <a href="#" className="text-small footer__link">
              About
            </a>
            <a href="#features" className="text-small footer__link">
              Features
            </a>
            <a href="#pricing" className="text-small footer__link">
              Pricing
            </a>
            <a href="#" className="text-small footer__link">
              Integrations
            </a>
            <a href="#" className="text-small footer__link">
              FAQs
            </a>
          </div>
          <div className="footer__link-col">
            <p className="text-reg footer__col-heading">Company</p>
            <a href="#" className="text-small footer__link">
              Our Story
            </a>
            <a href="#" className="text-small footer__link">
              Team
            </a>
            <a href="#" className="text-small footer__link">
              Careers
            </a>
            <a href="#" className="text-small footer__link">
              Press
            </a>
            <a href="#" className="text-small footer__link">
              Contact Us
            </a>
          </div>
          <div className="footer__link-col">
            <p className="text-reg footer__col-heading">Resources</p>
            <a href="#" className="text-small footer__link">
              Blog
            </a>
            <a href="#" className="text-small footer__link">
              Webinars
            </a>
            <a href="#" className="text-small footer__link">
              Case Studies
            </a>
            <a href="#" className="text-small footer__link">
              Templates
            </a>
            <a href="#" className="text-small footer__link">
              Help Center
            </a>
          </div>
          <div className="footer__link-col">
            <p className="text-reg footer__col-heading">Legal</p>
            <a href="#" className="text-small footer__link">
              Terms of Service
            </a>
            <a href="#" className="text-small footer__link">
              Privacy Policy
            </a>
            <a href="#" className="text-small footer__link">
              Cookie Policy
            </a>
            <a href="#" className="text-small footer__link">
              Acceptable Use
            </a>
            <a href="#" className="text-small footer__link">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
      <div className="footer__banner">
        <p className="text-small footer__copywright">
          &copy; 2024 GasStationPro. All rights reserved.
        </p>
        <div className="footer__external-links">
          <button className="footer__external-link facebook"></button>
          <button className="footer__external-link linkedin"></button>
          <button className="footer__external-link twitter"></button>
          <button className="footer__external-link youtube"></button>
        </div>
      </div>
    </footer>
  );
};

export default FooterO;
