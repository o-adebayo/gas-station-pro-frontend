import React, { useState } from "react";
import "./Pricing.css";
import PricingTile from "../PricingTile/PricingTile";
import { pricingData } from "../../utils/constants";

const Pricing = () => {
  const [planPeriod, setPlanPeriod] = useState("/ monthly");

  const planPeriodToggle = () => {
    planPeriod === "/ monthly"
      ? setPlanPeriod("/ yearly")
      : setPlanPeriod("/ monthly");
  };

  return (
    <section className="pricing">
      <div className="pricing__heading-section">
        <h3 className="h3 pricing__heading">Pricing & Plans</h3>
        <p className="text-reg pricing__subheading">
          Choose from a variety of flexible plans tailored to your business
          needs. Whether you're managing a single location or multiple stations,
          Gas Station Pro makes it easy to scale without hassle. Get started
          today and unlock powerful features designed to streamline your
          operations.
        </p>
      </div>
      <div className="pricing__billing-section">
        <p className="text-med pricing__period-text">Monthly</p>
        <label className="toggle">
          <input className="toggle__input" type="checkbox" />
          <span className="toggle__circle" onClick={planPeriodToggle}></span>
        </label>
        <p className="text-med pricing__period-text">Yearly</p>
        <span className="text-small pricing__savings">Save 25%</span>
      </div>
      <div className="pricing__tile-section">
        {pricingData.map((tile, i) => {
          return <PricingTile key={i} {...tile} planPeriod={planPeriod} />;
        })}
      </div>
    </section>
  );
};

export default Pricing;
