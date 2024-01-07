import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const MemberDisplayEventCard = ({ event, onJoin, onLeave, userId }) => {
  const { event_image, title, event_type, event_date, event_time, location, max_slots, count, description, members_signedup } = event
  const [showModal, setShowModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    setIsJoined(members_signedup.some(member => member[0] === userId));
  }
  , [members_signedup, userId]
  );

  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    window.location.reload(); 
  };

  const handleJoin = (e) => {
    e.stopPropagation();
    onJoin(event._id);
    console.log('clicked:', event._id)
    
  }

  const handleLeave = (e) => {
    e.stopPropagation();
    onLeave(event._id);
    console.log('leave clicked:', event._id)
  }

  const buttonVariant = isJoined ? "danger" : "primary";
  const buttonText = isJoined ? "Leave" : "Join";



  return (
    <div className="col-sm-8" style={{
      backgroundColor: "#F3F6FF",
      alignItems: "center",
      padding: "15px",
      position: "relative",
      width: "100%",
      maxWidth: "900px",
      margin: "auto",
      marginBottom: "20px",
      cursor: "pointer",
    }}
      onClick={handleOpen}
    >
      <div className="row">
        <div className="col-md-2" style={{ maxWidth: "200px", marginRight: '120px' }}>
          <div
            className="overflow-hidden mx-auto"
            style={{ width: "255px", height: "210px" }}
          >
            <img
              src={`data:image/png;base64,${event_image}`}
              alt="image"
              className="img-fluid "
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="col-md-8">
          <div>
            <h5>{title}</h5>
            <p>Date: {event_date}</p>
            <p>Time: {event_time}</p>
            <p>Location: {location}</p>
            <p><strong>Slots left: {count}/{max_slots}</strong></p>
          </div>
          <div style={{ position: "absolute", bottom: 15, right: 20 }}>
            <Button variant={buttonVariant} onClick={isJoined ? handleLeave : handleJoin}>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className=" overflow-hidden mx-auto" style={{ width: '150px', height: '150px' }}>
              <img
                src={`data:image/png;base64,${event_image}`}
                alt="Profile"
                className="img-fluid "
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h5>{title}</h5>
              <p>Event Type: {event_type}</p>
              <p>Date: {event_date}</p>
              <p>Time: {event_time}</p>
              <p>Location: {location}</p>
              <p><strong>Slots left: {count}/{max_slots}</strong></p>
              <p>Description: {description}</p>
            </div>
          </div>
        </Modal.Body>

      </Modal>

    </div>

  )
}

export default MemberDisplayEventCard;
