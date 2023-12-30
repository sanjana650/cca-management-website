import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddUpdate = ({ isOpen, onClose, onUpdateSuccess }) => {
  const [content, setContent] = useState('');

  // function to post update
  const addUpdate = async () => {
    console.log({ content });
    try {
      const response = await axios.post(
        `http://127.0.0.1:5050/admin-updates/add-updates`,
        { content: content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        onUpdateSuccess();
        onClose();
        // Reset content after successful update
        setContent('');
      } else {
        console.error(`An error has occurred: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  };


  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton style={{ backgroundColor: '#FFEFB3' }}>
        <Modal.Title>Add New Update</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#FFE7C2' }}>
        <Form.Group controlId="updateContent">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#FFEFB3' }}>
        <Button
          variant="primary"
          onClick={addUpdate}
          style={{ backgroundColor: '#1D3C8A' }}
        >
          Add Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddUpdate;
