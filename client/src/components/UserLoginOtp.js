import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from 'axios';
import { Link } from "react-router-dom";


export const UserLoginOtp = () => {
  const [otp, setOtp] = useState("");
  const { email } = useParams(); // Access email from URL parameters

  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const updateOtpForm = (e) => {
    setOtp(e.target?.value || '');
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const otpData = {
      email: email,
      otp: otp,
    };

    try {
      const response = await axios.post('http://localhost:5050/user/verify-login-otp', otpData);

      if (response.data.error) {
        alert(response.data.error); // Display error message if OTP verification fails
      } else {

        //save token to local storage
        const userRole = response.data.token.role;
        console.log(userRole);
        if (userRole === 'user') {
          navigate('/user-home', { replace: true });
        } else if (userRole === 'admin') {
          navigate('/admin-home', { replace: true });
        }
        localStorage.setItem("token", response.data.token);

      }

      console.log(response.data);
    } catch (error) {
      // Handle network or other errors
      console.error('Error during OTP verification:', error.message);
    }
  };



  const navResendLoginOTP = (event) => {
    event.preventDefault();
    navigate('/user-login');
  };

  return (
    <div className="landing-page">
      <div className="background-image" style={{ backgroundImage: `url('https://www.tp.edu.sg/content/dam/tp-web/images/schools---courses/for-prospective-students/all-academic-schools/school-of-informatics---it/information-technology/IIT-t30-tn.jpg')` }}></div>
      <div className="login-container content-box bg-white p-5 rounded text-center">
        <h1>Login Verification OTP</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              className="form-control"
              id='otp'
              value={otp}
              onChange={updateOtpForm}
            />
          </div>
          <div className="row">
            <div className="form-group">
              <input
                type="submit"
                value="Verify"
                className="btn btn-primary"
              />
            </div>
          </div>

          <div>
            <h6>
              <Link onClick={navResendLoginOTP}>
                OTP Expired? Resend Login OTP{' '}
              </Link>
            </h6>
          </div>
        </form>
      </div>
    </div>
  );
};
