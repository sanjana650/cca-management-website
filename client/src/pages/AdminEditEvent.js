import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import browserImageCompression from 'browser-image-compression';
import { CheckAdminJWTExpiryAndRole } from '../components/RequireAuth';

export const AdminEditEvent = () => {
  CheckAdminJWTExpiryAndRole();
  const params = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    event_image: '',
    title: '',
    event_type: '',
    event_date: '',
    event_time: '',
    location: '',
    max_slots: '',
    description: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const event_id = params.id.toString();

  //fetch event details
  const getEventInfo = async (event_id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5050/admin-events/view-event/${event_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("Fetched Event Data:", response.data);

      // Filter out unwanted properties (e.g., _id, __v)
      const filteredEventData = Object.fromEntries(
        Object.entries(response.data).filter(([key]) => ['event_image', 'title', 'event_type', 'event_date', 'event_time', 'location', 'max_slots', 'description'].includes(key))
      );

      setEvent(filteredEventData);
    } catch (error) {
      console.error('Error fetching event info:', error);
    }
  };



  useEffect(() => {
    getEventInfo(event_id);
  }, [event_id]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        setLoading(true);

        // Compress the image before setting it
        const compressedImage = await imageCompression(file);
        setSelectedImage(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  //handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [id]: value || '',
    }));
  };


  //handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);

        // Compress the image before setting it
        const compressedImage = await imageCompression(file);
        setSelectedImage(compressedImage);
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

  //send edited response
  const handleSave = async (event_id) => {
    //console.log(event_id)
    const maxSlotsValue = parseInt(event.max_slots, 10);

    try {

      // console.log('Updated state:', event);

      //trim the values
      const trimmedEvent = Object.fromEntries(
        Object.entries(event).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      );
      setEvent(trimmedEvent);

      if (selectedImage === '' || trimmedEvent.title === '' || trimmedEvent.event_type === '' || trimmedEvent.event_time === '' || trimmedEvent.max_slots === '' || trimmedEvent.event_date === '' || trimmedEvent.location === '' || trimmedEvent.description === '') {
        alert('Please make changes to the event form before saving.');
        console.log('One or more fields are empty:', trimmedEvent);
        return;
      }

      if (isNaN(maxSlotsValue) || !Number.isInteger(maxSlotsValue)) {
        alert('Ensure that the Max Slots value is a valid integer');
        console.log('Invalid Max Slots value:', trimmedEvent.max_slots);
        return;
      }

      const formData = new FormData();
      formData.append('event_image', selectedImage);
      formData.append('title', trimmedEvent.title);
      formData.append('event_type', trimmedEvent.event_type);
      formData.append('event_date', trimmedEvent.event_date);
      formData.append('event_time', trimmedEvent.event_time);
      formData.append('location', trimmedEvent.location);
      formData.append('max_slots', trimmedEvent.max_slots);
      formData.append('description', trimmedEvent.description);
      // console.log(formData);

      //send edit response
      const response = await axios.patch(
        `http://127.0.0.1:5050/admin-events/edit-event/${event_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data', // Remove this line
          },
        }
      );

      if (response.status === 200) {
        const updatedEvent = await response.data;
        setEvent(updatedEvent);
        setSelectedImage(null);
        console.log('Event updated successfully!');
        navigate(`/admin-view-selected-event/${event_id}`)
      } else {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
      }
    } catch (error) {
      console.error('Error during event save:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }



  return (
    <div className="d-flex position-relative">
      <br />
      <div className="container">
        <div className="row justify-content-center">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-4 text-center">
                <div className="overflow-hidden mx-auto position-relative" style={{ width: '150px', height: '150px' }}>
                  {loading ? (
                    <div>Loading image...</div>
                  ) : (
                    <img
                      src={selectedImage ? URL.createObjectURL(selectedImage) : `data:image/png;base64,${event.event_image || ''}`}
                      alt="Event"
                      className="img-fluid"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="mb-2">
                  <label htmlFor="inputImage" style={{ cursor: 'pointer', textDecoration: 'underline', color: '#1D3C8A' }}>
                    Change Image
                  </label>
                  <input
                    type="file"
                    id="inputImage"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    onClick={(e) => (e.target.value = null)} // Add this line
                  />
                </div>

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
                        onClick={() => handleSave(event_id)}
                      >
                        Save Changes
                      </button>
                      <NavLink to={`/admin-view-selected-event/${event_id}`}>
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
}
