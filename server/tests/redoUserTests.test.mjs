// import { expect } from 'chai';
// import sinon from 'sinon';
// import { checkUserLoginCred, verifyLoginOTP, sendVerificationOTP, createToken } from "../controller/userController.mjs";
// import { hashData, verifyHashedData } from '../utils/hashData.mjs';
// import User from "../models/userModel.mjs";
// import { sendEmail } from "../utils/sendEmail.mjs";
// import OTPModel from '../models/otpModel.mjs';

// describe('User Controller - Login Functionality', function () {
//   // Stub the sendEmail function to avoid actual email sending
//   const sendEmailStub = sinon.stub(sendEmail);

//   // Stub the hashData function
//   const hashDataStub = sinon.stub(hashData);
//   hashDataStub.callsFake(async () => 'hashedPassword');


//   // Spy on the createToken function
//   const createTokenSpy = sinon.spy(global, 'createToken');

//   // Stub the User.findOne function to simulate database behavior
//   const findOneStub = sinon.stub(User, 'findOne');
//   findOneStub.resolves({
//     _id: 'mockedUserId',
//     email: 'mocked@example.com',
//     role: 'member',
//     password: 'hashedPassword',
//     verified: true,
//   });

//   // Mock the OTPModel.findOne function
//   const otpModelStub = sinon.stub(OTPModel, 'findOne');
//   otpModelStub.resolves({
//     email: 'mocked@example.com',
//   });

//   it('should login and send OTP for valid credentials', async () => {
//     const result = await checkUserLoginCred({
//       email: 'mocked@example.com',
//       password: 'hashedPassword',
//       role: 'member',
//     });

//     // Check if an error is returned
//     if (result.error) {
//       // Handle the error case
//       // Add assertions or log statements as needed
//     } else {
//       // Assertion: Check if the email is returned in the result
//       expect(result).to.deep.equal({ email: 'mocked@example.com' });

//       // Assertion: Check if sendEmail function is called
//       expect(sendEmailStub.calledOnce).to.be.true;

//       // Assertion: Check if createToken function is called
//       expect(createTokenSpy.calledOnce).to.be.true;
//     }
//   });

//   // Add more test cases for different scenarios (invalid credentials, unverified user, etc.)
// });
