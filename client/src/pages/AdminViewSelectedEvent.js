// AdminViewSelectedEvent.js
import React, { useEffect, useState } from 'react';
import SideNavbar from "../components/AdminNavbar";
import axios from 'axios';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


export const AdminViewSelectedEvent = () => {
  const [event, setEvent] = useState({
    event_image: '',
    title: '',
    event_type: '',
    event_date: '',
    event_time: '',
    location: '',
    max_slots: '',
    count: '',
    description: '',
    members_signedup: ''

  });
  const params = useParams();
  const navigate = useNavigate();


  const event_id = params.id.toString();
  // console.log(event_id)

  const getEventInfo = async (event_id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5050/admin-events/view-event/${event_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data);
      setEvent(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getEventInfo(event_id);
  }, []);

  //delete event
  async function deleteEvent(event_id) {
    try {
      console.log("Deleting event with ID:", event_id);

      const response = await axios.delete(`http://127.0.0.1:5050/admin-events/delete-event/${event_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log("Delete response:", response);

      if (response.status === 200) {
        navigate('/admin-events');
        console.log("Delete response:", response);

      } else {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
      }
    } catch (error) {
      console.error('Error deleting event:', error.message);
    }
  }



  return (
    <div className="d-flex position-relative">
      <div className="container">
        <div className="row justify-content-center">
          <div className="container">
            <div className="row mt-5">
              {/* Back icon to redirect to the main event page */}
              <div
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '20px' }}
                onClick={() => navigate('/admin-events')}
              >
                <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '24px', marginRight: '10px' }} />
                {/* Use the Font Awesome icon component */}
              </div>


              <div className=" overflow-hidden mx-auto position-relative" style={{ width: '300px', height: '300px', objectFit: 'cover' }}>
                <img src={`data:image/png;base64,${event.event_image}`} alt="Profile" className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div className="col-md-7">
                <form>
                  <div className="mb-2">
                    <label htmlFor="title" className="form-label">Event Name</label>
                    <input type="text" className="form-control" id="inputtitle" defaultValue={event.title} readOnly />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputName" className="form-label">Event Type</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventType"
                      defaultValue={event.event_type}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputDate" className="form-label">Date</label>
                    <input
                      type="text"
                      className="form-control"
                      id="date"
                      defaultValue={event.event_date}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputTime" className="form-label">Time</label>
                    <input
                      type="text"
                      className="form-control"
                      id="time"
                      defaultValue={event.event_time}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputLocation" className="form-label">Location</label>
                    <input
                      className="form-control"
                      id="location"
                      rows="3"
                      defaultValue={event.location}
                      readOnly
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputMaxSlots" className="form-label">Max Slots</label>
                    <input
                      className="form-control"
                      id="maxSlots"
                      rows="3"
                      defaultValue={event.max_slots}
                      readOnly
                    ></input>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputDescription" className="form-label">Event Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      defaultValue={event.description}
                      readOnly
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      className="customButton"
                      style={{ backgroundColor: "#BB2525", borderRadius: '10px', marginRight: '10px' }}
                      onClick={(e) => {
                        e.preventDefault();
                        deleteEvent(event_id);
                      }}
                    >                      Delete Event
                    </button>
                    <NavLink to={`/admin-edit-event/${event_id}`}>
                      <button className="customButton" style={{ backgroundColor: "#1D3C8A", borderRadius: '10px' }}>
                        Edit Event
                      </button>
                    </NavLink>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
