import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import GeneralLoader from "../../components/GeneralLoader/GeneralLoader";



export const List = ({ url }) => {
  const [list, SetList] = useState([]);
  const [loading, setLoading] = useState(true);

  let adminRole = "";
  const token = localStorage.getItem("token");

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodes the payload part of the JWT
    const adminId = payload.id;
    adminRole = payload.role;
    console.log("adminId", adminId);
    console.log("adminRole", adminRole);
  }

  const fetchList = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        SetList(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error fetching list");
    } finally {
      setLoading(false); 
    }
  };


  const removeFood = async (foodId) => {
    const response = await axios.delete(`${url}/api/food/remove`, {
      data: { id: foodId },
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };
  useEffect(() => {
    fetchList();
  }, []);

  const isAuthorized = adminRole === "Leader";


  return (
    <div className={`list-page ${!isAuthorized ? "blurred" : ""}`}>
      {!isAuthorized && (
        <div className="lock-overlay">
          <i className="lock-icon">🔒</i>
          <p>Access Restricted</p>
        </div>
      )}
     {loading ? (
        <GeneralLoader message="Getting the food list ready for impact..." /> // Show the loader with a custom message
      ) : (
        isAuthorized && (
          <>
    <div className="list flex-col">
      <h1 className="admin-page-title">Items List</h1>
      <div className="admin-title-underline"></div>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Subcategory</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>
                {item.subcategory ? item.subcategory.name : "No Subcategory"}
              </p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
    </>
  )
)}
</div>
);
};
export default List;