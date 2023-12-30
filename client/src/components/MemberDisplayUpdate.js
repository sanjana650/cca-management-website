import React from "react";

//displays individual update card
const MemberDisplayUpdate = ({ update }) => {
  const { content, date_posted } = update;


  return (
    <div className='col-sm-8' style={{ backgroundColor: '#FFEFB3', alignItems: 'center', padding: '15px', position: 'relative', width: '100%', maxWidth: '900px', margin: 'auto', marginBottom: '20px' }}>

      <div style={{ marginTop: '15px', wordWrap: 'break-word', zIndex: 1, fontSize: '16px', fontWeight: 'bold' }}>
        <p style={{ width: '100%' }}>{content}</p>
      </div>
      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        <p>Date Posted: {date_posted}</p>
      </div>
    </div>
  );
};

export default MemberDisplayUpdate;
