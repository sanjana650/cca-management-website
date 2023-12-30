import React from 'react';
import axios from 'axios';

const DisplayMemberProfile = ({ profile }) => {
  if (!profile) {
    return <div>Loading...</div>; // Add a loading state or handle it accordingly
  }

  const { profile_pic, email, name, age, diploma, about } = profile;

  return (
    <div className="container">
      <div className="row mt-5">
        {/* Profile Picture Section */}
        <div className="col-md-4 text-center">
          <div className="rounded-circle overflow-hidden mx-auto" style={{ width: '150px', height: '150px' }}>
            {/* Display your profile picture here */}
            <img src={`data:image/png;base64,${profile_pic}`} alt="Profile" className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <button className="btn btn-primary mt-3">Change Image</button>
        </div>

        {/* Profile Details Section */}
        <div className="col-md-8">
          <form>
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">Email</label>
              <input type="email" className="form-control" id="inputEmail" value={email} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="inputName" className="form-label">Name</label>
              <input type="text" className="form-control" id="inputName" value={name} />
            </div>
            <div className="mb-3">
              <label htmlFor="inputAge" className="form-label">Age</label>
              <input type="text" className="form-control" id="inputAge" value={age} />
            </div>
            <div className="mb-3">
              <label htmlFor="inputDiploma" className="form-label">Diploma</label>
              <input type="text" className="form-control" id="inputDiploma" value={diploma}  />
            </div>
            <div className="mb-3">
              <label htmlFor="inputAbout" className="form-label">About</label>
              <textarea className="form-control" id="inputAbout" rows="3" value={about} ></textarea>
            </div>

            {/* Edit and Delete Buttons */}
            <div className="d-flex justify-content-end">
              <button className="customButton" style={{ backgroundColor: "#BB2525", borderRadius: '10px', marginRight: '10px' }}>Delete Profile</button>
              <button className="customButton" style={{ backgroundColor: "#1D3C8A", borderRadius: '10px' }}>Edit Profile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisplayMemberProfile;
