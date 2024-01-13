import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import axios from 'axios';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import MemberDisplayEventCard from '../components/MemberDisplayEventCard';
import { jwtDecode } from 'jwt-decode';

export const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState('');

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const email = decodedToken.email;

  const getEvents = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5050/user-events/view-all-events`, {
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
  }, []);


  const eventsList = () => {
    if (Array.isArray(events)) {
      return events.map((event) => (
        <MemberDisplayEventCard
          key={event._id}
          event={event}
          onJoin={() => joinEvent(event._id)}
          onLeave={() => leaveEvent(event._id)}
          userId={userId}

        />
      ));
    } else {
      return <p>No events found.</p>;

    }
  };

  const updateEventCount = (event_id, newCount) => {
    setEvents((prevEvents) => {
      return prevEvents.map((event) => {
        if (event._id === event_id) {
          return { ...event, count: newCount, members_signedup: event.members_signedup };
        }
        return event;
      });
    });
  };


  //join event
  const joinEvent = async (event_id) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5050/user-events/join-event/${event_id}`, { userId, email }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      updateEventCount(event_id, response.data.count);
      alert(`Successfully joined an event`)
    } catch (error) {
      console.error(error.message);
    }
  }

  const leaveEvent = async (event_id) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5050/user-events/leave-event/${event_id}`, { userId, email }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      updateEventCount(event_id, response.data.count);
      alert(`Successfully left an event`)

    } catch (error) {
      console.error(error.message);
    }
  }

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === '') {
        // If the search query is empty, fetch all events
        getEvents();
      } else {
        const response = await axios.get(`http://127.0.0.1:5050/user-events/search-event/${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEvents(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFilter = async (eventType) => {
    try {

      const response = await axios.get(`http://127.0.0.1:5050/user-events/filter-events/${eventType}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(response.data);
      console.log(response.data)


    } catch (error) {
      console.error(error.message);
    }
  }

  const allEvents = async () => {
    setSearchQuery('');
    setEventType('');
    getEvents();
  }

  const filterEvent = async (eventType) => {
    if (eventType === 'Volunteer' || eventType === 'Outreach' || eventType === 'Workshop' || eventType === 'Hackathon') {
      handleFilter(eventType);
    }
  }

  return (
    <div>
      <Navbar />

      <br></br>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', color: '#1D3C8A' }}>Events</h2>
      <br></br>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search event by title"
              aria-label="Search"
              aria-describedby="basic-addon2"
              style={{ backgroundColor: '#D3C3FF' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-3">
            {/* Centered and spaced buttons */}
            <button className="btn btn-outline-secondary mr-2" type="button" style={{ marginRight: '20px' }} onClick={allEvents}>
              All Events
            </button>
            <button className="btn btn-outline-secondary mr-2" type="button" style={{ marginRight: '20px' }} onClick={() => filterEvent('Volunteer')}>
              Volunteer
            </button>
            <button className="btn btn-outline-secondary mr-2" type="button" style={{ marginRight: '20px' }} onClick={() => filterEvent('Workshop')}>
              Workshop
            </button>
            <button className="btn btn-outline-secondary mr-2" type="button" style={{ marginRight: '20px' }} onClick={() => filterEvent('Hackathon')}>
              Hackathon
            </button>
            <button className="btn btn-outline-secondary mr-2" type="button" style={{ marginRight: '20px' }} onClick={() => filterEvent('Outreach')}>
              Outreach
            </button>

          </div>
        </div>
      </div>
      <br />
      <div className="event-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80%', margin: 'auto' }}>
        {eventsList()}
      </div>
    </div>

  )
}

