import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import browserImageCompression from 'browser-image-compression';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CheckAdminJWTExpiryAndRole } from '../components/RequireAuth';

export const AdminAddEvents = () => {
  CheckAdminJWTExpiryAndRole();

  const navigate = useNavigate();
  const [event, setEvent] = useState({
    event_image: '',
    title: '',
    event_type: '',
    event_date: '',
    event_time: '',
    location: '',
    max_slots: '',
    description: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [id]: value || '',
    }));
  };

  // handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);

        // Compress the image before setting it
        const compressedImage = await imageCompression(file);

        // Convert the compressed image to a data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error.message);
      } finally {
        setLoading(false);
      }
    }
  };



  const imageCompression = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.1,
        useWebWorker: true,
      };
      return await browserImageCompression(file, options);
    } catch (error) {
      console.error('Error compressing image:', error.message);
      throw error;
    }
  };



  const handleSave = async (e) => {
    e.preventDefault();
    const maxSlotsValue = parseInt(event.max_slots, 10);
    // trim the values
    try {

      console.log(`
    title: ${event.title},
    event_type: ${event.event_type},
    event_date: ${event.event_date},
    event_time: ${event.event_time},
    location: ${event.location},
    max_slots: ${event.max_slots},
    description: ${event.description}
  `);

      console.log('Updated state:', event);

      const trimmedEvent = Object.fromEntries(
        Object.entries(event).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      );
      setEvent(trimmedEvent);

      if (
        selectedImage === '' ||
        selectedImage === 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' ||
        trimmedEvent.title === '' ||
        trimmedEvent.event_type === '' ||
        trimmedEvent.event_time === '' ||
        trimmedEvent.max_slots === '' ||
        trimmedEvent.event_date === '' ||
        trimmedEvent.location === '' ||
        trimmedEvent.description === ''
      ) {
        alert('Please make changes to the event form before saving.');
        console.log('One or more fields are empty:', trimmedEvent);
        return;
      }

      if (isNaN(maxSlotsValue) || !Number.isInteger(maxSlotsValue)) {
        alert('Ensure that the Max Slots value is a valid integer');
        console.log('Invalid Max Slots value:', trimmedEvent.max_slots);
        return;
      }

      // Convert the base64-encoded image to a data URL
      const compressedImage = selectedImage ? selectedImage.split(",")[1] : null;

      const formData = new FormData();
      formData.append('event_image', compressedImage);
      formData.append('title', trimmedEvent.title);
      formData.append('event_type', trimmedEvent.event_type);
      formData.append('event_date', trimmedEvent.event_date);
      formData.append('event_time', trimmedEvent.event_time);
      formData.append('location', trimmedEvent.location);
      formData.append('max_slots', trimmedEvent.max_slots);
      formData.append('description', trimmedEvent.description);

      console.log(formData);
      console.log(selectedImage)

      // send add event response
      const response = await axios.post(
        `http://127.0.0.1:5050/admin-events/add-event`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            // 'Content-Type': 'multipart/form-data', // Remove this line
          },
        }
      );

      if (response.status === 200) {
        const updatedEvent = await response.data;
        setEvent(updatedEvent);
        setSelectedImage(null);
        console.log('Event added successfully!');
        navigate(`/admin-events`);
      } else {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);

      }
    } catch (error) {
      console.error('Error during event save:', error);
      console.log('Error response data:', error.response.data);
      console.log('Error response status:', error.response.status);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="d-flex position-relative">
      <br />
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
              <div className="col-md-4 text-center">
                <div className="overflow-hidden mx-auto position-relative" style={{ width: '150px', height: '150px' }}>
                  {loading ? (
                    <div>Loading image...</div>
                  ) : (
                    <img
                      src={selectedImage && selectedImage.startsWith('data:') ? selectedImage : `https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg`}
                      alt="Event"
                      className="img-fluid"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                  )}
                </div>
                <div style={{ marginTop: '5px', fontSize: '14px' }}>
                  <label htmlFor="inputImage" style={{ cursor: 'pointer' }}>
                    Change Image
                  </label>
                </div>
                <input
                  type="file"
                  id="inputImage"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>

              <div className="col-md-7">
                {Object.keys(event).length > 0 ? (
                  <form>
                    <div className="mb-2">
                      <label htmlFor="title" className="form-label">
                        Event Name
                      </label>
                      <input type="text" className="form-control" id="title" value={event.title} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="eventType" className="form-label">
                        Event Type
                      </label>
                      <input type="text" className="form-control" id="event_type" value={event.event_type} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="date" className="form-label">
                        Date
                      </label>
                      <input type="date" className="form-control" id="event_date" value={event.event_date} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="time" className="form-label">
                        Time
                      </label>
                      <input type="time" className="form-control" id="event_time" value={event.event_time} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">
                        Location
                      </label>
                      <input className="form-control" id="location" rows="3" value={event.location} onChange={handleInputChange}></input>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="maxSlots" className="form-label">
                        Max Slots
                      </label>
                      <input className="form-control" id="max_slots" rows="3" value={event.max_slots} onChange={handleInputChange}></input>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Event Description
                      </label>
                      <textarea className="form-control" id="description" rows="3" value={event.description} onChange={handleInputChange}></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="customButton"
                        style={{ backgroundColor: '#BB2525', borderRadius: '10px', marginRight: '10px' }}
                        onClick={handleSave}
                      >
                        Add Event
                      </button>
                      <NavLink to={`/admin-events`}>
                        <button className="customButton" style={{ backgroundColor: '#1D3C8A', borderRadius: '10px' }}>
                          Cancel
                        </button>
                      </NavLink>
                    </div>
                  </form>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
