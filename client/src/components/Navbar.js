import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { LogoutUser } from '../components/RequireAuth'
import { jwtDecode } from 'jwt-decode';
import { UseRequireAuth } from '../components/RequireAuth'


import iconImage from "../images/icon.png";
import profileImage from "../images/profile.png";
import logoutImage from "../images/logout.png";


export default function Navbar() {
  UseRequireAuth()

  let handleLogout = ''

  const navigate = useNavigate();
  const storedToken = localStorage.getItem('token');




  if (!storedToken || typeof storedToken !== 'string') {
    // Handle the case when the token is not present
    navigate("/", { replace: true });
    return null; // Return null to prevent further rendering
  }
  else {
    const decodedToken = jwtDecode(storedToken);
    const userId = decodedToken.userId
    handleLogout = () => {
      localStorage.removeItem("token");
      //now after logging out user cannot access the home page
      navigate("/", { replace: true });
      LogoutUser(userId)
    };
  }



  return (
    <div >
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar" style={{ backgroundColor: "#A6E3E3", padding: '20px' }}>
        <div className="container-fluid">
          <div className="navbar-brand">
            <NavLink to="/user-home">
              <img style={{ width: "100%" }} src={iconImage} alt="Icon" />
            </NavLink>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              <li className="nav-item" style={{ padding: "0 15px", fontWeight: "bold" }}>
                <NavLink className="nav-link" to="/user-events">
                  Events
                </NavLink>
              </li>
              <li className="nav-item" style={{ padding: "0 15px", fontWeight: "bold" }}>
                <NavLink className="nav-link" to="/user-view-members">
                  Members
                </NavLink>
              </li>
              <li className="nav-item" style={{ padding: "0 15px", fontWeight: "bold" }}>
                <NavLink className="nav-link" to="/user-updates">
                  Updates
                </NavLink>
              </li>
              <li className="nav-item" style={{ padding: "0 15px", fontWeight: "bold" }}>
                <NavLink className="nav-link" to="/user-contact">
                  Contact Us
                </NavLink>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item" style={{ padding: "0 15px", fontWeight: "bold" }}>
                <button
                  className="profile-button"
                  style={{
                    display: 'flex', // Use flexbox
                    alignItems: 'center', // Center items vertically
                    padding: '0 15px',
                    fontWeight: 'bold',
                    backgroundColor: '#1D3C8A',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    borderRadius: '10px',
                  }}
                >
                  <NavLink
                    className="nav-link"
                    to="/user-profile"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      display: 'flex', // Use flexbox
                      alignItems: 'center', // Center items vertically
                    }}
                  >
                    <img style={{ width: '25%', marginRight: '10px' }} src={profileImage} alt="profile" />
                    Profile
                  </NavLink>
                </button>



              </li>
              <li className="nav-item" style={{ padding: "0 15px", fontWeight: "bold" }}>
                {/* onClick should be inside the button element */}
                <button className="nav-link" onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                  Logout
                  <img style={{ width: '25%', marginLeft: '10px' }} src={logoutImage} alt="profile" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
