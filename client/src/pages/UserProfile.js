import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { UseRequireAuth } from '../components/RequireAuth';
import './css/ProfilePage.css';

export const UserProfile = () => {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  UseRequireAuth();

  useEffect(() => {
    async function getProfile() {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Decode the token to get the user ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // Make a GET request to the view-profile endpoint with the token in the header
        const response = await axios.get(`http://127.0.0.1:5050/user/view-profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });
  
        if (response.status === 200) {
          // Set the user profile state if the request is successful
          setUserProfile(response.data.userProfile);
          // Log user details
          //console.log('Decoded Token:', decodedToken);
          console.log('User Details:', response.data);
        } else {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    }

    // Call the function
    getProfile();
  }, []);

  return (
    <div>
      <Navbar />
      <br></br>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Profile</h2>

      <div className="profile-container">

        <br />
        <div className="profile-body">
          <div className='imgProfile'>
            {userProfile && (
              <>
                <img
                  src={`data:image/png;base64,${userProfile.profile_pic}`}
                  alt="Profile"
                  style={{ borderRadius: '50%' }}
                />
                <button className="buttonChangeImage" onClick={() => console.log("Change Image")}>
                  Change Image
                </button>
              </>
            )}
          </div>
          <div className="formContainer">
            <form>
              <label>Name:</label>
              <input type="text" value={userProfile?.name} />
              <label>Email:</label>
              <input type="text" value={userProfile?.email} />
              <label>Age:</label>
              <input type="text" value={userProfile?.age} />
              <label>Diploma:</label>
              <input type="text" value={userProfile?.diploma} />
              <label>About:</label>
              <textarea rows="4" value={userProfile?.about} />

              {/* Move buttonsContainer inside the form */}
              <div className="buttonsContainer">
                <button className="customButton" style={{ backgroundColor: "#BB2525", borderRadius: '10px' }}>Delete Profile</button>
                <button className="customButton" style={{ backgroundColor: "#1D3C8A", borderRadius: '10px' }}>Edit Profile</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

};

