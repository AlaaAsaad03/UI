import { useEffect, useState } from 'react';
import axios from 'axios';
import GeneralLoader from '../../components/GeneralLoader/GeneralLoader';
import './Feedbacks.css';
import { assets } from '../../assets/assets';

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let adminRole = "";
  const token = localStorage.getItem("token");
  
  if(token){
  const payload = JSON.parse(atob(token.split(".")[1])); // Decodes the payload part of the JWT
  const adminId = payload.id;
   adminRole = payload.role;
  console.log("adminId", adminId)
  console.log("adminRole", adminRole)
}

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/feedback/all');
                setFeedbacks(res.data.feedbacks);
            } catch (err) {
                setError('Error fetching feedbacks');
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (order) => {
        setSortOrder(order);
        const sortedFeedbacks = [...feedbacks].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return order === 'newest' ? dateB - dateA : dateA - dateB;
        });
        setFeedbacks(sortedFeedbacks);
    };

    const filteredFeedbacks = feedbacks.filter((fb) =>
        fb.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fb.feedback.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/feedback/delete/${id}`);
            setFeedbacks(feedbacks.filter((fb) => fb._id !== id));
        } catch (error) {
            console.error('Error deleting feedback');
        }
    };
    const isAuthorized = adminRole === "Leader";

    if (loading && isAuthorized) return <p>Loading feedbacks...</p>;
    if (error) return <p>{error}</p>;


    return (
        <div className={`admin-section ${!isAuthorized ? "blurred" : ""}`}>
            {!isAuthorized && (
        <div className="lock-overlay">
          <i className="lock-icon">🔒</i>
          <p>Access Restricted</p>
        </div>
      )}
 {loading ? (
        <GeneralLoader message="Fetching Users Feedbacks, hold on tight..." /> // Show loader while fetching
          ) : (
      isAuthorized && (
             <>
            <h1 className="admin-page-title">Feedback Management</h1> 
            <div className="admin-title-underline"></div>
            <div className="header-bar">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="🔍 Search feedback by user or content..."
                    value={searchTerm}
                    onChange={handleSearch}
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
            <div className="feedback-list">
                {filteredFeedbacks.map((fb) => (
                    <div key={fb._id} className="feedback-cardd">
                        <div className="feedback-header">
                            <img
                                src={`http://localhost:4000/images/${fb.userId.image}` || assets.user3}
                                alt="User avatar"
                                className="feedback-avatar"
                            />
                            <p className="feedback-user">{fb.userId.name}</p>
                        </div>
                        <p className="feedback-text">{fb.feedback}</p>
                        <p className="feedback-timestamp">
                            Posted on: {new Date(fb.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                        <button
                            className="delete-button"
                            onClick={() => handleDelete(fb._id)}
                        >
                            🗑️ Delete
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

export default Feedbacks;