import proxyquire from 'proxyquire';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import User from '../models/userModel.mjs';
import OTPModel from '../models/otpModel.mjs';

import { checkUserLoginCred, sendVerificationOTP } from '../controller/userController.mjs';
import { hashData, verifyHashedData } from '../utils/hashData.mjs'
import { sendEmail } from '../utils/sendEmail.mjs';

use(chaiAsPromised);

// chai.use(chaiAsPromised);

//Stub the sendEmail function to avoid actual email sending
// const sendEmailStub = sinon.stub(userController, 'sendEmail');
// const sendVerificationOTPStub = sinon.stub(userController, 'sendVerificationOTP');

// Import the original sendEmail function for spying

describe('User Authentication Functions', () => {
  describe('checkUserLoginCred', () => {
    it('should return an error if email is not found', async () => {
      const findOneStub = sinon.stub(User, 'findOne').resolves(null);
      const result = await checkUserLoginCred({ email: 'nonexistent@example.com', password: 'password', role: 'member' });
      expect(result).to.have.property('error').that.equals('Email not found');
      findOneStub.restore();
    });

    it('should return an error if password is invalid', async () => {
      //Stub the User.findOne function with a user object
      const userWithHashedPassword = {
        email: 'existent@example.com',
        password: await hashData('correctpassword'),
        role: 'member'
      };
      const findOneStub = sinon.stub(User, 'findOne').resolves(userWithHashedPassword);

      try {
        const result = await checkUserLoginCred({ email: 'existent@example.com', password: 'wrongpassword', role: 'member' });
        expect(result).to.have.property('error').that.equals('Invalid password entered');
      } finally {
        //Restore the stubs after the test
        findOneStub.restore();
      }
    });

    it('should return the error account is not verified yet', async () => {
      const userWithUnverifiedAccount = {
        email: 'existent@example.com',
        password: await hashData('correctpassword'),
        verified: false,
        role: 'member'
      }
      const findOneStub = sinon.stub(User, 'findOne').resolves(userWithUnverifiedAccount);
      try {
        const result = await checkUserLoginCred({ email: 'existent@example.com', password: 'correctpassword', role: 'member' });
        expect(result).to.have.property('error').that.equals("Verify your account first before logging in");
      } finally {
        findOneStub.restore();
      }
    })

    it('should return the error that only member can login', async () => {
      const userWithUnverifiedAccount = {
        email: 'existent@example.com',
        password: await hashData('correctpassword'),
        role: 'member'
      }
      const findOneStub = sinon.stub(User, 'findOne').resolves(userWithUnverifiedAccount);
      try {
        const result = await checkUserLoginCred({ email: 'existent@example.com', password: 'correctpassword', role: 'admin' });
        expect(result).to.have.property('error').that.equals("Only members can login");
      } finally {
        findOneStub.restore();
      }
    })

    // it('should return email if login credentials are correct', async () => {
    //   const userWithCorrectCredentials = {
    //     email: 'existent@example.com',
    //     password: await hashData('correctpassword'),
    //     role: 'member',
    //     verified: true,
    //   };

    //   // Stub the findOne method of the User model to resolve with the userWithCorrectCredentials
    //   const findOneStub = sinon.stub(User, 'findOne').resolves(userWithCorrectCredentials);

    //   try {
    //     // Call the function with correct credentials
    //     const result = await checkUserLoginCred({
    //       email: 'existent@example.com',
    //       password: 'correctpassword',
    //       role: 'member',
    //     });

    //     // Expect the result to have the correct email property
    //     expect(result).to.have.property(email).that.equals('existent@example.com');
    //   } finally {
    //     findOneStub.restore();
    //   }
    // });

  });

  

  describe('verifyLoginOTP', () => {
    it('should return an error if OTP verification fails', async () => {
      // Test logic here
    });

    it('should return a valid token if OTP verification succeeds', async () => {
      // Test logic here
    });

    // Add more test cases for different scenarios
  });

  describe('checkAdminLoginCred', () => {
    // Write test cases for checkAdminLoginCred
  });
  // Add more describe blocks for other functions if needed

  afterEach(() => {
    sinon.restore();
  });
});