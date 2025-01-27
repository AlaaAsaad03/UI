import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeliveryCasesPage.css";
import GeneralLoader from "../../components/GeneralLoader/GeneralLoader";


const DeliveryCasesPage = ({ role }) => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };


  let adminRole = "";
  const token = localStorage.getItem("token");
  
    if(token){
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodes the payload part of the JWT
    const adminId = payload.id;
    adminRole = payload.role;
    console.log("adminId", adminId)
    console.log("adminRole", adminRole)}

  const fetchDeliveryCases = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/cases/delivery", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCases(response.data.cases);
    } catch (error) {
      console.error("Error fetching delivery cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryCases();
  }, []);

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedCases = [...cases].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });
    setCases(sortedCases);
  };

  const filteredCases = cases.filter((caseItem) =>
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCheckboxChange = async (caseId) => {
    try {
      await axios.patch(`http://localhost:4000/api/cases/${caseId}/update-level`, { level: "delivered" }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDeliveryCases();
    } catch (error) {
      console.error("Error updating case level:", error);
    }
  };

  const isAuthorized = adminRole === "Leader" || adminRole === "Delivery";

  return (
    <div className={`delivery-cases-page ${!isAuthorized ? "blurred" : ""}`}>
    {!isAuthorized && (
      <div className="lock-overlay">
        <i className="lock-icon">🔒</i>
        <p>Access Restricted</p>
      </div>
    )}

  {loading ? (
            <GeneralLoader message="Fetching Donations, hold on tight..." /> // Show loader while fetching
          ) : ( isAuthorized && (
        <>
      <h1 className="admin-page-title">Delivery Cases</h1>
      <div className="admin-title-underline"></div>
      <div className="header-bar">
                <input
                    type= "text"
                    className="search-bar"
                    placeholder="🔍 Search packages by user or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search feedback"
                />
                <div className="filter-mosaic">
                    <div 
                        className={`mosaic-tile ${sortOrder === 'newest' ? 'active' : ''}`} 
                        onClick={() => handleSort('newest')}
                    >
                        Newest
                    </div>
                    <div 
                        className={`mosaic-tile ${sortOrder === 'oldest' ? 'active' : ''}`} 
                        onClick={() => handleSort('oldest')}
                    >
                        Oldest
                    </div>
                </div>
            </div>
      <div className="delivery-cards">
        {filteredCases.map((c) => (
        <div  key={c._id} className={`delivery-card ${isExpanded ? "expanded" : ""}`}>

            <div className="delivery-card-header">
              <h3 className="delivery-card-title">{c.title}</h3>
              <div className="delivery-card-icon">📦</div>
            </div>
            <p className="delivery-location">
              <strong>Phone Number: </strong> 
              {c.phoneNumber}
            </p>
            <p className="delivery-location">
              <strong>Location: </strong> 
              {c.location.address}phoneNumber
            </p>
            <button className="delivery-btn" onClick={() => handleCheckboxChange(c._id)}>
              Mark as Delivered
            </button>
          
          </div>
        ))}
      </div>
      </>
          )
      )}
    </div>
  );
};

export default DeliveryCasesPage;