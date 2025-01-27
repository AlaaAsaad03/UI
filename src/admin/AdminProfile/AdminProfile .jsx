import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope , FaKey, FaUpload } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

import axios from "axios";
import "./AdminProfile.css";

const AdminProfile = () => {
        const [profileImage, setProfileImage] = useState(null);
        const [imageFile, setImageFile] = useState(null); // To store the uploaded image file
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [role, setRole] = useState("");
        const [loading, setLoading] = useState(false);
        const [notification, setNotification] = useState('');
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        let adminId = null; // Declare adminId here
        let adminRole = "";

  if (token) {
          const payload = JSON.parse(atob(token.split(".")[1])); // Decodes the payload part of the JWT
          adminId = payload.id; // Now this will be available throughout the component
          adminRole = payload.role;
          console.log("adminId", adminId);
          console.log("adminRole", adminRole);
        }

        const fetchProfile = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/api/admin/details`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Response:', response.data);
            // Ensure response.data has the expected structure
            if (response.data && response.data.admin) {
              const { name, email, role, image } = response.data.admin;
              setName(name);
              setEmail(email);
              setRole(role);
              setProfileImage(image);
            } else {
              console.error('Unexpected response structure:', response.data);
            }
            
          } catch (error) {
            console.error('Error fetching admin details:', error);
          }
        };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setProfileImage(URL.createObjectURL(file)); // Preview image
        setImageFile(file); // Save file for upload
        }
      };

      const handleRemoveImage = async () => {
        try {
          const response = await axios.delete("http://localhost:4000/api/admin/remove-image", {
            headers: { Authorization: `Bearer ${token}` },
            data: { adminId }, // Pass the adminId in the body
          });
      
          if (response.data.success) {
            setProfileImage(null); // Clear image preview
            alert("Image removed successfully.");
          } else {
            alert(response.data.message || "Failed to remove image.");
          }
        } catch (error) {
          console.error("Error removing image:", error);
          alert("An error occurred while removing the image.");
        }
      };
      
      

    const handleUpdateProfile = async () => {
        const formData = new FormData();
        formData.append("adminId", adminId);
        formData.append("name", name);
        formData.append("email", email);
        if (imageFile) formData.append("image", imageFile);

        try {
        const response = await axios.put(`http://localhost:4000/api/admin/update?adminId=${adminId}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
            },
        });
        if (response.data.success) {
            alert("Profile updated successfully!");
            fetchProfile(); // Refresh profile data
          } else {
            alert(response.data.message);
        }} catch (error) {
        console.error('Error updating profile', error);
        alert('Failed to update profile.');
        }
    };

    useEffect(() => {
      if (token) {
          fetchProfile();
      }
  }, [token]);
  return (
    <div className="admin-profile-page">
        <h1 className="admin-page-title">
            Manage Your Profile
        </h1>
        <div className="admin-title-underline"></div>

        <div className="admin-profile">
            <div className="profile-header">
            <img
              src={profileImage || "./prfl.png"} alt="Admin"
              className="profile-image" />
                <p className="role">{role || "Role not set"}</p>
                <div className="upload-buttons">
                <label >
                <FaUpload className="icon2" />
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
              <button type="button" onClick={handleRemoveImage}>
              <FaTrash className="icon3" />
            </button>
            </div>
            </div>
            <div className="update-form" >

            <input
                type="text"
                placeholder="User Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profile-input"
              />
             <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="profile-input"
              />
                <button className="submit-btn-prf" type="submit" onClick={handleUpdateProfile}>Save Changes</button>
            </div>
        </div>
    </div>
);
}
  

export default AdminProfile;