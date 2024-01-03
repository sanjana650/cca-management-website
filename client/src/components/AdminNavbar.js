// SideNavbar.js

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogoutUser } from '../components/RequireAuth';
import { jwtDecode } from 'jwt-decode';

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import iconImage from '../images/icon.png';
import adminImage from '../images/admin.png';
import logoutImage from '../images/logout.png';

const SideNavbar = () => {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const userId = decodedToken.userId;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
    LogoutUser(userId);
  };

  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 " style={{ backgroundColor: 'lightblue' }}>
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
        <NavLink className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <img src={iconImage} alt="Logo" className="logo" />
        </NavLink>
        <div className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white">
          <span className="fs-5 d-none d-sm-inline text-black font-weight-bold" style={{ fontWeight: "bold", fontSize: 'x-large' }}>
            Admin
          </span>
          <img src={adminImage} alt="admin" className="admin-image" style={{ width: '25%', marginLeft: '10px' }} />
        </div>

        <ul className="nav flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
          <li className="nav-item">
            <NavLink to="/admin-events" className="nav-link align-middle px-0 text-black font-weight-bold" style={{ fontWeight: "bold" }}>
              Events
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin-updates" className="nav-link align-middle px-0 text-black font-weight-bold" style={{ fontWeight: "bold" }}>
              Updates
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin-members" className="nav-link align-middle px-0 text-black font-weight-bold" style={{ fontWeight: "bold" }}>
              Members
            </NavLink>
          </li>
          {/* Add more menu items as needed */}
        </ul>
        <hr className="mt-3 mb-4" />
        <div className="mt-auto">
          <button className="nav-link" onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'black', marginBottom: '20px' }}>
            Logout
            <img src={logoutImage} alt="Logout" style={{ width: '25%', marginLeft: '10px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
