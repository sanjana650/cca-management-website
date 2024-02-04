import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { CheckMemberJWTExpiryAndRole } from '../components/RequireAuth';
import DisplayMemberProfile from '../components/DisplayMemberProfile';

export const UserProfile = () => {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  CheckMemberJWTExpiryAndRole();

  let userId = ''
  const token = localStorage.getItem('token');
  //If token is invalid or does not exist
  if (typeof token !== 'string' || !token) {
    navigate('/', { replace: true });
  }
  else {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  }


  useEffect(() => {
    async function getProfile() {
      try {
        const response = await axios.get(`http://127.0.0.1:5050/user/view-profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUserProfile(response.data.userProfile);
          console.log('User Details:', response.data);
        } else {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
        }
      } catch (error) {
        console.error('Error fetching user profile as user is logged out:', error.message);
      }
    }

    getProfile();
  }, []);

  async function deleteProfile(userId) {
    // Display a confirmation dialog before proceeding
    const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");

    if (!confirmDelete) {
      window.location.reload(false);

    } else {
      try {
        const response = await axios.delete(`http://127.0.0.1:5050/user/delete-profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          localStorage.removeItem("token");

          // Redirect to the home page after successful deletion
          navigate('/');
        } else {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
        }
      } catch (error) {
        console.error('Error deleting user profile:', error.message);
      }
    }
  }

  const profileList = () => {
    return <DisplayMemberProfile
      profile={userProfile}
      deleteProfile={deleteProfile}
    />;
  };

  return (
    <div>
      <Navbar />
      <br />
      <h2 className="text-center font-weight-bold" style={{ textAlign: 'center', fontWeight: 'bold', color: '#1D3C8A' }}>Profile</h2>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {profileList()}          </div>

        </div>
      </div>
    </div>
  );
};