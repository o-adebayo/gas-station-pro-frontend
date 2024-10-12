import React from "react";
//import { MdOutlineGasMeter } from "react-icons/md";
//import { Link } from "react-router-dom";
import "./Home.scss";
//import heroImg from "../../assets/inv-img.png";
//import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

//images
import doubleQoute from "../../assets/double-quote.svg";

// fonts
import "../../fonts/fonts.css";

// components that are displayed or used on the home page
import Page from "../../components/Page/Page";
import HeaderO from "../../components/HeaderO/HeaderO";
import Hero from "../../components/Hero/Hero";
import Logos from "../../components/Logos/Logos";
import Testimonial from "../../components/Testimonial/Testimonial";
import Features from "../../components/Features/Features";
//import Video from "../../components/Video/Video";
import Pricing from "../../components/Pricing/Pricing";
import FAQ from "../../components/FAQ/FAQ";
import CTA from "../../components/CTA/CTA";
import FooterO from "../../components/FooterO/FooterO";
import Navigation from "../../components/Navigation/Navigation";
import Accordion from "../../components/Accordion/Accordion";

const Home = () => {
  return (
    <Page>
      <HeaderO>
        <Navigation />
        <Hero />
      </HeaderO>
      <Logos />
      <Testimonial>
        <h5 className="h5 testimonial__heading">
          With Gas Station Pro, our store managers can seamlessly save daily
          sales reports to the cloud, ensuring secure, real-time access and
          boosting operational efficiency like never before.
        </h5>
        <div className="testimonial__author-section">
          <p className="text-reg testimonial__author">Isiaka Jamiu</p>

          <p className="text-reg testimonial__organization">Habeeb Oil</p>
        </div>
        <img className="testimonial__quotes" src={doubleQoute} alt="quote" />
      </Testimonial>
      {/* Features Section */}
      <section id="features">
        <Features />
      </section>
      <Testimonial>
        <h5 className="h5 testimonial__heading">
          Gas Station Pro has made managing our daily sales reports so much
          easier. The real-time updates and data insights have allowed us to
          make better business decisions.
        </h5>
        <div className="testimonial__author-section">
          <p className="text-reg testimonial__author">Adedayo Ojo</p>
          <p className="text-reg testimonial__organization">Peak Petroleum</p>
        </div>
        <img className="testimonial__quotes" src={doubleQoute} alt="quote" />
      </Testimonial>
      {/*  <Video /> */}
      {/* Pricing Section */}
      <section id="pricing">
        <Pricing />
      </section>
      <Testimonial>
        <h5 className="h5 testimonial__heading">
          Their Support team is always available and ready to help when we
          contact them. We enjoy working with them.
        </h5>
        <div className="testimonial__author-section">
          <p className="text-reg testimonial__author">Neemat Idera</p>

          <p className="text-reg testimonial__organization">Obat Oil</p>
        </div>
        <img className="testimonial__quotes" src={doubleQoute} alt="quote" />
      </Testimonial>
      <FAQ>
        <Accordion></Accordion>
      </FAQ>
      <Testimonial>
        <h5 className="h5 testimonial__heading">
          Gas Station Pro has streamlined our operations significantly. The
          platform is user-friendly, and the ability to manage multiple stations
          from one dashboard has been a game-changer for us.
        </h5>
        <div className="testimonial__author-section">
          <p className="text-reg testimonial__author">James Adewale</p>
          <p className="text-reg testimonial__organization">FuelMax Ventures</p>
        </div>
        <img className="testimonial__quotes" src={doubleQoute} alt="quote" />
      </Testimonial>

      <CTA />
      <FooterO />
    </Page>
  );
};

const NumberText = ({ num, text }) => {
  return (
    <div className="--mr">
      <h3 className="--color-white">{num}</h3>
      <p className="--color-white">{text}</p>
    </div>
  );
};

export default Home;
