import React from "react";
import "./CTA.css";
import ctaShapes from "../../assets/cta-shapes.png";
import arrow from "../../assets/arrow.svg";
import circleGradient from "../../assets/circle-gradient.png";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="cta">
      <div className="cta-content">
        <div className="cta-content__left">
          <h3 className="h3 cta__heading">
            Unlock the Full Potential of GasStationPro
          </h3>
          <p className="text-reg cta__description">
            Ready to streamline your workflow and boost your productivity? Start
            your free trial of GasStationPro today and experience the power of
            cloud-based sales reporting tool.
          </p>
          <Link to={"/company-signup"}>
            {" "}
            <button className="cta__button">
              <p className="cta__button-text">Sign Up for Free</p>
              <img className="cta__button-icon" src={arrow} alt="arrow" />
            </button>
          </Link>
        </div>
        <div className="cta-content__right">
          <img className="cta__shapes" src={ctaShapes} alt="graphic shapes" />
        </div>
      </div>
      <img
        className="cta__circle-gradient"
        src={circleGradient}
        alt="circle gradient"
      />
    </section>
  );
};

export default CTA;
