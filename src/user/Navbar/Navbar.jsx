import React, { useState, useEffect, useContext } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { useAuthStore } from '../../context/authStore';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000");

const Navbar = ({ setShowLogin, setSearchTerm }) => {
    const [menu, setMenu] = useState("menu");
    const { getTotalCartAmount, token, setToken, url } = useContext(StoreContext);
    const { user, logout, isAuthenticated,  } = useAuthStore(); 
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const [navbarBg, setNavbarBg] = useState("transparent");
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);  
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    
    // Update menu based on the current location
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setMenu("home");
        else if (path === '/items') setMenu("items");
        else if (path === '/cases') setMenu("cases");
        else if (path === '/contact-us') setMenu("contact-us");
    }, [location]);      
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };
    const fetchNotifications = async () => {
        try {
          const response = await axios.post(`${url}/api/notifications/get`, {}, 
          {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            setNotifications(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
       // Listen for notifications from the socket
       useEffect(() => {
        if (isAuthenticated && token) {
        }
      }, [isAuthenticated, token]);
      useEffect(() => {
        socket.on("notification", fetchNotifications);
      
        return () => {
          socket.off("notification", fetchNotifications); // Prevent duplicate listeners
        };
      }, [socket]);

    const handleLogout = () => {
        logout();
        setToken("");
        navigate("/");
    };
    
//     // Toggle Notifications Dropdown
//     const handleDropdownToggle = () => {
//     setShowDropdown(!showDropdown);
//     if (!showDropdown) {
//         markNotificationsAsViewed();
//     }
// };
const toggleNotificationsDropdown = (e) => {
    e.stopPropagation();
    setShowNotificationsDropdown((prev) => !prev);
    setShowProfileDropdown(false); // Ensure only one dropdown is open
    markNotificationsAsViewed();
  };
  
  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setShowProfileDropdown((prev) => !prev);
    setShowNotificationsDropdown(false); // Ensure only one dropdown is open
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      setShowNotificationsDropdown(false);
      setShowProfileDropdown(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth > 750) {
            setMenuOpen(false);
        }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);


    const markNotificationsAsViewed = async () => {
        await axios.post(`${url}/api/notifications/mark-as-viewed`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    const unreadCount = notifications.filter(n => !n.isViewed).length;

    return (
        <div className={`navbar-container ${scrolling ? 'scrolled' : ''}`}>
          <div className="navbar-left">
            <div className="navbar-brand">
              <img src="nl.png" alt="Logo" className="logo" />
              <h1 className="brand-name">Fillia</h1>
            </div>
          </div>
          {/* Hamburger Menu */}
          <div className="hamburger" onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          {/* Navbar Links */}
          <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
            <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
            <Link to='/items' onClick={() => setMenu("items")} className={menu === "items" ? "active" : ""}>items</Link>
            <Link to='/cases'>cases</Link>
            <a onClick={() => document.getElementById('footer').scrollIntoView({ behavior: 'smooth' })} className={menu === "contact-us" ? "active" : ""}>contact us</a>
          </ul>
    <div className="navbar-right">
        {!isAuthenticated ? (
            <button className="signin-btn" onClick={() => navigate("/login")}>Sign In</button>
        ) : (
                    <>
                       <div className="navbar-search-icon">
                    <Link to="/cart"><img src="/box (3).png" alt="Cart" /></Link>
                    <div className={getTotalCartAmount && getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                <div className="notification-icon-user" onClick={toggleNotificationsDropdown}>
                    <img src='./bell (2).png' alt="Notifications" className="navbar-icon-user" />
                    {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
                </div>
                        {showNotificationsDropdown && (
                        <div className="notification-dropdown">
                            {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification._id} className="notification-item">
                                <div className="notification-item-icon">🔔</div>
                                <div className="notification-item-message">{notification.message}</div>
                                <div className="notification-item-time">
                                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                </div>
                            ))
                            ) : (
                            <div className="notification-item">
                                <div className="notification-item-message">No notifications</div>
                            </div>
                            )}
                        </div>
                        )} 

                        <div className="navbar-profile" onClick={toggleProfileDropdown}>
                        <img
                            src={user.image ? `${url}/images/${user.image}` : assets.profile_icon2}
                            alt="Profile"
                            className="user-navbar-profile-img"
                        />
                        {showProfileDropdown && (
                            <ul className="nav-profile-dropdown">
                            <li onClick={() => navigate('/dashboard')}>
                                <img src="/dashboard2.png" alt="" />
                                <p>Dashboard</p>
                            </li>
                            <hr />
                            <li onClick={handleLogout}>
                                <img src="logout.png" alt="" />
                                <p>Logout</p>
                            </li>
                            </ul>
                        )}
                        </div>

                    </>
                )}
            </div>
       </div>
   );
};


export default Navbar;
