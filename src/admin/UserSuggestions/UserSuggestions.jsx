import { useEffect, useState } from 'react'; 
import axios from 'axios';
import Modal from 'react-modal';
import GeneralLoader from '../../components/GeneralLoader/GeneralLoader';
import './UserSuggestions.css';
Modal.setAppElement('#root'); // This is essential

const UserSuggestions = ({url}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    
    const [modalData, setModalData] = useState(null);
    let adminId = null;
    let adminRole = "";
   const token = localStorage.getItem("token");

if (token){
  const payload = JSON.parse(atob(token.split(".")[1])); // Decodes the payload part of the JWT
  const adminId = payload.id;
   adminRole = payload.role;
  console.log("adminId", adminId)
  console.log("adminRole", adminRole)
}

const fetchSuggestions = async () => {
    setLoading(true);
    try {
        const res = await axios.get('http://localhost:4000/api/suggestion/list', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const pendingSuggestions = res.data.data.filter(s => s.status === 'pending'); // Filter only pending ones
        setSuggestions(pendingSuggestions);
    } catch (err) {
        setError('Error fetching suggestions');
    } finally {
        setLoading(false);
    }
}

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const handleSearch = (e) => setSearchTerm(e.target.value);


    const filteredSuggestions = suggestions.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.price.toString().includes(searchTerm.toLowerCase())
    );

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.patch('http://localhost:4000/api/suggestion/update', 
                { suggestionId: id, status }, 
                { headers: { Authorization: `Bearer ${token}` } } // Add headers here
            );
            setSuggestions((prev) => prev.filter((s) => s._id !== id)); // Remove from list
        } catch (err) {
            console.error('Error updating suggestion status');
        }
    };

    const openModal = (data) => setModalData(data);
    const closeModal = () => setModalData(null);

    if (loading) return <p>Loading suggestions...</p>;
    if (error) return <p>{error}</p>;

    const isAuthorized = adminRole === "Leader";


    return (
        <div className={`suggestions-page ${!isAuthorized ? "blurred" : ""}`}>
            {!isAuthorized && (
                <div className="lock-overlay">
                    <i className="lock-icon">🔒</i>
                    <p>Access Restricted</p>
                </div>
            )}
           {loading ? (
            <GeneralLoader message="Fetching Users Suggestions, hold on tight..." /> // Show loader while fetching
          ) : (
      isAuthorized && (
                <>
                    <h1 className="admin-page-title">Suggestion Management</h1>
                    <div className="admin-title-underline"></div>
                    <div className="header-bar">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="🔍 Search suggestions by name or price..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="suggestion-list">
                        {filteredSuggestions.map((s) => (
                            <div key={s._id} className="suggestion-card">
                                <img
                                    src='/new.png'
                                    alt="Suggestion"
                                    className="suggestion-image"
                                    onClick={() => openModal(s)}
                                />
                                <h3>{s.name}</h3>
                                <p>Price: ${s.price}</p>
                                <div className="suggestion-actions">
                                    <img
                                        src='/check (1).png' // Path to your green tick icon
                                        alt="Accept"
                                        className="icon"
                                        onClick={() => handleStatusUpdate(s._id, 'accepted')}
                                    />
                                    <img
                                        src='/recycle-bin.png' // Path to your red trash icon
                                        alt="Reject"
                                        className="icon"
                                        onClick={() => handleStatusUpdate(s._id, 'rejected')}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
      )
            )}
        <Modal
    isOpen={!!modalData}
    onRequestClose={closeModal}
    contentLabel="Suggestion Details"
    className="custom-modall"
    ClassName="custom-overlayy"
>
    {modalData && (
        <>
            <div className="modal-header">
                <h3>{modalData.name}</h3>
                <button onClick={closeModal} className="close-button">✖</button>
            </div>
            <img
                src={`${url}/images/` + modalData.image}
                alt="Suggestion"
                className="modal-image"
            />
            <p className="modal-description">Description: {modalData.description}</p>
            <div className="modal-footer">
                <button
                    className="confirm-button"
                    onClick={() => handleStatusUpdate(modalData._id, 'accepted')}
                >
                    Accept
                </button>
                <button className="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
        </>
    )}
</Modal>

        </div>
    );
};

export default UserSuggestions;