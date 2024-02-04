import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { UserLogin } from '../pages/UserLogin';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { UserLoginOtp } from '../pages/UserLoginOtp';
import { UserSignUp } from '../pages/UserSignUp';
import { UserSignupOtp } from '../pages/UserSignupOtp';
import { UserSignupResendOTP } from "../pages/UserSignupResendOtp";
import { UserResetPassword } from '../pages/UserResetPassword';
import { UserSendResetPasswordOTP } from '../pages/UserSendResetPasswordOtp'

test('should check if the LandingPage component renders', () => {
  render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );

  expect(screen.getByText(/Information Technology Interest Group/i)).toBeInTheDocument();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
  expect(screen.getByText(/Register/i)).toBeInTheDocument();
});

test('should check if the page renders', () => {
  render(
    <BrowserRouter>
      <UserLogin />
    </BrowserRouter>
  );

  expect(screen.getByText(/Email/i)).toBeInTheDocument();
});

test('should check if the UserLoginOtp page renders', () => {
  render(
    <BrowserRouter>
      <UserLoginOtp />
    </BrowserRouter>
  );

  expect(screen.getByText(/Login Verification OTP/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/OTP/i)).toBeInTheDocument();
  expect(screen.getByText(/Verify/i)).toBeInTheDocument();
  expect(screen.getByText(/OTP Expired\? Resend Login OTP/i)).toBeInTheDocument();
});

test('should check if the UserSignUp page renders', () => {
  render(
    <BrowserRouter>
      <UserSignUp />
    </BrowserRouter>
  );

  expect(screen.getByText(/Member Sign Up/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Diploma/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/About/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Already Signed up but need to verify account\?/i)).toBeInTheDocument();
  expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
});

test('should check if the UserSignupOtp page renders', () => {
  render(
    <BrowserRouter>
      <UserSignupOtp />
    </BrowserRouter>
  );

  expect(screen.getByText(/Verify OTP for Sign Up/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/OTP/i)).toBeInTheDocument();
  expect(screen.getByText(/Need to Resend OTP\?/i)).toBeInTheDocument();
});

test('should check if the UserSignupResendOTP page renders', () => {
  render(
    <BrowserRouter>
      <UserSignupResendOTP />
    </BrowserRouter>
  );

  expect(screen.getByText(/Resend OTP for Sign Up/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByText(/Need to Sign Up\?/i)).toBeInTheDocument();
});

test('should check if the UserResetPassword page renders', () => {
  render(
    <BrowserRouter>
      <UserResetPassword />
    </BrowserRouter>
  );

  expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/OTP/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Need to Resend OTP\?/i)).toBeInTheDocument();
});

test('should check if the UserSendResetPasswordOTP page renders', () => {
  render(
    <BrowserRouter>
      <UserSendResetPasswordOTP />
    </BrowserRouter>
  );

  expect(screen.getByText(/Send OTP To Reset Password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByText(/Need to Login\?/i)).toBeInTheDocument();
});





