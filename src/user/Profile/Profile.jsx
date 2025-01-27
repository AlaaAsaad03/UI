import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaTrashAlt, FaUpload } from "react-icons/fa";
import axios from "axios";
import "./Profile.css";
import { assets } from "../../assets/assets";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.id;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/profile/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        const user = response.data.user;
        setName(user.name);
        setEmail(user.email);
        if (user.image) {
          setProfileImage(`http://localhost:4000/images/${user.image}`);
        } else {
          setProfileImage(assets.profile_icon2);
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to fetch profile data.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", name);
    formData.append("email", email);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await axios.post("http://localhost:4000/api/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        alert("Profile updated successfully!");
        fetchProfile();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete("http://localhost:4000/api/profile/remove", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        alert("Account deleted successfully.");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account.");
    }
  };

  return (
    <div className="user-profile-container">
      <h1 className="user-profile-page-title">Manage Your Profile</h1>
      <div className="user-profile-title-underline"></div>
      <div className="user-profile-header">
        <div className="user-profile-image-section">
          <img src={profileImage} alt="Profile" className="user-profile-image" />
          <div className="user-profile-image-buttons">
            <button className="user-profile-upload-button">
            <label className="user-profile-upload-button">
              <FaUpload className="user-profile-iconn" /> Upload
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
            </button>
            <button className="user-profile-remove-button" onClick={() => setImageFile(null)}>
              <FaTrashAlt className="user-profile-iconn" /> Remove
            </button>
          </div>
        </div>
        <div className="user-profile-details-section">
          <div className="user-profile-detail-row">
            <FaUser className="user-profile-icon" />
            <input
              type="text"
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="user-profile-input"
            />
          </div>
          <div className="user-profile-detail-row">
            <FaEnvelope className="user-profile-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="user-profile-input"
            />
          </div>
        </div>
      </div>
      <div className="user-profile-action-buttons">
        <button className="user-profile-button user-profile-save-changes" onClick={handleUpdateProfile}>
          Save Changes
        </button>
        <button className="user-profile-button user-profile-delete-account" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;