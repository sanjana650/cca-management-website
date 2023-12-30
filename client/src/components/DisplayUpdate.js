import React from "react";
import deleteIcon from "../images/updateDelete.png";
import editIcon from "../images/updateEdit.png";

//displays individual update card
const DisplayUpdate = ({ update, onDelete, onEdit }) => {
  const { content, date_posted } = update;


  return (
    <div className='col-sm-8' style={{ backgroundColor: '#FFEFB3', alignItems: 'center', padding: '15px', position: 'relative', width: '100%', maxWidth: '900px', margin: 'auto', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
        <img src={editIcon} alt="Edit" style={{ marginRight: '10px', width: '25px', height: '25px', cursor: 'pointer' }} onClick={onEdit} />
        <img src={deleteIcon} alt="Delete" style={{ width: '25px', height: '25px', cursor: 'pointer' }} onClick={onDelete} />
      </div>
      <div style={{ marginTop: '15px', wordWrap: 'break-word', zIndex: 1, fontSize: '16px', fontWeight: 'bold' }}>
        <p style={{ width: '100%' }}>{content}</p>
      </div>
      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        <p>Date Posted: {date_posted}</p>
      </div>
    </div>
  );
};

export default DisplayUpdate;
