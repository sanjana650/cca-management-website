import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { CheckMemberJWTExpiryAndRole } from '../components/RequireAuth'
import MemberDisplayUpdate from '../components/MemberDisplayUpdate'

import axios from 'axios';

export const MemberUpdates = () => {
  CheckMemberJWTExpiryAndRole();
  const [updates, setUpdates] = useState([]);

  const getUpdates = async () => {

    try {
      const response = await axios.get(`http://127.0.0.1:5050/user-updates/view-all-updates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data)
      setUpdates(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUpdates();
  }, []);

  //pass in data for the individual update card
  const updatesList = () => {
    return updates.map((update) => (
      <MemberDisplayUpdate
        key={update._id}
        update={update}
      />
    ));
  };

  return (
    <div>
      <Navbar />
      <br></br>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', color: '#1D3C8A' }}>Updates</h2>
      <br></br>
      <div className="event-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80%', margin: 'auto' }}>
        {updatesList()}
      </div>
    </div>
  );
}


