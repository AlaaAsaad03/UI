import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../context/StoreContext";
import { useAuthStore } from "../../context/authStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(id); // Add item to cart if authenticated
    } else {
      toast.error("You must log in to add items to the cart.", {
        duration: 3000, // Toast duration in milliseconds
      });
      setTimeout(() => {
        navigate(`/login?redirect=${window.location.pathname}`);
      }, 1500); // Redirect after the toast duration
    }
  };
  return (
    <div className="food-item">
      <div className="food-item-content">
        <div className="food-item-header">
          <h2 className="food-item-name">{name}</h2>
          <p className="food-item-price">${price}</p>
        </div>

        <div className="food-item-image-container">
          <img
            className="food-item-image"
            src={`${url}/images/${image}`}
            alt={name}
          />
        </div>

        <p className="food-item-description">{description}</p>

        <div className="food-item-actions">
          {!cartItems[id] ? (
            <button 
              className="food-item-add-button"
              onClick={handleAddToCart}
            >
              Add to Box
            </button>
          ) : (
            <div className="food-item-counter">
              <button 
                className="counter-button"
                onClick={() => removeFromCart(id)}
              >
                -
              </button>
              <span className="counter-value">{cartItems[id]}</span>
              <button 
                className="counter-button"
                onClick={() => addToCart(id)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
