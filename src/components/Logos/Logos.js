import React from "react";
import "./Logos.css";
import { logos } from "../../utils/constants";

const Logos = () => {
  return (
    <section className="logos">
      <div className="logos__slide">
        {logos.map((img, i) => (
          <img className="logo" src={img} alt={`logo-${i}`} key={i} /> // Render actual image
        ))}
        {logos.map((img, i) => (
          <img
            className="logo"
            src={img}
            alt={`logo-${i + logos.length}`}
            key={i + logos.length}
          /> // Render image again
        ))}
      </div>
      <div className="logos__overlay logos__overlay_left"></div>
      <div className="logos__overlay logos__overlay_right"></div>
    </section>
  );
};

export default Logos;
