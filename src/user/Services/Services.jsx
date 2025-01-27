import React, { useState } from "react";
import { FaGift, FaHandHoldingHeart, FaShippingFast, FaHeart } from "react-icons/fa";
import "./Services.css";

const Services = () => {
  const [hearts, setHearts] = useState([]);

  const handleHeartHover = () => {
    let newHearts = [];
    for (let i = 0; i < 5; i++) {
      newHearts.push({
        id: i,
left: `${Math.random() * 20 - 10}%`,  // Random left position within a smaller range        top: `${Math.random() * 10 - 20}px`,        
        animationDuration: `${0.8 + Math.random() * 1}s`
      });
    }
    setHearts(newHearts);
    setTimeout(() => setHearts([]), 1000);
  };

  const services = [
    {
      title: "Customizable Boxes",
      description:
        "Choose what goes into your donation box—from food to clothes to heating supplies. You make the choice, we make the delivery.",
      icon: <FaGift className="service-icon fa-gift" />,
    },
    {
      title: "Wide Categories",
      description:
        "Explore categories like food, clothes, heating supplies, and more to meet the specific needs of the community.",
      icon: (
        <div
          onMouseEnter={handleHeartHover}
        >
          <FaHandHoldingHeart className=" service-icon fa-heart" />
      {hearts.map((heart) => (
        <FaHeart 
          key={heart.id}
          className="heart-fly"
          style={{
            top: '30px', // Adjust height to be right above the icon
            transform: 'translateX(-50%)',
            animationDuration: heart.animationDuration
          }}          
        />
          ))}
        </div>
      ),
    },
    {
      title: "Fast Delivery",
      description:
        "We ensure your donation box reaches those in need swiftly and with care, bringing hope and kindness to their doorsteps.",
      icon: <FaShippingFast className="service-icon fa-shipping-fast" />,
    },
  ];

  return (
    <section className="services-wrapper">
      <div className="title">
        <p>Our Services</p>
        <h2>What We Offer</h2>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card flex flex-col items-center">
            <div className="blob"></div>
            {service.icon}
            <h3 className="serv-title">{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
