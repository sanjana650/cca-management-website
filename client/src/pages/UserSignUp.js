import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';
import { Link } from "react-router-dom";
import imageCompression from 'browser-image-compression';

export const UserSignUp = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    age: "",
    diploma: "",
    about: "",
    password: "",
  });



  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //Update the state properties for the forms every time there is a change
  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        const compressedImage = await imageCompression(file, {
          quality: 0.6,
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error.message);
      }
    }
  };

  //Handle image selection and convert to base64 url
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedImage = await imageCompression(file, {
          quality: 0.6, //Quality of img
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error.message);
      }
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.name || !form.age || !form.diploma || !form.about || !form.password) {
      alert("Please fill in all the fields");
      return;
    }

    if (!selectedImage) {
      alert("Please add a profile picture");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    //Convert the base64-encoded image to a data URL
    const imageDataUrl = selectedImage ? selectedImage.split(",")[1] : null;

    const userData = {
      profile_pic: imageDataUrl,
      email: form.email,
      name: form.name,
      age: form.age,
      diploma: form.diploma,
      about: form.about,
      password: form.password,
    };

    try {
      setLoading(true);

      const response = await axios.post('http://127.0.0.1:5050/user/signup-and-send-otp', userData);

      if (response.data.error) {
        alert(`Error: ${response.data.error}`);
        console.log(response.data.error);
      } else {
        navigate(`/user-signup-otp/${form.email}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(`Error: ${error.response.data}`);
      } else {
        console.error('Error during signup request:', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const sendOtp = (event) => {
    event.preventDefault();
    navigate('/user-resend-signup-otp');
  }

  const navLogin = (event) => {
    event.preventDefault();
    navigate('/user-login');
  };

  return (
    <div className="landing-page">
      <div className="background-image" style={{ backgroundImage: `url('https://www.tp.edu.sg/content/dam/tp-web/images/schools---courses/for-prospective-students/all-academic-schools/school-of-informatics---it/information-technology/IIT-t30-tn.jpg')` }}></div>
      <div className="login-container content-box bg-white p-5 rounded text-center">
        <h1>Member Sign Up</h1>
        {/* Drag and Drop Image Upload Section */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ cursor: 'pointer' }}
        >
          <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: '100px', height: '100px', border: '2px solid #007bff' }}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img
                src="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                alt="Placeholder"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
          <p>Drag and drop an image or click upload image</p>
        </div>
        {/* Image Upload Section */}
        <div>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <div className="text-center">
 
          </div>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById('image').click()}
          >
            Upload Image
          </button>
        </div>

        {/* Form Section */}
        <form role="form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id='email'
              value={form.email}
              onChange={(e) => updateForm({ email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id='name'
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              className="form-control"
              id='age'
              value={form.age}
              onChange={(e) => updateForm({ age: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="diploma">Diploma</label>
            <input
              type="text"
              className="form-control"
              id='diploma'
              value={form.diploma}
              onChange={(e) => updateForm({ diploma: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="about">About</label>
            <input
              type="text"
              className="form-control"
              id='about'
              value={form.about}
              onChange={(e) => updateForm({ about: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id='password'
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
            />
          </div>
          <div className="row">
            <div className="form-group">
              <input
                type="submit"
                value="Register"
                className="btn btn-primary"
              />
            </div>
          </div>
          <div>
            <h6>
              Already Signed up but need to verify account?{' '}
              <Link to="#" onClick={sendOtp}>
                Click Here!
              </Link>
            </h6>
            <h6>
              Already have an account?{' '}
              <Link to="#" onClick={navLogin}>
                Login
              </Link>
            </h6>
          </div>
        </form>
        {/* Loading Indicator */}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};
