import React, { useContext, useEffect, useState } from 'react';
import './Cases.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import CasesHeader from '../CasesHeader/CasesHeader';
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { useAuthStore } from '../../context/authStore';
import GeneralLoader from '../../components/GeneralLoader/GeneralLoader';


const Cases = () => {
  const [recommendedCases, setRecommendedCases] = useState([]);
  const [otherCases, setOtherCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); 
  const { url, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('newest');
  const token = localStorage.getItem("token");
  let userId = null; // Default to null if the token doesn't exist

if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userId = payload.id;
  } catch (error) {
    console.error("Invalid token format:", error);
  }
}
  const {isAuthenticated} = useContext(StoreContext);

  
  useEffect(() => {
    fetchCases();
  }, [selectedCase]);

  const fetchCases = async () => {
    setIsLoading(true); // Show loader
    try {
      const response = await axios.get(`${url}/api/cases/getcase`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.data) {
        setRecommendedCases(response.data.recommendedCases || []);
        setOtherCases(response.data.otherCases || []);
      } else {
        setRecommendedCases([]);
        setOtherCases([]);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      setRecommendedCases([]);
      setOtherCases([]);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const handleTakeCase = async (caseId) => {
      if (!isAuthenticated) {
        toast.warning("You need to log in to take a case.", {
          position: toast.POSITION.TOP_CENTER,
        });
        setTimeout(() => {
          navigate(`/login?redirect=${window.location.pathname}`);
        }, 1500); // Redirect after the toast duration
      }

    if (!caseId || selectedCase) {
      toast.warning("You cannot take more than one case at a time or the case is unavailable.", {
        position: toast.POSITION.TOP_CENTER,
      });      return;
    }

    try {
      setIsLoading(true); 
      const response = await axios.patch(
        `${url}/api/cases/${caseId}/take`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        toast.success("Case successfully taken!", {
          position: toast.POSITION.TOP_CENTER,
        });
        setSelectedCase(caseId);
        setOtherCases((prevCases) =>
          prevCases.map((c) =>
            c._id === caseId ? { ...c, availability: 'not available' } : c
          )
        );
        setTimeout(() => navigate("/my-cases"), 1500);
      }
    } catch (error) {
      console.error('Error taking case:', error);
      toast.error(error.response?.data?.message || "Could not take the case. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }finally {
      setIsLoading(false); // Hide loader after action
    }
  };


  const handleDonateItem = async (caseId, itemId) => {
    try {
      if (!userId) {
        alert("User ID is missing. Please log in.");
        return;
      }
      const confirmDonation = window.confirm("Confirm donation of this item?");
      if (!confirmDonation) {
        return;
      }
      const response = await axios.post(
        `${url}/api/cases/donate-item`,
        { userId, caseId, itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Item added to your cart! Redirecting...');
        await addToCart(itemId);
        navigate('/cart');
        fetchCases();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error donating item:", error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedCases = [...otherCases].sort((a, b) => {
      const dateA = new Date(a.dateCreated);
      const dateB = new Date(b.dateCreated);
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
    setOtherCases(sortedCases);
  };

  const filteredRecommendedCases = recommendedCases.filter((caseItem) =>
    caseItem.title && caseItem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOtherCases = otherCases.filter((caseItem) =>
    caseItem.title && caseItem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showInterestOverlay, setShowInterestOverlay] = useState(false);
  const [markedNotInterested, setMarkedNotInterested] = useState([]);

  const handleInterested = () => {
    setShowInterestOverlay(false);
  };

  const handleNotInterested = async () => {
    const caseIds = recommendedCases.map((caseItem) => caseItem._id);
    try {
      const response = await axios.post(
        `${url}/api/recommendations/mark-not-interested`,
        { userId, caseIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Marked as not interested successfully.");
        setMarkedNotInterested(caseIds);
      }
    } catch (error) {
      console.error("Error marking cases as not interested:", error);
      alert("Failed to mark cases as not interested.");
    } finally {
      setShowInterestOverlay(false);
    }
  };

  useEffect(() => {
    if (recommendedCases.length > 0 && !markedNotInterested.length) {
      setShowInterestOverlay(true);
    } else {
      setShowInterestOverlay(false);
    }
  }, [recommendedCases, markedNotInterested]);


  
  if (!token) {
    return (
      <div className="creative-overlay-container ">
        <div className="creative-overlay ">
          <div className="creative-overlay-content">
            <img
              src="./login.png"
              alt="Lock Icon"
              className="creative-overlay-icon"
            />
            <h2>Hold On!</h2>
            <p>
              You need to log in to access this page and explore amazing cases. 
            </p>
            <button
              className="creative-overlay-button"
              onClick={() => navigate(`/login?redirect=/cases`)}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }
  return isLoading ? (
    <GeneralLoader message="Fetching cases... Please hold on while we prepare opportunities to make a difference." />
  ) :(
    <div className="cases-page-container">
      <div className="cases-hero-section">
        <CasesHeader />
      </div>

      <div className="cases-header-bar">
        <div className="cases-header-left"></div>
        <div className="cases-header-middle">
          <input
            type="text"
            className="cases-search-input"
            placeholder="Search cases by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search cases"
          />
        </div>
        <div className="cases-header-right">
          <div className="cases-filter-mosaic">
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
      </div>

      <div className="cases-recommendation-section">
        <h2 className="cases-page-title">Recommended Selections</h2>

        {showInterestOverlay && (
          <div className="cases-interest-overlay">
            <div className="cases-overlay-content">
              <h3>Are you interested in these recommendations?</h3>
              <button className="cases-interested-btn" onClick={handleInterested}>
                Interested
              </button>
              <button className="cases-not-interested-btn" onClick={handleNotInterested}>
                Not Interested
              </button>
            </div>
          </div>
        )}

        <div className="cases-container">
          {filteredRecommendedCases.length > 0 ? (
            filteredRecommendedCases
              .filter((caseItem) => !markedNotInterested.includes(caseItem._id))
              .map((caseItem) => (
                <div
                  key={caseItem._id}
                  className={`cases-card ${caseItem.availability === "not available" ? "cases-unavailable" : ""}`}
                  style={{ opacity: caseItem.isApplicable ? 1 : 0.6 }}
                >
                  <img src="./pin.png" alt="Pin Icon" className="cases-pin-icon" />
                  <div className="cases-card-header">
                    <div className="cases-card-date">
                      {new Date(caseItem.dateCreated).toLocaleDateString()}
                    </div>
                    <div className="cases-card-title">{caseItem.title}</div>
                    <img src="./line.png" alt="" className="cases-line-under-title" />
                  </div>
                  <ul className="cases-card-items">
                    {caseItem.itemsNeeded.map((item) => (
                      <li
                        key={item.id}
                        className={`cases-card-item ${item.isDonated ? 'cases-item-donated' : ''}`}
                        onClick={() => !item.isDonated && handleDonateItem(caseItem._id, item.id)}
                      >
                        {item.name} {item.isDonated && <span className='cases-item-donated-label'>(&#10003;)</span>}
                      </li>
                    ))}
                  </ul>
                  {caseItem.isApplicable && caseItem.availability === "available" && !selectedCase && (
                    <button className="cases-take-btn" onClick={() => handleTakeCase(caseItem._id)}>
                      Take This Case
                    </button>
                  )}
                </div>
              ))
          ) : (
            <div className="cases-no-cases-message">No recommended cases available.</div>
          )}
        </div>
      </div>

      <h2 className='cases-page-title'>Explore Additional Opportunities</h2>
      <div className="cases-container">
        {filteredOtherCases.length > 0 ? (
          filteredOtherCases.map((caseItem) => (
            <div key={caseItem._id} className={`cases-card ${caseItem.availability === 'not available' ? 'cases-unavailable' : ''}`}  
            style={{ opacity: caseItem.isApplicable ? 1 : 0.6 }}
            >
              <img src='./pin.png' alt="Pin Icon" className="cases-pin-icon" />
              <div className="cases-card-header">
                <div className="cases-card-date">
                  {new Date(caseItem.dateCreated).toLocaleDateString()}
                </div>
                <div className="cases-card-title">{caseItem.title}</div>
                <img src="./line.png" alt="" className='cases-line-under-title' />
              </div>
              <ul className="cases-card-items">
                {caseItem.itemsNeeded.map((item) => (
                  <li
                    key={item.id}
                    className={`cases-card-item ${item.isDonated ? 'cases-item-donated' : ''}`}
                    onClick={() => !item.isDonated && handleDonateItem(caseItem._id, item.id)}
                  >
                    {item.name} {item.isDonated && <span className='cases-item-donated-label'>(Donated)</span>}
                  </li>
                ))}
              </ul>
              {caseItem.isApplicable && caseItem.availability === 'available' && !selectedCase && (
                <button className="cases-take-btn" onClick={() => handleTakeCase(caseItem._id)}>
                  Take This Case
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="cases-no-cases-message">No other cases available at the moment.</div>
        )}
      </div>

    </div>
  );
};

export default Cases;