import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className='sidebar'>
      <h2 className="sidebar-title">Dashboard</h2>
      <div className="sidebar-options">
        <NavLink to='/admin/add' className="sidebar-option" aria-label="Content Management">
          <img src={assets.contentWriting} alt="Content Management Icon" />
          <p>Content Management</p>
        </NavLink>

        <NavLink to='/admin/staff' className="sidebar-option" aria-label="List Staff">
          <img src='./staff-management.png' alt="Staff Icon" />
          <p>Staff Management</p>
        </NavLink>
       
        <NavLink to='/admin/list' className="sidebar-option" aria-label="List Items">
          <img src={assets.list} alt="List Icon" />
          <p>List Items</p>
        </NavLink>
        <NavLink to='/admin/orders' className="sidebar-option" aria-label="Donations">
          <img src={assets.orders} alt="Orders Icon" />
          <p>Donations</p>
        </NavLink>
        <NavLink to='/admin/cases' className="sidebar-option" aria-label="Cases">
          <img src={assets.cases} alt="Cases Icon" />
          <p>Cases</p>
        </NavLink>
        <NavLink to='/admin/packing' className="sidebar-option" aria-label="packing">
          <img src='./deliveryman.png' alt="Cases Icon" />
          <p>Packing</p>
        </NavLink>
        <NavLink to='/admin/delivery' className="sidebar-option" aria-label="delivery">
          <img src='/receiver.png' alt="Cases Icon" />
          <p>Delivery</p>
        </NavLink>
        <NavLink to='/admin/chat' className="sidebar-option" aria-label="Chat">
          <img src='./chating.png' alt="Chat Icon" />
          <p>Chat</p>
        </NavLink>
        <NavLink to='/admin/feedbacks' className="sidebar-option" aria-label="Feedbacks">
          <img src={assets.feedback} alt="Feedback Icon" />
          <p>Feedbacks</p>
        </NavLink>
        <NavLink to='/admin/suggestions' className="sidebar-option" aria-label="Feedbacks">
          <img src='./suggestion.png' alt="Feedback Icon" />
          <p>User Suggestions</p>
        </NavLink>
        <NavLink to='/admin/statistics' className="sidebar-option" aria-label="Statistics">
          <img src={assets.dashboard} alt="Feedback Icon" />
          <p>Statistics</p>
        </NavLink>
      </div>
    </div>
  );
}

export default AdminSidebar;   
