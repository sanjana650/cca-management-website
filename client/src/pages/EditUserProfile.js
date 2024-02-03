import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import browserImageCompression from 'browser-image-compression';
import { CheckMemberJWTExpiryAndRole } from '../components/RequireAuth';
import { NavLink, useNavigate } from 'react-router-dom';

export const EditUserProfile = () => {
  CheckMemberJWTExpiryAndRole();

  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({
    profile_pic: '',
    email: '',
    name: '',
    age: '',
    diploma: '',
    about: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function getProfile() {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(`http://127.0.0.1:5050/user/view-profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userProfileData = await response.data;
          setUserProfile(userProfileData.userProfile);
          console.log('User Details:', userProfileData.userProfile);
        } else {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    }

    getProfile();
  }, []);

  const handleInputChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.id]: e.target.value });
  };

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

  const handleSave = async () => {
    try {
      // Add validation checks
      if (!userProfile.name || !userProfile.age || isNaN(userProfile.age) || !userProfile.diploma || !userProfile.about) {
        window.alert("Please fill in all fields and ensure age is a number.");
        return;
      }

      const token = localStorage.getItem('token');
      const userId = userProfile._id;

      const formData = new FormData();
      formData.append('profile_pic', selectedImage);
      formData.append('name', userProfile.name);
      formData.append('age', userProfile.age);
      formData.append('diploma', userProfile.diploma);
      formData.append('about', userProfile.about);

      setUserProfile((prevProfile) => ({
        ...prevProfile,
        profile_pic: selectedImage ? URL.createObjectURL(selectedImage) : prevProfile.profile_pic,
      }));

      const response = await axios.patch(
        `http://127.0.0.1:5050/user/edit-profile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        const updatedProfile = await response.data;
        setUserProfile(updatedProfile);
        setSelectedImage(null);
        console.log('Profile updated successfully!');
        navigate('/user-profile');
      } else {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
      }
    } catch (error) {
      console.error('Error updating user profile:', error.message);
    }
  };

  return (
    <div>
      <br />
      <h2 className="text-center font-weight-bold" style={{ textAlign: 'center', fontWeight: 'bold', color: '#1D3C8A' }}>Profile</h2>

      <div className="container">
        <div className="row justify-content-center">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-4 text-center">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{ cursor: 'pointer' }}
                >
                  <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                    <div className="rounded-circle overflow-hidden mx-auto position-relative" style={{ width: '150px', height: '150px' }}>
                      {loading ? (
                        // Display a loading spinner or placeholder while processing the image
                        <div>Loading image...</div>
                      ) : (
                        <img
                          src={selectedImage ? URL.createObjectURL(selectedImage) : `data:image/png;base64,${userProfile.profile_pic || ''}`}
                          alt="Profile"
                          className="img-fluid rounded-circle"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <p>Drag and drop an image or click to upload</p>
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />

                </div>
              </div>

              <div className="col-md-8">
                <form>
                  <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail" value={userProfile.email} readOnly />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputName" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={userProfile.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputAge" className="form-label">Age</label>
                    <input
                      type="text"
                      className="form-control"
                      id="age"
                      value={userProfile.age}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputDiploma" className="form-label">Diploma</label>
                    <input
                      type="text"
                      className="form-control"
                      id="diploma"
                      value={userProfile.diploma}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputAbout" className="form-label">About</label>
                    <textarea
                      className="form-control"
                      id="about"
                      rows="3"
                      value={userProfile.about}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button className="customButton" style={{ backgroundColor: "#BB2525", borderRadius: '10px', marginRight: '10px' }} onClick={handleSave}>
                Save
              </button>
              <NavLink to="/user-profile">
                <button className="customButton" style={{ backgroundColor: "#1D3C8A", borderRadius: '10px' }}>
                  Cancel
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};