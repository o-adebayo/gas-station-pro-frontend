import React from "react";
import loaderImg from "../../assets/loader.gif";
import ReactDOM from "react-dom";
import "./Loader.scss";
import { CircularProgress } from "@mui/material";

const Loader = () => {
  return ReactDOM.createPortal(
    <div className="wrapper">
      <div className="loader">
        {/* <img src={loaderImg} alt="Loading..." /> */}
        <CircularProgress />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export const SpinnerImg = () => {
  return (
    <div className="--center-all">
      {/* <img src={loaderImg} alt="Loading..." /> */}
      <CircularProgress />
    </div>
  );
};

export default Loader;
