import React, { useState, useEffect } from 'react';
import AdminNavbar from "../components/AdminNavbar";
import axios from 'axios';
import AdminDisplayUser from '../components/AdminDisplayUser';
import { UseRequireAuth } from '../components/RequireAuth'

export const AdminMember = () => {
  UseRequireAuth();
  const [members, setMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  //add logic to redirect them back to landing page if they attempt to enter this page w/o logging in

  const getMembers = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5050/admin-members/view-all-members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMembers(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  const handleSearch = async () => {
    console.log(searchQuery)
    try {
      if (searchQuery.trim() === '') {
        // If the search query is empty, fetch all members
        getMembers();
      } else {
        const response = await axios.get(`http://127.0.0.1:5050/admin-members/search-member/${searchQuery}`, {
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

  const allMembers = async () => {
    setSearchQuery(''); //clear search query
    getMembers();
  }

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:5050/admin-members/delete-member/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      //fetch updates member list after deleting
      getMembers();
    } catch (error) {
      console.error(error.message);
    }
  }


  const membersList = () => {
    // Check if members is an array before calling map
    if (Array.isArray(members)) {
      return members.map((member) => (
        <AdminDisplayUser
          key={member._id}
          member={member}
          deleteMember={() => handleDelete(member._id)}
        />
      ));
    } else {
      // Handle the case where members is not an array (e.g., error response)
      return <p>No members found.</p>;
    }
  };

  return (
    <div className="d-flex position-relative">
      <AdminNavbar />
      <div className="flex-grow-1 admin-updates-content" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <br />
        <h2 style={{ textAlign: 'center', fontWeight: 'bold', color: '#1D3C8A' }}>Members</h2>
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
              <button className="btn btn-outline-secondary" type="button" style={{ marginTop: '10px' }} onClick={allMembers}>
                All Members
              </button>
            </div>
          </div>
        </div>
        <br />
        <div className="member-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80%', margin: 'auto' }}>
          {membersList()}
        </div>
      </div>
    </div>
  );
};