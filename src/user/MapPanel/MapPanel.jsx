import React, { useState, useEffect } from "react";
import "./MapPanel.css";
import Map from "./Map";

// Custom hook for counter
const useCounter = (initialValue, incrementRange = [10, 30], speed = 100) => {
  const [counter, setCounter] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(
        Math.random() * (incrementRange[1] - incrementRange[0]) + incrementRange[0]
      );
      setCounter((prev) => prev + increment);
    }, speed);

    return () => clearInterval(interval);
  }, [incrementRange, speed]);

  return counter;
};

const MapPanel = () => {
  const fakeCounter = useCounter(1000);

  return (
    <div className="map-panel-section" aria-label="Map Panel Section">
      <div className="title">
        <p>Delivered Cases</p>
        <h2>Making a Difference</h2>
      </div>

      <div className="map-panel-container">
        {/* Left: Map */}
        <div className="map-container" aria-label="Map Container">
          <Map />
        </div>

        {/* Right: Motivational Section */}
        <div className="motivation-container" aria-label="Motivational Section">
          <h2>Every Box Counts!</h2>
          <p>
            Your contributions are making a real difference in the lives of
            those in need. Together, we’re building a better tomorrow.
          </p>
          <div className="counter">
            <h1>{fakeCounter.toLocaleString()}+</h1>
            <p>Boxes Delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;
