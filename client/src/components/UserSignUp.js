import { useState } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';
import { Link } from "react-router-dom";

export const UserSignUp = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    age: "",
    diploma: "",
    about: "",
    password: "",
  });
  const navigate = useNavigate();

  // Update the state properties for the forms every time there is a change
  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    // Check if email and password are filled
    if (!form.email || !form.name || !form.age || !form.diploma || !form.about || !form.password) {
      alert("Please fill in all the fields");
      return;
    }

    const userData = {
      email: form.email,
      name: form.name,
      age: form.age,
      diploma: form.diploma,
      about: form.about,
      password: form.password,
    }

    try {
      const response = await axios.post('http://127.0.0.1:5050/user/signup-and-send-otp', userData);

      // Check if the response contains an error
      if (response.data.error) {
        // Display a more user-friendly message or render it on the page
        alert(`Error: ${response.data.error}`);
        console.log(response.data.error);
      } else {
        // Only navigate if there is no error
        navigate(`/user-signup-otp/${form.email}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Display a more user-friendly message or render it on the page
        alert(`Error: ${error.response.data}`);
      } else {
        console.error('Error during signup request:', error.message);
      }
    }
  }



  const sendOtp = async (event) => {
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
        <form onSubmit={onSubmit}
        >
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
              <Link href="#" onClick={sendOtp}>
                Click Here!
              </Link>
            </h6>
            <h6>
              Already have an account?{' '}
              <Link href="#" onClick={navLogin}>
                Login
              </Link>
            </h6>
          </div>
        </form>
      </div>
    </div>
  );

}
