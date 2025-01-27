import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./MyCases.css";
import { StoreContext } from "../context/StoreContext";
import { FaCheckCircle } from "react-icons/fa";
import GeneralLoader from "../../components/GeneralLoader/GeneralLoader";

const MyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { url } = useContext(StoreContext);

  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.id;
  const [isButtonVisible, setButtonVisible] = useState(true);


  const fetchCases = async () => {
    try {
      const response = await axios.get(`${url}/api/cases/${userId}/getusercase`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCases(response.data.cases);
    } catch (err) {
      setError("Error fetching cases.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCases();
    const buttonVisibility = localStorage.getItem("isButtonVisible");
    if (buttonVisibility === "false") {
      setButtonVisible(false);
    }
  }, []);

  // Show loader while loading
  if (loading) {
    return <GeneralLoader message="Fetching your donation history..." />;  // Adjust message for loading cases
  }
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-cases-container">
      <h1 className="page-title">My Cases</h1>
      <div className="title-underline"></div>
      
      <div className="cases-list">
        
        {cases.map((caseItem) => (
          <div className="mycase-card" key={caseItem._id}>
              <img src='/pin.png'alt="Pin Icon" className="pin-icon-created" />
      
           <div className="case-header">
          <div className="mycase-date">
            {new Date(caseItem.dateCreated).toLocaleDateString()}
          </div>
          <div className="case-titlee">{caseItem.title}
          {caseItem.status === "done" && (
          <FaCheckCircle className="done-icon animated-icon" aria-label="Done" />
        )}
              </div>
        </div>
        <ul className="case-itemss">
              {caseItem.itemsNeeded
                .filter((item) => !item.isDonated) 
                .map((item, index) => (
                  <li key={index} className="case-itemm">
                    {item.name} 
                  </li>
                ))}
            </ul>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCases;
