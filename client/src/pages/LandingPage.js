// landingPage.js

import React from 'react';
import { NavLink } from "react-router-dom";
import './css/LandingPage.css';

export const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Background Image */}
      <div className="background-image" style={{ backgroundImage: `url('https://www.tp.edu.sg/content/dam/tp-web/images/schools---courses/for-prospective-students/all-academic-schools/school-of-informatics---it/information-technology/IIT-t30-tn.jpg')` }}></div>

      {/* White Box with Title */}
      <div className="content-box bg-white p-5 rounded text-center">
        <h1>Information Technology Interest Group</h1>
        <div className="buttons">
          <NavLink to="/user-login" className="btn btn-info" style={{ paddingLeft: '20px', paddingRight: '20px', backgroundColor: '#249E9A', color: 'white', marginLeft: '20px' }}>
            Login
          </NavLink>
          <NavLink to="/user-signup" className="btn btn-info" style={{ paddingLeft: '20px', paddingRight: '20px', backgroundColor: '#249E9A', color: 'white', marginLeft: '20px' }}>
            Register
          </NavLink>
        </div>
      </div>
    </div>
  );
};


