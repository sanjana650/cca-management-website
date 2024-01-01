import React from 'react';
import SideNavbar from "../components/AdminNavbar";
import './css/AdminHome.css';  // Import your CSS file

export const AdminEvents = () => {
  return (
    <div className="d-flex">
      <SideNavbar />
      <div className="flex-grow-1 admin-event-content">
        <div className='event-content'>
          <h2>View Events</h2>
          {/* Add more content as needed */}
        </div>
      </div>
    </div>
  );
};
