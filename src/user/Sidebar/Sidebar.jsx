import React from "react";
import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebarr">
      {/* Replace the Dashboard title with a circular logo and Fillia word */}
      <div className="sidebarr-logo">
        <img src="/loge.png" alt="Fillia Logo" className="logo-image" />
        <h2 className="logo-text">Fillia</h2>
      </div>
      <div className="sidebarr-options">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active sidebarr-option" : "sidebarr-option"
          }
          aria-label="Home"
        >
          <img src="/house.png" alt="Home Icon" />
          <p>Home</p>
        </NavLink>
        <NavLink
          to="/dashboard/analysis"
          className={({ isActive }) =>
            isActive ? "active sidebarr-option" : "sidebarr-option"
          }
          aria-label="Analysis"
        >
          <img src="/analysis.png" alt="Analysis Icon" />
          <p>Analysis</p>
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            isActive ? "active sidebarr-option" : "sidebarr-option"
          }
          aria-label="Profile"
        >
          <img src="/user.png" alt="Profile Icon" />
          <p>Profile</p>
        </NavLink>

        <NavLink
          to="/dashboard/mycases"
          className={({ isActive }) =>
            isActive ? "active sidebarr-option" : "sidebarr-option"
          }
          aria-label="Cases"
        >
          <img src="/cases.png" alt="Cases Icon" />
          <p>Case</p>
        </NavLink>
        <NavLink
          to="/dashboard/createdcases"
          className={({ isActive }) =>
            isActive ? "active sidebarr-option" : "sidebarr-option"
          }
          aria-label="Created Cases"
        >
          <img src="/created.png" alt="Created Cases Icon" />
          <p>Created</p>
        </NavLink>

        <NavLink
          to="/dashboard/my-items"
          className={({ isActive }) =>
            isActive ? "active sidebarr-option" : "sidebarr-option"
          }
          aria-label="Add Item"
        >
          <img src="/playlist.png" alt="Add Item Icon" />
          <p>Add Your Item</p>
        </NavLink>
        <NavLink
          to="/dashboard/chat"
          className={({ isActive }) =>
            isActive ? "active sidebarr-option" : "sidebarr-option"
          }
          aria-label="Chats"
        >
          <img src="/chat.png" alt="Chats Icon" />
          <p>Chats</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
