import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from 'axios';
import { Link } from "react-router-dom";

export const UserSignupOtp = () => {

  const [form, setForm] = useState({
    otp: ""
  });
  const { email } = useParams(); // Access email from URL parameters
  // const decodedEmail = decodeURIComponent(email);

  console.log(email);

  const navigate = useNavigate();

  // Update the state properties for the forms every time there is a change
  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    const otpData = {
      email: email, // Access email from location state
      otp: form.otp,
    };

    try {
      const response = await axios.post(`http://127.0.0.1:5050/user/verify-signup-otp`, otpData);

      if (response.data.error) {
        alert(response.data.error); // Display error message if OTP verification fails
      } else {
        // OTP verification succeeded, navigate to the user's home page
        navigate('/user-login');
      }

      console.log(response.data);
    } catch (error) {
      // Handle network or other errors
      console.error('Error during OTP verification:', error.message);
    }
  };

  const navResendSignupOTP = async (event) => {
    event.preventDefault();
    navigate('/user-resend-signup-otp');

  }

  return (
    <div className="landing-page">
      <div className="background-image" style={{ backgroundImage: `url('https://www.tp.edu.sg/content/dam/tp-web/images/schools---courses/for-prospective-students/all-academic-schools/school-of-informatics---it/information-technology/IIT-t30-tn.jpg')` }}></div>
      <div className="login-container content-box bg-white p-5 rounded text-center">
        <h1>Verify OTP for Sign Up</h1>
        <form
          onSubmit={onSubmit}
        >
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              className="form-control"
              id='otp'
              value={form.otp}
              onChange={(e) => updateForm({ otp: e.target.value })}
            />
          </div>

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
              Need to Resend OTP?{' '}
              {<Link onClick={navResendSignupOTP}>
                Click Here!
              </Link>}
            </h6>

          </div>
        </form>
      </div>
    </div>

  )

}