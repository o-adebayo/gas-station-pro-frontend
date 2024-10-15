import React, { useState } from "react";
import "./Hero.css";
import arrow from "../../assets/arrow.svg";
import abstractShapes from "../../assets/abstract-shapes.png";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Hero = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Use navigate to programmatically navigate

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSignUpClick = () => {
    navigate("/company-signup", { state: { email } }); // Pass email as state
  };

  return (
    <section className="hero">
      <div className="hero__column">
        <h1 className="h1 hero__heading">
          <span className="hero__heading-gradient">Intelligent</span>
          cloud-based{" "}
          <span className="hero__heading-gradient">Gas-Station</span>
          sales reporting tool
        </h1>
        <p className="text-reg hero__subheading">
          Experience the power of a cloud-based reporting tool and transform the
          way you work today.
        </p>
        <div className="hero__input-container">
          <input
            className="hero__input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          <button className="text-reg hero__submit" onClick={handleSignUpClick}>
            Sign up
            <img className="hero__arrow" src={arrow} alt="arrow" />
          </button>
        </div>
      </div>
      <div className="hero__column">
        <img
          className="hero__graphic"
          src={abstractShapes}
          alt="abstract shapes"
        />
      </div>
    </section>
  );
};

export default Hero;
