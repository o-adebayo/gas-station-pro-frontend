// src/components/Loader.js
import React from "react";
import ReactDOM from "react-dom";
import { CircularProgress, Typography, Box } from "@mui/material";
import "./Loader.scss";

const Loader = ({ message = "Loading..." }) => {
  return ReactDOM.createPortal(
    <div className="wrapper">
      <div className="loader">
        <CircularProgress />
        <Typography variant="body1" mt={2} color="textSecondary">
          {message}
        </Typography>
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export const SpinnerImg = ({ message = "Loading..." }) => (
  <div className="--center-all">
    <CircularProgress />
    <Typography variant="body2" mt={1} color="textSecondary">
      {message}
    </Typography>
  </div>
);

export default Loader;
