import React, { useState } from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import UserFeedback from "../UserFeedback/UserFeedback";
import { FaHome, FaInfoCircle, FaDonate, FaEnvelope, FaPhone, FaLocationArrow, FaSearchLocation } from 'react-icons/fa';  // Importing icons from react-icons

const Footer = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setMessage("Thank you for your feedback!");
    setFeedback("");
  };

  return (
    <footer className="footer" id="footer">
      {/* Section 1: About */}
      <div className="footer-section">
        <img src='./NewLogo.png'alt="Logo" style={{ width: "250px", height:"350" }} />
        <p>
          Join us in helping rebuild Lebanon. Your donation, customized by you, 
          will bring hope and relief to families in need. Choose the items that 
          make a difference, and we'll deliver them directly to those who need it most.
        </p>
        <div className="footer-social-icons">
          <img src={assets.facebook_icon} alt="Facebook" />
          <img src={assets.twitter_icon} alt="Twitter" />
          <img src={assets.linkedin_icon} alt="LinkedIn" />
        </div>
      </div>

      {/* Section 2: Quick Links */}
      <div className="footer-section">
        <h2>Quick Links</h2>
        <ul>
          <li><FaHome /> Home</li>
          <li><FaInfoCircle /> About Us</li>
          <li><FaDonate /> Donate</li>
          <li><FaEnvelope /> Contact</li>
        </ul>
      </div>

      {/* Section 3: Contact */}
      <div className="footer-section">
        <h2>Contact</h2>
        <ul>
          <li><FaPhone /> +961-123-4567</li>
          <li><FaEnvelope /> support@charitylebanon.com</li>
          <li><FaSearchLocation/> Beirut, Lebanon</li>
        </ul>
      </div>

      {/* Section 4: Feedback */}
      <div className="footer-section">
        <UserFeedback />
      </div>
      <hr />
      <div className="footer-bottom">
        &copy; 2024 CharityLebanon. All Rights Reserved.
      </div>
      <hr />
    </footer>
  );
};

export default Footer;