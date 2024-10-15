import React from "react";
import "./PricingTile.css";
import check from "../../assets/check.png";
import arrowDark from "../../assets/arrow.svg";
import arrowLight from "../../assets/colored-arrow.svg";
import { useNavigate } from "react-router-dom";

const PricingTile = ({
  plan,
  planIcon,
  planPrice,
  planPeriod, // Receive planPeriod as a prop
  bullets,
  CallToAction,
  darkMode,
}) => {
  const navigate = useNavigate();
  const dark = darkMode ? "dark" : "";

  // Ensure that prices are formatted based on the planPeriod
  const price =
    planPeriod === "/ monthly"
      ? "$" + planPrice?.toFixed(2)
      : "$" + (planPrice * 12 * 0.75)?.toFixed(2); // Apply discount for yearly plans

  // Handle the "Start Free Trial" button click for Gold and Platinum plans
  const handleStartFreeTrial = () => {
    const cycle = planPeriod.includes("monthly") ? "Monthly" : "Yearly"; // Standardize cycle to match the dropdown
    navigate("/company-signup", {
      state: {
        planType: plan.includes("Platinum") ? "Platinum" : "Gold", // Ensure the planType matches the dropdown value
        planCycle: cycle, // Use the standardized cycle value
      },
    });
  };

  // Handle the "Contact Support" for custom pricing plans in a new window
  const handleContactSupport = () => {
    const mailtoUrl =
      "mailto:we.are.gasstationpro@gmail.com?subject=New Enquiry - Gas Station Pro Enterprise Plan";
    window.open(mailtoUrl, "_blank");
  };

  return (
    <div className={`pricing-tile ${dark}`}>
      <div className="plan-section">
        <img className="plan-section__icon" src={planIcon} alt={plan} />
        <p className="text-small plan-section__plan">{plan}</p>
      </div>
      <div className="pricing-section">
        <h2 className={`h2 pricing-section__price ${dark}`}>
          {planPrice ? price : "Custom"}
        </h2>
        <p className={`text-reg pricing-section__period ${dark}`}>
          {planPrice ? planPeriod : ""}
        </p>
      </div>
      <div className="bullets-section">
        {bullets.map((bullet, i) => {
          return (
            <div className="pricing-bullet" key={i}>
              <img className="pricing-bullet__check" src={check} alt="check" />
              <p className={`text-reg pricing-bullet__text ${dark}`}>
                {bullet}
              </p>
            </div>
          );
        })}
      </div>

      {/* Display "Start Free Trial" for Gold and Platinum, and "Contact Support" for Custom */}
      {planPrice ? (
        <button
          className={`pricing-cta ${dark}`}
          onClick={handleStartFreeTrial}
        >
          <span className="text-med pricing-cta__text">{CallToAction}</span>
          <img
            className={`pricing-cta__icon ${dark}`}
            src={darkMode ? arrowDark : arrowLight}
            alt="arrow"
          />
        </button>
      ) : (
        <button
          className={`pricing-cta ${dark}`}
          onClick={handleContactSupport}
        >
          <span className="text-med pricing-cta__text">Contact Support</span>
          <img
            className={`pricing-cta__icon ${dark}`}
            src={darkMode ? arrowDark : arrowLight}
            alt="arrow"
          />
        </button>
      )}
      <p className="text-tiny pricing-tile__no-card">
        {planPrice ? "No credit card required" : ""}
      </p>
    </div>
  );
};

export default PricingTile;
