import React, { useState } from 'react'
import { useAuthStore } from '../../context/authStore'; // Adjust the path as necessary

import './Home.css'

const AdminHome = ({ searchTerm }) => {

  const [showLogin, setShowLogin] = useState(false);
  const { admin } = useAuthStore(); // Access the admin object

  const handleCloseLoginPopup = () => {
    setShowLogin(false);
  };

  return (
    <div className="home-creative-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="welcome-content">
          <h1 className="hero-title">Welcome Back, {admin ? admin.name : 'Admin'}!</h1>
          <p className="hero-subtitle">
            Ready to manage your dashboard? Let’s make a difference today!
          </p>
          <div className="cta-buttons">
            <button className="primary-btn">View Dashboard</button>
            <button className="secondary-btn" onClick={() => setShowLogin(true)}>
              Manage Profile
            </button>
          </div>
        </div>
        {/* 3D Illustration */}
        <div className="hero-illustration">
          <img
            src="./hero.png" // Replace with actual image path
            alt="Spline 3D Illustration"
            className="animated-spline"
          />
        </div>
      </div>

      {/* Optional Login Popup */}
      {showLogin && <LoginPopup onClose={handleCloseLoginPopup} />}
    </div>
  );
};


export default AdminHome