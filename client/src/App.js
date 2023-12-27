import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { LandingPage } from "./components/LandingPage";
import { UserLogin } from "./components/UserLogin";
import { UserLoginOtp } from "./components/UserLoginOtp";
import { UserHome } from "./components/UserHome";
import { UserSignUp } from "./components/UserSignUp";
import { UserSignupOtp } from "./components/UserSignupOtp";
import { UserSignupResendOTP } from "./components/UserSignupResendOtp";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/user-login" element={<UserLogin />} />
        <Route exact path="/user-login-otp/:email" element={<UserLoginOtp />} />
        <Route exact path="/user-signup" element={<UserSignUp />} />
        <Route path="/user-signup-otp/:email" element={<UserSignupOtp />} />

        <Route exact path="/user-resend-signup-otp" element={<UserSignupResendOTP />} />


        <Route exact path="/user-home" element={<UserHome />} />

      </Routes>
    </div>
  );
}

export default App;
