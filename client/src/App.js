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
import { AdminEvents } from "./pages/AdminEvents";
import { AdminUpdates } from "./pages/AdminUpdates";
import { AdminMember } from "./pages/AdminMember";
import { AdminViewSelectedEvent } from "./pages/AdminViewSelectedEvent";
import { AdminEditEvent } from "./pages/AdminEditEvent";
import { AdminAddEvents } from "./pages/AdminCreateEvent"

import { EditUserProfile } from "./pages/EditUserProfile";
import { UserMember } from "./pages/UserMember";
import { UserProfile } from "./pages/UserProfile";
import { MemberUpdates } from "./pages/MemberUpdates";
import { UserEvents } from "./pages/UserEvents";

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

        <Route exact path="/admin-events" element={<AdminEvents />} />
        <Route exact path="/admin-updates" element={<AdminUpdates />} />
        <Route exact path="/admin-members" element={<AdminMember />} />
        <Route exact path="/admin-view-selected-event/:id" element={<AdminViewSelectedEvent />} />
        <Route exact path="/admin-edit-event/:id" element={<AdminEditEvent />} />
        <Route exact path="/admin-add-event" element={<AdminAddEvents />} />


        <Route exact path="/user-home" element={<UserHome />} />
        <Route exact path="/user-profile" element={<UserProfile />} />
        <Route exact path="/edit-user-profile" element={<EditUserProfile />} />
        <Route exact path="/user-updates" element={<MemberUpdates />} />
        <Route exact path="/user-view-members" element={<UserMember />} />
        <Route exact path="/user-events" element={<UserEvents />} />


      </Routes>
    </div>
  );
}

export default App;
