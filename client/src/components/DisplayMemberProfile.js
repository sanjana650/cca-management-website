import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const DisplayMemberProfile = ({ profile, deleteProfile }) => {
  const navigate = useNavigate();

  if (!profile) {
    return <div>Loading...</div>;
  }

  const { _id, profile_pic, email, name, age, diploma, about } = profile;

  const handleDelete = async () => {
    // console.log('Deleting profile...');
    deleteProfile(_id);
    // console.log('Profile deleted successfully!');
    navigate('/');
  };

  const handleEdit = () => {
    // Navigate to the edit-user-profile page
    navigate('/edit-user-profile');
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-4 text-center">
          <div className="rounded-circle overflow-hidden mx-auto" style={{ width: '150px', height: '150px' }}>
            <img src={`data:image/png;base64,${profile_pic}`} alt="Profile" className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div className="col-md-8">
          <form>
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">Email</label>
              <input type="email" className="form-control" id="inputEmail" defaultValue={email} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="inputName" className="form-label">Name</label>
              <input type="text" className="form-control" id="inputName" defaultValue={name} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="inputAge" className="form-label">Age</label>
              <input type="text" className="form-control" id="inputAge" defaultValue={age} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="inputDiploma" className="form-label">Diploma</label>
              <input type="text" className="form-control" id="inputDiploma" defaultValue={diploma} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="inputAbout" className="form-label">About</label>
              <textarea className="form-control" id="inputAbout" rows="3" defaultValue={about} readOnly></textarea>
            </div>

            {/* Edit and Delete Buttons */}
            <div className="d-flex justify-content-end">
              <button
                className="customButton"
                style={{ backgroundColor: "#BB2525", borderRadius: '10px', marginRight: '10px' }}
                onClick={handleDelete}
              >
                Delete Profile
              </button>
              <button
                className="customButton"
                style={{ backgroundColor: "#1D3C8A", borderRadius: '10px' }}
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisplayMemberProfile;
