import { useState } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';
import { Link } from "react-router-dom";

export const UserSendResetPasswordOTP = () => {
  const [form, setForm] = useState({
    email: ""
  });
  const navigate = useNavigate();

  // Update the state properties for the forms every time there is a change
  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }


  const onSubmit = async (event) => {
    event.preventDefault();
    // Check if email is filled
    if (!form.email) {
      alert("Please fill in the email field");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5050/user/send-otp-reset-password', {
        email: form.email
      });

      // Check if the response contains an error
      if (response.data.error) {
        alert(response.data.error);
      } else {
        // Only navigate if there is no error
        navigate(`/user-reset-password/${form.email}`, { replace: true });
      }
    } catch (error) {
      console.error('Error during login request:', error.message);
    }
  }




  return (
    <div className="landing-page">
      <div className="background-image" style={{ backgroundImage: `url('https://www.tp.edu.sg/content/dam/tp-web/images/schools---courses/for-prospective-students/all-academic-schools/school-of-informatics---it/information-technology/IIT-t30-tn.jpg')` }}></div>
      <div className="login-container content-box bg-white p-5 rounded text-center">
        <h1>Send OTP To Reset Password</h1>
        <form
          onSubmit={onSubmit}
        >
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <br />

            <input
              type="email"
              className="form-control"
              id='email'
              value={form.email}
              onChange={(e) => updateForm({ email: e.target.value })}
            />
          </div>
          <br />
          <div className="row">
            <div className="form-group">
              <input
                type="submit"
                value="Next"
                className="btn btn-primary"
              />
            </div>
          </div>
          <div>
            <h6>
              Need to Login?{' '}
              <Link to="/user-login">
                Click Here!
              </Link>

            </h6>

          </div>
        </form>
      </div>
    </div>

  )

}