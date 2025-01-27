import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import GeneralLoader from '../../components/GeneralLoader/GeneralLoader';

const OrderCard = ({ order, onUpdateStatus }) => {
  return (
    <div className="order-card">
      <img src={assets.parcel_icon} alt="Parcel Icon" className="order-icon" />
      <div className="order-details">
        <p className="order-name">{`${order.address.firstName} ${order.address.lastName}`}</p>
        <p className="order-address">
          {`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.zipcode}`}
        </p>
        <div className="order-items">
          <p><strong>Items:</strong></p>
          {order.items.map((item, idx) => (
            <span key={idx}>
              {item.name} x {item.quantity}
              {idx < order.items.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        <p className="order-amount"><strong>Total: ${order.amount.toFixed(2)}</strong></p>
        <select
          className="order-status"
          value={order.status}
          onChange={(e) => onUpdateStatus(order._id, e.target.value)}
          aria-label="Order Status"
        >
          <option value="Food Processing">Food Processing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
    </div>
  );
};


const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  let adminRole = '';

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    adminRole = payload.role;
  }

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Failed to fetch orders.');
      }
    } catch (error) {
      toast.error('An error occurred while fetching orders.');
    }finally {
      setLoading(false); 
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, { orderId, status });
      if (response.data.success) {
        toast.success('Order status updated!');
        fetchAllOrders();
      } else {
        toast.error('Failed to update status.');
      }
    } catch (error) {
      toast.error('An error occurred while updating status.');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const isAuthorized = adminRole === 'Leader';

  return (
    <div className={`orders-page ${!isAuthorized ? "blurred" : ""}`}>
      {!isAuthorized && (
        <div className="lock-overlay">
          <i className="lock-icon">🔒</i>
          <p>Access Restricted</p>
        </div>
      )}
      {loading ? (
        <GeneralLoader message="Fetching Donations, hold on tight..." /> // Show loader while fetching
      ) : (
        isAuthorized && (
          <>
          <h1 className="admin-page-title">Orders Management</h1>
          <div className="admin-title-underline"></div>

          {orders.length > 0 ? (
            <div className="orders-container">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} onUpdateStatus={updateOrderStatus} />
              ))}
            </div>
          ) : (
            <p className="no-orders">No orders found. Sit back and relax! 😊</p>
          )}
        </>
        )
      )}
    </div>
  );
};

export default Orders;
