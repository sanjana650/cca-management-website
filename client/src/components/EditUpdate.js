import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';


// Purpose:This component provides a modal for editing an update.
// Props:
// isOpen: Boolean indicating whether the modal is open or closed.
// onClose: Callback function to handle modal close.
// update: Object containing information about the update to be edited.
// onUpdateSuccess: Callback function to handle a successful update.

const EditUpdate = ({ isOpen, onClose, update, onUpdateSuccess }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    //get the previous data
    const getUpdateInfo = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5050/admin-updates/view-selected-update/${update._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status >= 200 && response.status < 300) {
          const contentType = response.headers['content-type'];

          if (contentType && contentType.includes('application/json')) {
            const updateData = response.data; 
            if (updateData) {
              setContent(updateData.content);
            }
          } else {
            setContent(response.data); 
          }
        } else {
          console.error(`An error has occurred: ${response.statusText}`);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    //if the modal is open and the update is provided fetch update info
    if (isOpen && update) {
      getUpdateInfo();
    }
  }, [isOpen, update]);

  //actually edit the content & close the modal when its edited
  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:5050/admin-updates/edit-update/${update._id}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} >
      <Modal.Header closeButton style={{backgroundColor:'#FFEFB3'}}>
        <Modal.Title>Edit Update</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{backgroundColor:'#FFE7C2'}}>
        <Form.Group controlId="updateContent" >
          <Form.Label>Update Content</Form.Label>
          <Form.Control as="textarea" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer style={{backgroundColor:'#FFEFB3'}}>

        <Button variant="primary" onClick={handleUpdate} style={{backgroundColor:'#1D3C8A'}}>
          Save Changes
        </Button>
      </Modal.Footer >
    </Modal>
  );
};

export default EditUpdate;
