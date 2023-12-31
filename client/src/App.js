import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { LandingPage } from "./pages/LandingPage";
import { UserLogin } from "./pages/UserLogin";
import { UserLoginOtp } from "./pages/UserLoginOtp";
import { UserHome } from "./pages/UserHome";
import { UserSignUp } from "./pages/UserSignUp";
import { UserSignupOtp } from "./pages/UserSignupOtp";
import { UserSignupResendOTP } from "./pages/UserSignupResendOtp";
import { AdminHome } from "./pages/AdminHome";
import { UserProfile } from "./pages/UserProfile";
import { MemberUpdates } from "./pages/MemberUpdates";
import { AdminUpdates } from "./pages/AdminUpdates";
import { EditUserProfile } from "./pages/EditUserProfile";

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

        <Route exact path="/admin-home" element={<AdminHome />} />
        <Route exact path="/admin-updates" element={<AdminUpdates />} />


        <Route exact path="/user-home" element={<UserHome />} />
        <Route exact path="/user-profile" element={<UserProfile />} />
        <Route exact path="/edit-user-profile" element={<EditUserProfile />} />
        <Route exact path="/user-updates" element={<MemberUpdates />} />


      </Routes>
    </div>
  );
}

export default App;
