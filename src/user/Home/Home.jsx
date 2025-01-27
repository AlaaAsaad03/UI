import React, { useState, useEffect } from 'react';
import './Home.css'
import Header from '../Header/Header'
import AboutUs from '../AboutUs/AboutUs'
import FeedbackList from '../FeedbackList/FeedbackList';
import Services from '../Services/Services';
import OurTeam from '../OurTeam/OurTeam';
import MapPanel from '../MapPanel/MapPanel';
import CounterBar from '../Counter/Counter';

const Home = ({ searchTerm }) => {

  const [category,setCategory] = useState("All");
  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

 

  useEffect(() => {
    // You can add any logic based on the token here, e.g., redirect or fetch data
    if (token) {
      console.log("Token found:", token);
      // Perform actions based on token, such as fetching user data or showing specific content
    }
  }, [token]);
return (
<div>
  <Header/>
  <CounterBar/>
  <AboutUs/>
  <Services/>
  <OurTeam/>
  <MapPanel/>
  {/* <FeedbackList/> */}
</div>
)
}

export default Home