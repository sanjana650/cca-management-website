import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDisplayUser = ({ member, deleteMember }) => {
  const { profile_pic, email, name, age, diploma, about, role } = member;
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    window.location.reload(); // Reload the page
  };

  const handleDeleteClick = (e) => {
    // Prevent the click event from propagating to the parent container
    //e.stopPropagation();
    deleteMember();
  };

  return (
    <div
      className="col-sm-3"
      style={{
        backgroundColor: "#F3F6FF",
        alignItems: "center",
        padding: "15px",
        position: "relative",
        width: "100%",
        maxWidth: "900px",
        margin: "auto",
        marginBottom: "20px",
        borderRadius: "25px",
        cursor: "pointer",
      }}
      onClick={handleOpen}
    >
      <div className="row">
        <div className="col-md-2" >
          <div
            className="rounded-circle overflow-hidden mx-auto"
            style={{ width: "80px", height: "80px", marginRight: '10px' }}
          >
            <img
              src={`data:image/png;base64,${profile_pic}`}
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="col-md-8">
          <div>
            <h5>{name}</h5>
            <p>Age: {age}</p>
          </div>
        </div>
        <div className="col-md-2">
          <button
            style={{ cursor: 'pointer' }}
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Member Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="rounded-circle overflow-hidden mx-auto" style={{ width: '150px', height: '150px' }}>
              <img
                src={`data:image/png;base64,${profile_pic}`}
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Age:</strong> {age}</p>
              <p><strong>Diploma:</strong> {diploma}</p>
              <p><strong>About:</strong> {about}</p>
              <p><strong>Role:</strong> {role}</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDisplayUser;
