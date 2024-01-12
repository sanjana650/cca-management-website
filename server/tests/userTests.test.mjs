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

// Stub the sendEmail function to avoid actual email sending
const sendEmailStub = sinon.stub();

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


    it('should return email if login credentials are correct', async () => {
      const userWithCorrectCredentials = {
        email: 'existent@gmail.com',
        password: await hashData('correctpassword'),
        role: 'member',
        verified: true,
      };

      // Stub the findOne method of the User model to resolve with the userWithCorrectCredentials
      const findOneStub = sinon.stub(User, 'findOne').resolves(userWithCorrectCredentials);

      // Stub the findOne method of the OTP model to resolve with a fake OTP record
      const fakeOTPObj = {
        email: 'existent@gmail.com',
        otp: '1234', // Replace with the actual OTP value
        createdAt: new Date(),
        expiresAt: new Date(),
      };
      const findOneOTPSStub = sinon.stub(OTPModel, 'findOne').resolves(null);

      // Stub the sendEmail function to resolve with success message
      sendEmailStub.returns('Email sent successfully');

      try {
        // Call the function with correct credentials
        const result = await checkUserLoginCred({
          email: 'existent@gmail.com',
          password: 'correctpassword',
          role: 'member',
        });

        // Expect the result to have the correct email property
        expect(result).to.have.property('email').that.equals('existent@gmail.com');

        // Log the result of findOneOTPSStub
        const findOneResult = await OTPModel.findOne({ email: 'existent@gmail.com' });
        console.log('findOneResult:', findOneResult);

        // Expect that sendEmailStub was called
        expect(sendEmailStub.called).to.be.true;

        // Expect that the success message is logged
        expect(result).to.equal('Email sent successfully');
      } finally {
        // Restore the stubs after the test
        findOneStub.restore();
        findOneOTPSStub.restore();
      }
    });


  });

  afterEach(() => {
    sinon.restore();
  });
});
