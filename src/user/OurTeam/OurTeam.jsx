import React, { useState, useEffect } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./OurTeam.css";
import axios from "axios";

const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // Include auth token
          }
        });
        const result = response.data; // Access data directly

        if (result.success) {
          setTeamMembers(result.data);
        } else {
          console.error("Failed to fetch admin data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="team-section">
      <div className="title">
        <p>Meet Us</p>
        <h2>Where Impact Begins</h2>
      </div>

      <div className="team-content-container">
        {/* Circle Layout */}
        <div className="team-circle-layout">
          {teamMembers.map((member, index) => {
            const angle = (360 / teamMembers.length) * index;
            const x = Math.cos((angle * Math.PI) / 180) * 200; // Circle radius
            const y = Math.sin((angle * Math.PI) / 180) * 200;

            return (
              <div
                key={index}
                className={`circle-photo ${
                  selectedMember?.name === member.name ? "active" : ""
                }`}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                onClick={() => setSelectedMember(member)}
              >
                <img
                  src={member.photo || "/default-user.png"} // Fallback image
                  alt={member.name}
                  className="team-photo"
                />
              </div>
            );
          })}

          {/* Center Info */}
          <div className={`center-info ${selectedMember ? "fade-in" : ""}`} key={selectedMember?.name || "default"}>
            {selectedMember ? (
              <>
                <div className="selected-photo-wrapper">
                  <img
                    src={selectedMember.photo || "/default-user.png"}
                    alt={selectedMember.name}
                    className="selected-photo"
                  />
                </div>
                <h3>{selectedMember.name}</h3>
                <p>{selectedMember.role}</p>
                {/* Placeholder for social links */}
                <div className="social-links">
                  <a href="#"><FaFacebook /></a>
                  <a href="#"><FaTwitter /></a>
                  <a href="#"><FaLinkedin /></a>
                  <a href="#"><FaInstagram /></a>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Right-Side Text */}
        <div className="creative-text-large">
          <h1>Discover the amazing people making it happen!</h1>
          <p>Click on any team member to learn about their role and connect through social media.</p>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
