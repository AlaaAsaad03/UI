import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CreatedCases.css"; // Import CSS for styling
import { FaCheckCircle, FaPlusCircle, FaBox, FaTruck,} from "react-icons/fa"; // Import an icon for delivered cases
import { LuLoader } from "react-icons/lu";
import CreateCaseForm from "../CreateCaseForm/CreateCaseForm"; // Adjusted import path
import GeneralLoader from "../../components/GeneralLoader/GeneralLoader";
import {assets} from '../../assets/assets';


const CreatedCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // State to manage form visibility

  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1])); // Decodes the payload part of the JWT
  const userId = payload.id;

  useEffect(() => {
    const fetchCreatedCases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/cases/created/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("response", response.data); // Check the entire response

        if (response.data.cases && response.data.cases.length > 0) {
          setCases(response.data.cases);
        } else {
          console.warn("No cases found.");
        }
      } catch (error) {
        console.error("Error fetching created cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedCases();
  }, [userId, token]);

  const handleVerification = async (caseId) => {
    try {
      await axios.put(
        `http://localhost:4000/api/cases/${caseId}/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCases((prevCases) =>
        prevCases.map((c) =>
          c._id === caseId ? { ...c, userVerification: "Delivered" } : c
        )
      );
    } catch (error) {
      console.error("Error verifying case:", error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const statusLevels = {
    processing: {
      icon: <LuLoader style={{ color: 'orange' }}/> ,
      label: 'processing',
    },
    packing: {
      icon: <FaBox style={{ color: ' brown' }} />,
      label: 'packing',
    },
    outForDelivery: {
      icon: <FaTruck style={{ color: 'blue' }} />,
      label: 'out for Delivery',
    },
    delivered: {
      icon: <FaCheckCircle style={{ color: 'green' }} />,
      label: 'delivered',
    },
  };

  if (loading) {
    return <GeneralLoader message="Fetching your cases... Together, we're creating change." />;
  }

  return (
    <div className="created-cases-container">
    <h1 className="page-title">Manage Your Cases</h1> 
    <div className="title-underline"></div>
    
      <div className="cases-list">
        {cases.map((caseItem) => (
          <div key={caseItem._id} className="case-cardd">        <img src={assets.pin} alt="Pin Icon" className="pin-icon-created" />
        <div className="case-header">
          <div className="case-date">
            {new Date(caseItem.dateCreated).toLocaleDateString()}
          </div>
          <div className="case-status-top">
          <div className="case-status">
            {caseItem.level === "delivered" ? (
              <FaCheckCircle 
                color="green" 
                style={{ cursor: 'pointer' }} 
                onClick={() => handleVerification(caseItem._id)} 
              />
            ) : (
              statusLevels[caseItem.level]?.icon
            )}
          </div>
          </div>
          <div className="case-titlee">{caseItem.title}</div>
        </div>
        <ul className="case-itemss">
  {caseItem.itemsNeeded.length > 0 ? (
    caseItem.itemsNeeded.map((item) => (
      <li key={item.id || item._id} className="case-itemm">
        {item.name}
      </li>
    ))
  ) : (
    <li>No items needed.</li>
  )}
</ul>
      </div>
      
        ))}
      </div>
      <button className="add-case-button" onClick={toggleForm}>
        <FaPlusCircle /> Add Case
      </button>
      {showForm && (
        <div className="popup-overlay">
          <div className="popup">
            <CreateCaseForm onClose={toggleForm} />
            <button className="close-buttonn" onClick={toggleForm}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedCases;
