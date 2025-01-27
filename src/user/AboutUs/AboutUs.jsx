import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <section className="about-us-wrapper" id="about-us">
      <div className="title">
        <p>About Us</p>
        <h2>Who We Are</h2>
      </div>
      <div className="about-us-container">
        <div className="about-us-content">
          <p>
            In the heart of a nation rebuilding itself, our mission is simple:
            to bring people together to support those in need. Through{" "}
            <span className="highlight">customizable donation boxes</span>, we
            provide a platform for generosity and care. Whether it's food,
            clothes, or heating supplies, you have the power to choose what goes
            in the box. We’ll take care of delivering it to the ones who need it
            most.
          </p>
          <p>
            Together, we can rebuild lives, one box at a time. This isn't just
            about giving—it’s about creating hope, restoring dignity, and
            sharing kindness. Thank you for being a part of this journey.
          </p>
          <p className="call-to-action">
            Let’s <span className="highlight">rebuild hope</span>,{" "}
            <span className="highlight">share warmth</span>, and make a
            difference—<br />
            one box at a time.
          </p>
        </div>
        <img
          src="/AboutUsBox.png"
          alt="A box of donations being delivered with a smile"
          className="about-us-image"
        />
      </div>
    </section>
  );
};

export default AboutUs;