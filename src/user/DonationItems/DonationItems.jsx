import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import axios from "axios";
import "./DonationItem.css";

const MouseEnterContext = createContext([false, () => {}]);

export const CardContainer = ({ children, containerClassName }) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={`py-6 flex items-center justify-center ${containerClassName}`}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          className="relative transition-transform duration-200 ease-linear"
          style={{ transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({ children, className }) => (
  <div
    className={`h-48 w-48 transform-style:preserve-3d [&>*]:transform-style:preserve-3d ${className}`}
  >
    {children}
  </div>
);

const DonationItem = () => {
  const [items, setItems] = useState([]);
  const url = "http://localhost:4000";
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1])); // Decodes the payload part of the JWT
  const userId = payload.id;

  const fetchItems = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/suggestion/my-suggestions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setItems(response.data.suggestions);
    } catch (error) {
      console.error("Failed to fetch items:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="donation-items-page">
      <div className="items-container">
        {items.map((item) => (
          <CardContainer key={item._id}>
            <CardBody className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center text-center">
              <img
                src={`${url}/images/${item.image}`}
                alt={item.name}
                className="rounded-md h-24 w-24 object-cover mb-2"
              />
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm font-bold text-tomato-500">{item.status}</p>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>
  );
};

export default DonationItem;
