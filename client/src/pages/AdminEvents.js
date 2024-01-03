import React, { useEffect, useState } from 'react';
import SideNavbar from "../components/AdminNavbar";
import axios from 'axios';
import DisplayEventCard from '../components/DisplayEventCard';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);


  const getEvents = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5050/admin-events/view-all-events`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data)
      setEvents(response.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getEvents();
  });

  const eventsList = () => {
    return events.map((event) => (
      <DisplayEventCard
        key={event._id}
        event={event}
      />
    ))
  }


  return (
    <div className="d-flex">
      <SideNavbar />
      <div className="flex-grow-1 admin-event-content" style={{ display: 'flex', flexDirection: 'column', }}>
        <br />
        <div className='event-content'>
          <h2 style={{ textAlign: 'center' }}>View Events</h2>
          <br />
          <div className="event-content" style={{ display: 'flex', flexDirection: 'column' }}>
            {eventsList()}
          </div>
        </div>
      </div>
    </div>
  );
};
