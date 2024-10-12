import React from "react";
import "./Features.css";
import { features } from "../../utils/constants";

const Features = () => {
  return (
    <section className="features">
      <div className="features__heading-container">
        <h2 className="h2 features__heading">
          Discover the Power of{" "}
          <span className="h2 features__text-gradient">GasStationPro</span>
        </h2>
        <p className="text-reg features__subheading">
          GasStationPro is packed with innovative features designed to
          revolutionize the way you manage your sales data, collaborate with
          others, and stay organized.
        </p>
      </div>
      <div className="features__feature-container">
        {features.map((obj, i) => {
          return (
            <div className={`feature ${obj.gridArea}`} key={i}>
              {/* Render the icon instead of an image */}
              <div className="feature__icon">{obj.icon}</div>

              {/* Feature heading and description */}
              <p className="text-large feature__heading">{obj.heading}</p>
              <p className="text-reg feature__description">{obj.description}</p>
            </div>
          );
        })}
      </div>
      <div className="features__overlay-gradient"></div>
    </section>
  );
};

export default Features;
