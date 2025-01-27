import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
    setData(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Total Amount</th>
              <th>Items</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>${order.amount}.00</td>
                <td>{order.items.length}</td>
                <td>
                  <span className={`status-${order.status.toLowerCase()}`}>
                    &#x25cf; {order.status}
                  </span>
                </td>
                <td>
                  <button onClick={fetchOrders}>Track Order</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;