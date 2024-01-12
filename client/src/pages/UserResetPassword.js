import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from 'axios';
import { Link } from "react-router-dom";

export const UserResetPassword = () => {
  const [form, setForm] = useState({
    otp: "",
    password: ""
  });
  const { email } = useParams();
  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    const resetPasswordData = {
      otp: form.otp,
      email: email,
      password: form.password
    };

    try {
      const response = await axios.post(`http://127.0.0.1:5050/user/verify-otp-reset-password`, resetPasswordData);

      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert('Password successfully changed! Please login.')
        //OTP verification succeeded, navigate to to login page
        navigate('/user-login');
      }

      console.log(response.data);
    } catch (error) {
      // Handle network or other errors
      console.error('Error during OTP verification:', error.message);
    }
  };

  const navResendResetPasswordOTP = async (event) => {
    event.preventDefault();
    navigate('/user-send-reset-password-otp');

  }

  return (
    <div className="landing-page">
      <div className="background-image" style={{ backgroundImage: `url('https://www.tp.edu.sg/content/dam/tp-web/images/schools---courses/for-prospective-students/all-academic-schools/school-of-informatics---it/information-technology/IIT-t30-tn.jpg')` }}></div>
      <div className="login-container content-box bg-white p-5 rounded text-center">
        <h1>Reset Password</h1>
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
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
                value="Next"
                className="btn btn-primary"
              />
            </div>
          </div>
          <div>
            <h6>
              Need to Resend OTP?{' '}
              {<Link onClick={navResendResetPasswordOTP}>
                Click Here!
              </Link>}
            </h6>

          </div>
        </form>
      </div>
    </div>

  )


}