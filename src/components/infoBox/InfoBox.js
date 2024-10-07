import React from "react";
import "./InfoBox.scss";

//pass a prop for different things on the box on the top of the dashboard page
// this will be used in the ReportSummary file
const InfoBox = ({ bgColor, title, count, icon }) => {
  return (
    <div className={`info-box ${bgColor}`}>
      <span className="info-icon --color-white">{icon}</span>
      <span className="info-text">
        <p>{title}</p>
        <h4>{count}</h4>
      </span>
    </div>
  );
};

export default InfoBox;
