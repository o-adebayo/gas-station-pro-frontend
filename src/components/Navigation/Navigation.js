import React from "react";
import "./Navigation.css";
import logo from "../../assets/logo.svg";
import arrow from "../../assets/arrow.svg";
import { ShowOnLogin, ShowOnLogout } from "../protect/HiddenLink";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="navigation__logo-section">
        <img className="navigation__logo" src={logo} alt="logo" />
        <h3 className="navigation__name">GasStationPro</h3>
      </div>
      <ul className="navigation__link-section">
        <a href="#features" className="text-reg navigation__link">
          Features
        </a>
        <a href="#pricing" className="text-reg navigation__link">
          Pricing
        </a>
        <a href="#" className="text-reg navigation__link">
          Support
        </a>
        <ShowOnLogout>
          <a href="/login" className="text-reg navigation__link">
            Login
          </a>
        </ShowOnLogout>
        {/* <ShowOnLogin>
          <a href="/dashboard" className="text-reg navigation__link">
            Dashboard
          </a>
        </ShowOnLogin> */}
      </ul>
      <ShowOnLogout>
        <div className="navigation__auth-buttons">
          <Link to="/register">
            <button className="text-reg navigation__cta">
              Get Started
              <img className="navigation__arrow" src={arrow} alt="arrow" />
            </button>
          </Link>
        </div>
      </ShowOnLogout>
      <ShowOnLogin>
        <Link to="/dashboard">
          <button className="text-reg navigation__cta">
            Dashboard
            <img className="navigation__arrow" src={arrow} alt="arrow" />
          </button>
        </Link>
      </ShowOnLogin>
    </nav>
  );
};

export default Navigation;
