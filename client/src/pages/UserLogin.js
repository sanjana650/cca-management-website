import { useState } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

export const UserLogin = () => {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false); //state to track whether it's admin login
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    // Check if email and password are filled
    if (!form.email || !form.password) {
      alert("Please fill in both email and password");
      return;
    }

    const role = isAdmin ? 'admin' : 'member'; //assign 'admin' if isAdmin is true, 'member' otherwise

    const userData = {
      email: form.email,
      password: form.password,
      role,
    };

    let response;

    try {
      if (isAdmin) {

        response = await axios.post(
          "http://127.0.0.1:5050/user/admin-login-and-send-otp",
          userData
        );

        //check specific error messages
        if (response.data.error) {
          // if (response.data.error === "Invalid password entered") {
         
          alert('Error: '+response.data.error)
        } else if (!response.data.login_verified) {
          // if login_verified is false, redirect to '/user-login-otp'
          navigate(`/user-login-otp/${form.email}`);

        } else {
          // Redirect to another route or perform other actions
          navigate("/");
        }
      } else {
        // If it's user/member login, execute user/member login logic
        response = await axios.post(
          "http://127.0.0.1:5050/user/login-and-send-otp",
          userData
        );

        // Check specific error messages
        if (response.data.error) {
          alert('Error: '+response.data.error)
        } else if (!response.data.login_verified) {
          // if login_verified is false, redirect to '/user-login-otp'
          navigate(`/user-login-otp/${form.email}`);
        } else {
          // Redirect to another route or perform other actions
          navigate("/");
        }
      }

    } catch (error) {
      console.error('Error during login request:', error.message);
    }
  };

  const navSignUp = (event) => {
    event.preventDefault();
    navigate('/user-signup');
  };

  const handleToggle = () => {
    // Toggle between "Member" and "Admin" login
    setIsAdmin((prevIsAdmin) => !prevIsAdmin);
  };

  return (
    <div className="landing-page">
      <div className="background-image" style={{ backgroundImage: `url('https://www.tp.edu.sg/content/dam/tp-web/images/schools---courses/for-prospective-students/all-academic-schools/school-of-informatics---it/information-technology/IIT-t30-tn.jpg')` }}></div>
      <div className="login-container content-box bg-white p-5 rounded text-center">
        <h1>{isAdmin ? "Admin Login" : "Member Login"}</h1>
        <form onSubmit={onSubmit}>
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
                value={isAdmin ? "Admin Login" : "Member Login"}
                className="btn btn-primary"
              />
            </div>
          </div>
          <div>
            <h6>
              Don't have an account? Sign Up Here!{' '}
              <Link onClick={navSignUp}>
                Click Here!
              </Link>
            </h6>
          </div>
        </form>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={handleToggle}
            />{" "}
            {isAdmin ? "Member Login" : "Admin Login"}
          </label>
        </div>
      </div>
    </div>
  );
};
