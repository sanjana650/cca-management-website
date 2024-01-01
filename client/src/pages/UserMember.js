import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import axios from 'axios';
import MemberDisplayUser from '../components/MemberDisplayUser';  // Make sure this import is correct
import { UseRequireAuth } from '../components/RequireAuth'


export const UserMember = () => {
  UseRequireAuth();

  //get members
  const [members, setMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState('');

  const getMembers = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5050/user-members/view-all-members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data)
      setMembers(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === '') {
        // If the search query is empty, fetch all members
        getMembers();
      } else {
        const response = await axios.get(`http://127.0.0.1:5050/user-members/search-member/${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMembers(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };


  const membersList = () => {
    // Check if members is an array before calling map
    if (Array.isArray(members)) {
      return members.map((member) => (
        <MemberDisplayUser
          key={member._id}
          member={member}
        />
      ));
    } else {
      // Handle the case where members is not an array (e.g., error response)
      return <p>No members found.</p>;
    }
  };


  return (
    <div>
      <Navbar />
      <br />
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', color: '#1D3C8A' }}>Updates</h2>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search member by name"
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
          </div>
        </div>
      </div>
      <br />

      <div className="member-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80%', margin: 'auto' }}>
        {membersList()}
      </div>
    </div>
  );
};