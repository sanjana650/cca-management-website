import React, { useEffect } from 'react';
import Navbar from "../components/Navbar";
import homeImage from "../images/home.png";
import './css/HomePage.css'; // Import your CSS file
import { NavLink, useNavigate } from "react-router-dom";
import { UseRequireAuth } from '../components/RequireAuth'

export const UserHome = () => {
  // const navigate = useNavigate();
  UseRequireAuth();

  return (
    <div>
      <Navbar />
      <div className='home-bg'>
        <div className='blue-section'>
          <div className='blue-section-content'>
            <h1>
              <div className="bold-dark-blue">Beyond Boundaries,</div>
              <div className="bold-dark-blue">Beyond Bytes!</div>
            </h1>
            <br></br>
            <p>
              Reflecting our commitment to student empowerment, community engagement, and excellence in all endeavors.
            </p>
            <br></br>
            <button className="all-events-button">All Events</button>
          </div>
          <br></br>
          <div className='blue-section-image'>
            <img src={homeImage} alt="Your Alt Text" />
          </div>
        </div>
        <div className='intro'>
          <h2>Information Technology Interest Group</h2>
          <h3>Temasek Polytechnic</h3>
          <p>Welcome to the Information Technology Interest Group (ITSIG), where innovation meets collaboration! As a dynamic and student-driven organisation, ITSIG is dedicated to fostering a vibrant community of tech enthusiasts. We aim to empower students through engaging events, insightful workshops, and impactful outreach programs. </p>
        </div>
      </div>
    </div>
  );
};
