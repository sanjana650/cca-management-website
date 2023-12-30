import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import SideNavbar from "../components/AdminNavbar";
import DisplayUpdate from "../components/DisplayUpdate";
import EditUpdate from "../components/EditUpdate";
import AddUpdate from "../components/AddUpdate";

import axios from 'axios';
import { UseRequireAuth } from '../components/RequireAuth';
import 'bootstrap/dist/css/bootstrap.min.css';

export const AdminUpdates = () => {
  UseRequireAuth();

  const [updates, setUpdates] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false); // Define setAddModalOpen here
  const [selectedUpdate, setSelectedUpdate] = useState(null);


  const getUpdates = async () => {
    
    try {
      const response = await axios.get(`http://127.0.0.1:5050/admin-updates/view-all-updates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // console.log(response.data)
      setUpdates(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUpdates();
  });

  //delete update by id
  const deleteUpdate = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5050/admin-updates/delete-update/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      //filter out deleted update from the state
      const newUpdates = updates.filter((el) => el._id !== id);
      setUpdates(newUpdates);
    } catch (error) {
      console.error(error.message);
    }
  }

  //function to open modal
  const openEditModal = (update) => {
    setSelectedUpdate(update);
    setEditModalOpen(true);
  };

  //function to close modal
  const closeEditModal = () => {
    setSelectedUpdate(null);
    setEditModalOpen(false);
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };


  //function to handle successfull update & fetch updates after the changes
  const handleUpdateSuccess = () => {
    getUpdates();
  };

  //pass in data for the individual update card
  const updatesList = () => {
    return updates.map((update) => (
      <DisplayUpdate
        key={update._id}
        update={update}
        onDelete={() => deleteUpdate(update._id)}
        onEdit={() => openEditModal(update)}
      />
    ));
  };

  return (
    <div className="d-flex position-relative">
      <SideNavbar />
      <div className="flex-grow-1 admin-updates-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <br />
        <h2 style={{ textAlign: 'center' }}>View Updates</h2>
        <br />
        <div className="event-content" style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
          {updatesList()}
        </div>
        <EditUpdate isOpen={editModalOpen} onClose={closeEditModal} update={selectedUpdate} onUpdateSuccess={handleUpdateSuccess} />
        {/* Floating button */}
        <div
          className="position-fixed bottom-0 end-0 m-4"
          style={{ zIndex: 1000 }}
        >
          <button className="btn btn-primary rounded-circle btn-circle btn-lg" style={{ backgroundColor: '#22ACA7' }} onClick={() => openAddModal()}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        {/* AddUpdate modal */}
        <AddUpdate isOpen={addModalOpen} onClose={closeAddModal} onUpdateSuccess={handleUpdateSuccess} />
      </div>
    </div>
  );
};