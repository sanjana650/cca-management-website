import React from "react";
import { Link } from "react-router-dom";

const DisplayEventCard = ({ event }) => {
  const { event_image, title, event_type, event_date, event_time, location, max_slots, count, description, members_signedup } = event

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
    }}>
      <div className="row">
        <div className="col-md-2" style={{ maxWidth: "200px",marginRight:'120px' }}>
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
            <p>{event_type}</p>
            <p>Date: {event_date}</p>
            <p>Time: {event_time}</p>
            <p>Location: {location}</p>
            <p><strong>Slots left: {count}/{max_slots}</strong></p>
          </div>
          <div style={{ position: "absolute", bottom: 15, right: 20 }}>
            <Link to={`/admin-view-selected-event/${event._id}`}>View More</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplayEventCard;
