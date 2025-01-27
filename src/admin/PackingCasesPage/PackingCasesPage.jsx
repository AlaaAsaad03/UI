import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PackingCasesPage.css";
import { IoIosArrowRoundForward } from "react-icons/io";
import GeneralLoader from "../../components/GeneralLoader/GeneralLoader";

const PackingCasesPage = ({ role }) => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(false);

  let adminRole = "";
  const token = localStorage.getItem("token");
  
  if(token){
  const payload = JSON.parse(atob(token.split(".")[1])); // Decodes the payload part of the JWT
  const adminId = payload.id;
   adminRole = payload.role;
  console.log("adminId", adminId)
  console.log("adminRole", adminRole)}

  const fetchPackingCases = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/cases/packing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCases(response.data.cases);
      console.log("aa", cases.orderItems);
      
    } catch (error) {
      console.error("Error fetching packing cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (caseId) => {
    try {
      await axios.patch(`http://localhost:4000/api/cases/${caseId}/update-level`, { level: "out for delivery" }, {
        headers: { Authorization: `Bearer ${token}` },

      });
      fetchPackingCases();
    } catch (error) {
      console.error("Error updating case level:", error);
    }
  };

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedCases = [...cases].sort((a, b) => {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setCases(sortedCases); // Ensure this line is present
    console.log('Sorted cases:', sortedCases);
};

  const filteredCases = cases.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    fetchPackingCases();
  }, []);

  const isAuthorized = adminRole === "Leader" || adminRole === "Packager";

  return (
    <div className={`packing-cases-page ${!isAuthorized ? "blurred" : ""}`}>
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
           <h1 className="admin-page-title">Cases for Package</h1> 
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
            <div className="cards-container-packaging">
        {cases.map((c) => (
          <div key={c._id} className="case-card-packaging">
            {/* Header */}
            <div className="card-header-packaging">
              <h3 className="card-title-packaging">{c.title}</h3>
              <div className="barcode"></div>
            </div>
            <div className="card-content-packaging">
              {c.orderItems.map((item, index) => (
                <div key={index} className="card-item-packaging">
                  <IoIosArrowRoundForward className="card-item-icon-packaging" />
                  {item.name}
                </div>
              ))}
            </div>
        {/* Footer */}
        <div className="card-footer-packaging">
          <button
            className="footer-btn-packaging"
            onClick={() => handleCheckboxChange(c._id)}
          >
            Out for Delivery
          </button>
        </div>
      </div>
    ))}
  </div>
        </>
      )
      )}
    </div>
  );
};

export default PackingCasesPage;