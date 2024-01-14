const User = require('../models/userModel.js');
const OTP = require("../models/otpModel.js");
const { setUp, dropDatabase, dropCollections } = require('./testDb.js');
const { sendEmail } = require('../utils/sendEmail.js');
const { createToken, checkUserLoginCred, checkAdminLoginCred, sendVerificationOTP, verifyLoginOTP, createNewUserSendOTP, verifySignupOTP, resendSignupOTP, resetPassword, resetPasswordOTP, viewProfile, editProfile, deleteUser } = require('../controller/userController.js');
const { hashData, verifyHashedData } = require("../utils/hashData.js");
const { generateOTP, verifyOTP, resetPasswordVerifyOTP } = require("../utils/otpUtils.js");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Types } = mongoose;

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

//Mock the sendEmail function to spy if this function is getting called during testing
jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn(),
}));

describe('createToken', () => {
  test('Successfully creates a JWT token with the expected payload', () => {
    // Mock data for the token payload
    const tokenData = {
      userId: '12345',
      email: 'test@example.com',
      role: 'admin',
    };

    // Call the createToken function
    const token = createToken(tokenData);

    // Verify that the token is defined
    expect(token).toBeDefined();

    // Verify that the token is a string
    expect(typeof token).toBe('string');

    // Decode the token to get the payload
    const decodedPayload = jwt.decode(token);

    // Verify that the decoded payload is an object
    expect(typeof decodedPayload).toBe('object');

    // Verify that the decoded payload matches the expected tokenData
    expect(decodedPayload).toEqual(expect.objectContaining(tokenData));
  });
});

describe('User/Member Login Tests', () => {
  test("Successful Login & email sending", async () => {
    const hashedPassword = await hashData('testing123');

    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    // Mock the sendEmail function to resolve successfully
    // sendEmail.mockResolvedValueOnce();

    // Perform login
    const result = await checkUserLoginCred({
      email: 'test@example.com',
      password: 'testing123',
      role: 'member',
    });


    expect(result).toEqual({ email: 'test@example.com' });

    // Verify that sendEmail function was called
    // expect(sendEmail).toHaveBeenCalled();
  });

  test("Incorrect or missing data parameters", async () => {
    const hashedPassword = await hashData('testing123');

    //test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    //Perform login with missing or incorrect data parameters
    const result = await checkUserLoginCred({
      email: 'test@example.com',
      //password and role are intentionally omitted or incorrect
    });

    // Assert the result
    expect(result).toEqual({ error: "Missing or incorrect data parameters" });
  });

  test("Email doesn't exist or user doesn't exist", async () => {
    // Perform login
    const result = await checkUserLoginCred({
      email: 'test@example.com',
      password: 'testing123',
      role: 'member',
    });
    expect(result).toEqual({ error: "Email not found" });
  })

  test("Invalid password", async () => {
    const hashedPassword = await hashData('testing123');

    //test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    //Perform login with Invalid password entered
    const result = await checkUserLoginCred({
      email: 'test@example.com',
      password: 'wrongPassword',
      role: 'member',
    });

    // Assert the result
    expect(result).toEqual({ error: "Invalid password entered" });
  })

  test("Account has not been verified yet", async () => {
    const hashedPassword = await hashData('testing123');

    //test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false, // Set user as unverified for testing
    };
    await User.create(testUser);

    //Perform login with unverified account
    const result = await checkUserLoginCred({
      email: 'test@example.com',
      password: 'testing123',
      role: 'member',
    });

    // Assert the result
    expect(result).toEqual({ error: "Verify your account first before logging in" });
  })

  test("User's role is not member", async () => {
    const hashedPassword = await hashData('testing123');

    //test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    //Perform login with unverified account
    const result = await checkUserLoginCred({
      email: 'test@example.com',
      password: 'testing123',
      role: 'admin',
    });

    // Assert the result
    expect(result).toEqual({ error: "Only members can login" });
  })

  test("Error during user fetch", async () => {
    // Mock the User.findOne method to throw an error
    jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    //purposely cause error as this test case test that an error is given when the try block in the controller function fails
    try {
      await checkUserLoginCred({
        email: 'test@example.com',
        password: 'testing123',
        role: 'member',
      });

      //if the function doesn't throw an error, fail the test
      fail("Expected function to throw an error");
    } catch (error) {
      //assert that the error message matches the expected error
      expect(error.message).toBe("Database error");
    }

  });

});

describe('Admin Login Tests', () => {
  test("Successful Login & email sending", async () => {
    const hashedPassword = await hashData('testing123');

    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'admin',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    // Mock the sendEmail function to resolve successfully
    // sendEmail.mockResolvedValueOnce();

    // Perform login
    const result = await checkAdminLoginCred({
      email: 'test@example.com',
      password: 'testing123',
      role: 'admin',
    });


    expect(result).toEqual({ email: 'test@example.com' });

    // Verify that sendEmail function was called
    // expect(sendEmail).toHaveBeenCalled();
  });

  test("Incorrect or missing data parameters", async () => {
    const hashedPassword = await hashData('testing123');

    //test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'admin',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    //Perform login with missing or incorrect data parameters
    const result = await checkAdminLoginCred({
      email: 'test@example.com',
      //password and role are intentionally omitted or incorrect
    });

    // Assert the result
    expect(result).toEqual({ error: "Missing or incorrect data parameters" });
  });

  test("Email doesn't exist or user doesn't exist", async () => {
    // Perform login
    const result = await checkAdminLoginCred({
      email: 'test@example.com',
      password: 'testing123',
      role: 'admin',
    });
    expect(result).toEqual({ error: "Email not found" });
  })

  test("Invalid password", async () => {
    const hashedPassword = await hashData('testing123');

    //test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'admin',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    //Perform login with Invalid password entered
    const result = await checkAdminLoginCred({
      email: 'test@example.com',
      password: 'wrongPassword',
      role: 'admin',
    });

    // Assert the result
    expect(result).toEqual({ error: "Invalid password entered" });
  })

  test("Account has not been verified yet", async () => {
    const hashedPassword = await hashData('testing123');

    //test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'admin',
      verified: false, // Set user as unverified for testing
    };
    await User.create(testUser);

    //Perform login with unverified account
    const result = await checkAdminLoginCred({
      email: 'test@example.com',
      password: 'testing123',
      role: 'admin',
    });

    // Assert the result
    expect(result).toEqual({ error: "Verify your account first before logging in" });
  })

  test("User's role is not admin", async () => {
    const hashedPassword = await hashData('testing123');

    //test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'admin',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    //Perform login with unverified account
    const result = await checkAdminLoginCred({
      email: 'test@example.com',
      password: 'testing123',
      role: 'member',
    });

    // Assert the result
    expect(result).toEqual({ error: "Only admins can log in" });
  })

  test("Error during user fetch", async () => {
    // Mock the User.findOne method to throw an error
    jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    //purposely cause error as this test case test that an error is given when the try block in the controller function fails
    try {
      await checkUserLoginCred({
        email: 'test@example.com',
        password: 'testing123',
        role: 'admin',
      });

      //if the function doesn't throw an error, fail the test
      fail("Expected function to throw an error");
    } catch (error) {
      //assert that the error message matches the expected error
      expect(error.message).toBe("Database error");
    }

  });

});

describe('sendVerificationOTP', () => {

  test('Sends OTP email successfully', async () => {

    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'admin',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    const email = 'test@example.com';
    const subject = 'Verify Your Account';
    const message = 'Your OTP code is: ';

    // Perform the function call
    const result = await sendVerificationOTP({ email, subject, message });

    // Check the result
    expect(result).toBe(true);

    // Verify that sendEmail function was called
    expect(sendEmail).toHaveBeenCalledWith({
      from: expect.any(String), // Add more specific checks if needed
      to: email,
      subject,
      html: expect.stringContaining('<p>Your OTP code is: </p>'),
    });
  });

  test('Error when parameters are missing', async () => {
    const hashedPassword = await hashData('testing123');

    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);
    const result = await sendVerificationOTP({});
    expect(result).toEqual({ error: "Provide values for email, subject, and message" });
  });

  test('User not found', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    const email = 'nonexistentuser@example.com';
    const subject = 'Verify Your Account';
    const message = 'Your OTP code is: ';

    const result = await sendVerificationOTP({ email, subject, message });
    expect(result).toEqual({ error: "User not found" });
  });

  test('Edit an existing OTP', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'sanjanawork04@gmail.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    // Create an OTP model with an existing record
    const existingOTP = await generateOTP();
    const existingHashedOTP = await hashData(existingOTP);
    const existingOTPRecord = await OTP.create({
      email: testUser.email,
      otp: existingHashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 30, // Assuming a 30-second duration
    });

    const email = 'sanjanawork04@gmail.com'; // Existing email from your example
    const subject = 'Verify Your Account';
    const message = 'Your OTP code is: ';

    const result = await sendVerificationOTP({ email, subject, message });
    expect(result).toBe(true);

    // Verify that the OTP record is updated
    const updatedOTPRecord = await OTP.findOne({ email });
    expect(updatedOTPRecord).toBeTruthy();
    expect(updatedOTPRecord.otp).not.toEqual(existingHashedOTP);
    expect(updatedOTPRecord.createdAt.getTime()).toBeGreaterThan(existingOTPRecord.createdAt.getTime());
    expect(updatedOTPRecord.expiresAt.getTime()).toBeGreaterThan(existingOTPRecord.expiresAt.getTime());

  });

  test('Generate new OTP', async () => {

    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'newuser@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    const email = 'newuser@example.com';
    const subject = 'Verify Your Account';
    const message = 'Your OTP code is: ';

    const result = await sendVerificationOTP({ email, subject, message });
    expect(result).toBe(true);

    // Verify that the OTP record is created
    const newOTPRecord = await OTP.findOne({ email });
    expect(newOTPRecord).toBeTruthy();
    expect(newOTPRecord.createdAt).toBeTruthy();
    expect(newOTPRecord.expiresAt).toBeTruthy();
    expect(newOTPRecord.otp).toBeTruthy();
  });
});

describe('verifyLoginOTP', () => {
  test('Successfully verifies login OTP', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'admin',
      verified: true,
      login_verified: false
    };
    await User.create(testUser);

    const otp = await generateOTP();
    await OTP.create({
      email: testUser.email,
      otp: await hashData(otp),
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 30, // Assuming a 30-second duration
    });

    //ensure that the user's login_verified status is initially false
    expect(testUser.login_verified).toBe(false);

    const result = await verifyLoginOTP({ email: testUser.email, otp });

    expect(result.token).toBeDefined();
    //fetch the user again to get the updated login_verified status
    const updatedUser = await User.findOne({ email: testUser.email });

    //ensure that the user's login_verified status is now true
    expect(updatedUser.login_verified).toBe(true);
  });

  test('User not found when verifying login OTP', async () => {
    const result = await verifyLoginOTP({ email: 'nonexistentuser@example.com', otp: '1234' });

    expect(result.error).toBe("User not found");
  })

  test('Incorrect OTP when verifying login OTP', async () => {
    //create user
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'admin',
      verified: true,
      login_verified: false

    };
    await User.create(testUser);

    //create otp model
    const otp = await generateOTP();
    await OTP.create({
      email: testUser.email,
      otp: await hashData(otp),
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 30, // Assuming a 30-second duration
    });

    const result = await verifyLoginOTP({ email: testUser.email, otp: 'wrongOtp' });
    expect(result.error).toBe('Invalid OTP');
    expect(testUser.login_verified).toBe(false);
  })

  test('Expired OTP when verifying login OTP', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'admin',
      verified: true,
      login_verified: false

    };
    await User.create(testUser);

    const otp = await generateOTP();
    await OTP.create({
      email: testUser.email,
      otp: await hashData(otp),
      createdAt: Date.now() - 1000 * 60, // Set OTP creation time to 1 minute ago
      expiresAt: Date.now() - 1000 * 30, // Set OTP expiration time to 30 seconds ago
    });

    const result = await verifyLoginOTP({ email: testUser.email, otp });

    expect(result.error).toBe("Code has expired. Request for a new one");
    expect(testUser.login_verified).toBe(false);
  });

})

describe('createNewUserSendOTP', () => {
  test('Successfully creates a new user and sends verification OTP', async () => {
    const userData = {
      profile_pic: 'profile.jpg',
      email: 'newuser@example.com',
      name: 'New User',
      age: 25,
      diploma: 'it',
      about: 'A new user',
      password: 'password123',
      role: 'member',
    };

    const createdUser = await createNewUserSendOTP(userData);

    // Verify the created user
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(userData.email);
    expect(createdUser.role).toBe('member');

  })

  test('User with the same email already exists', async () => {
    const existingUser = {
      profile_pic: 'existing.jpg',
      email: 'existinguser@example.com',
      name: 'Existing User',
      age: 30,
      diploma: 'it',
      about: 'An existing user',
      password: 'password456',
      role: 'user',
    };

    // Create an existing user
    await User.create(existingUser);

    const result = await createNewUserSendOTP(existingUser);

    // Verify that the function returns an error
    expect(result).toEqual({ error: "User with provided email already exists" });
  });

  test('Empty input fields', async () => {
    const userData = {
      profile_pic: '',
      email: '',
      name: '',
      age: null,
      diploma: '',
      about: '',
      password: '',
      role: 'user',
    };

    const result = await createNewUserSendOTP(userData);

    // Verify that the function returns an error
    expect(result).toEqual({ error: "Empty input fields" });

  });
  test('Invalid name entered', async () => {
    const userData = {
      profile_pic: 'invalid.jpg',
      email: 'invaliduser@example.com',
      name: 'Invalid User@',
      age: 28,
      diploma: 'it',
      about: 'An invalid user',
      password: 'password789',
      role: 'user',
    };

    const result = await createNewUserSendOTP(userData);

    // Verify that the function returns an error
    expect(result).toEqual({ error: "Invalid name entered" });
  });

  test('Invalid email entered', async () => {
    const userData = {
      profile_pic: 'invalid.jpg',
      email: 'invalidemail',
      name: 'Invalid Email User',
      age: 35,
      diploma: 'it',
      about: 'An invalid email user',
      password: 'passwordABC',
      role: 'user',
    };

    const result = await createNewUserSendOTP(userData);

    // Verify that the function returns an error
    expect(result).toEqual({ error: "Invalid email entered" });
  });

  test('Password is too short', async () => {
    const userData = {
      profile_pic: 'short.jpg',
      email: 'shortpassword@example.com',
      name: 'Short Password User',
      age: 40,
      diploma: 'iit',
      about: 'A user with a short password',
      password: 'short',
      role: 'user',
    };

    const result = await createNewUserSendOTP(userData);

    // Verify that the function returns an error
    expect(result).toEqual({ error: "Password is too short" });
  });

})

describe('verifySignupOTP', () => {
  test('Successfully verifies signup OTP', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false,
      login_verified: false
    };
    await User.create(testUser);

    const otp = await generateOTP();
    await OTP.create({
      email: testUser.email,
      otp: await hashData(otp),
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 30, // Assuming a 30-second duration
    });

    //ensure that the user's verified status is initially false
    expect(testUser.verified).toBe(false);

    const result = await verifySignupOTP({ email: testUser.email, otp });

    //fetch the user again to get the updated verified status
    const updatedUser = await User.findOne({ email: testUser.email });

    //ensure that the user's verified status is now true
    expect(updatedUser.verified).toBe(true);
  });

  test('User not found when verifying signup OTP', async () => {
    const result = await verifySignupOTP({ email: 'nonexistentuser@example.com', otp: '1234' });

    expect(result.error).toBe("User not found");
  })

  test('Incorrect OTP when verifying signup OTP', async () => {
    //create user
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false,
      login_verified: false

    };
    await User.create(testUser);

    //create otp model
    const otp = await generateOTP();
    await OTP.create({
      email: testUser.email,
      otp: await hashData(otp),
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 30, // Assuming a 30-second duration
    });

    const result = await verifySignupOTP({ email: testUser.email, otp: 'wrongOtp' });
    expect(result.error).toBe('Invalid OTP');
    expect(testUser.verified).toBe(false);
  })

  test('Expired OTP when verifying signup OTP', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false,
      login_verified: false

    };
    await User.create(testUser);

    const otp = await generateOTP();
    await OTP.create({
      email: testUser.email,
      otp: await hashData(otp),
      createdAt: Date.now() - 1000 * 60, // Set OTP creation time to 1 minute ago
      expiresAt: Date.now() - 1000 * 30, // Set OTP expiration time to 30 seconds ago
    });

    const result = await verifySignupOTP({ email: testUser.email, otp });

    expect(result.error).toBe("Code has expired. Request for a new one");
    expect(testUser.verified).toBe(false);
  });

})

//resendSignupOTP
describe('resendSignupOTP', () => {
  test('Sends OTP email to verify user after sign up successfully', async () => {

    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false, // Set user as verified for testing
    };
    await User.create(testUser);

    const email = 'test@example.com';
    const subject = 'Verify Your Account';


    // Perform the function call
    const result = await resendSignupOTP({ email });

    expect(result).toEqual({ message: 'Email sent' });
    expect(testUser.verified).toBe(false);


    // Verify that sendEmail function was called
    expect(sendEmail).toHaveBeenCalledWith({
      from: expect.any(String),
      to: email,
      subject,
      html: expect.stringContaining('<p>Your OTP code is: </p>'),
    });
  });

  test('Error when email parameter is missing', async () => {
    const hashedPassword = await hashData('testing123');

    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false,
    };
    await User.create(testUser);
    const result = await resendSignupOTP({});
    expect(result).toEqual({ error: "Provide a value for email" });
  });

  test('User not found', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false, // Set user as verified for testing
    };
    await User.create(testUser);

    const email = 'nonexistentuser@example.com';
    const subject = 'Verify Your Account';
    const message = 'Your OTP code is: ';

    const result = await resendSignupOTP({ email });
    expect(result).toEqual({ error: "User not found" });
  });

  test('User is already verified', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    const email = 'test@example.com';

    const result = await resendSignupOTP({ email });
    expect(result).toEqual({ error: "User is already verified please login" });
  });

  test('Edit an existing OTP', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'sanjanawork04@gmail.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false,
    };
    await User.create(testUser);

    const email = 'sanjanawork04@gmail.com'; // Existing email from your example

    // Create an OTP model with an existing record
    const existingOTP = await generateOTP();
    const existingHashedOTP = await hashData(existingOTP);
    const existingOTPRecord = await OTP.create({
      email: testUser.email,
      otp: existingHashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 30, // Assuming a 30-second duration
    });

    // Call the resendSignupOTP function
    const result = await resendSignupOTP({ email });

    // Verify the result
    expect(result).toEqual({ message: 'Email sent' });

    // Verify that the OTP record is updated
    const updatedOTPRecord = await OTP.findOne({ email });
    expect(updatedOTPRecord).toBeTruthy();
    expect(updatedOTPRecord.otp).not.toEqual(existingHashedOTP);
    expect(updatedOTPRecord.createdAt.getTime()).toBeGreaterThan(existingOTPRecord.createdAt.getTime());
    expect(updatedOTPRecord.expiresAt.getTime()).toBeGreaterThan(existingOTPRecord.expiresAt.getTime());
  });

  test('Generate a new OTP', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'newuser@example.com',
      name: 'newtester',
      age: 20,
      diploma: 'newtest',
      about: 'newtest',
      password: hashedPassword,
      role: 'member',
      verified: false,
    };
    await User.create(testUser);

    const email = 'newuser@example.com';

    // Call the resendSignupOTP function to generate a new OTP
    const result = await resendSignupOTP({ email });

    // Verify the result
    expect(result).toEqual({ message: 'Email sent' });

    // Verify that the OTP record is created
    const newOTPRecord = await OTP.findOne({ email });
    expect(newOTPRecord).toBeTruthy();
    expect(newOTPRecord.createdAt).toBeTruthy();
    expect(newOTPRecord.expiresAt).toBeTruthy();
    expect(newOTPRecord.otp).toBeTruthy();
  });

});


//resetPassword
describe('resetPassword', () => {
  test('Successfully rest password', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);
    const email = 'test@example.com';

    // Create an OTP model with an existing record
    const existingOTP = await generateOTP();
    const existingHashedOTP = await hashData(existingOTP);
    const existingOTPRecord = await OTP.create({
      email: testUser.email,
      otp: existingHashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 30, // Assuming a 30-second duration
    });

    const resultPromise = resetPassword({ otp: existingOTP, email, password: 'updated1234' });
    const OTPRecord = await OTP.findOne({ email });
    expect(OTPRecord.otp).toEqual(existingHashedOTP);

    // Wait for the result promise to resolve
    const result = await resultPromise;

    expect(result).toEqual({ message: 'Password updated successfully' });
  })

  test('User not found', async () => {
    // Action: Attempt to reset the password for a nonexistent user
    const result = await resetPassword({ otp: '123456', email: 'nonexistent@example.com', password: 'updated1234' });

    // Assertion: Expect an error message indicating user not found
    expect(result).toEqual({ message: 'User not found' });
  });

  test('Password must be at least 6 characters', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    //Attempt to reset the password with a short password
    const result = await resetPassword({ otp: '123456', email: 'test@example.com', password: '123' });

    //Expect an error message indicating a short password
    expect(result).toEqual({ error: 'Password must be at least 6 characters' });
  });

  test('Password must be different from the old password', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    // Action: Attempt to reset the password with the same password
    const result = await resetPassword({ otp: '123456', email: 'test@example.com', password: 'testing123' });

    // Assertion: Expect an error message indicating the need for a different password
    expect(result).toEqual({ error: 'Password must be different from the old password' });
  });

  test('Invalid OTP', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    //create otp model
    const otp = await generateOTP();
    await OTP.create({
      email: testUser.email,
      otp: await hashData(otp),
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 30, // Assuming a 30-second duration
    });

    //Attempt to reset the password with an invalid OTP
    const result = await resetPassword({ otp: 'invalidotp', email: 'test@example.com', password: 'updated1234' });

    //Expect an error message indicating an invalid OTP
    expect(result).toEqual({ error: 'Invalid OTP' });
  });

  test('OTP expired', async () => {
    // Create a test user
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true, // Set user as verified for testing
    };
    await User.create(testUser);

    // Create an OTP model with an expired record
    const expiredOTP = await generateOTP();
    const expiredHashedOTP = await hashData(expiredOTP);
    await OTP.create({
      email: testUser.email,
      otp: expiredHashedOTP,
      createdAt: Date.now() - 1000 * 60, // Set OTP creation time to 1 minute ago
      expiresAt: Date.now() - 1000 * 30, // Set OTP expiration time to 30 seconds ago
    });

    //Attempt to reset the password with an expired OTP
    const result = await resetPassword({ otp: expiredOTP, email: 'test@example.com', password: 'updated1234' });

    // Expect an error message indicating an expired OTP
    expect(result.error).toBe("Code has expired. Request for a new one");
  });

})


//resetPasswordOTP
describe('resetPasswordOTP', () => {
  test('Sends OTP email to reset password successfully', async () => {

    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true,
    };
    await User.create(testUser);

    const email = 'test@example.com';
    const subject = 'Verify Your Account';


    // Perform the function call
    const result = await resetPasswordOTP({ email });

    expect(result).toEqual({ message: 'Email sent' });


    // Verify that sendEmail function was called
    expect(sendEmail).toHaveBeenCalledWith({
      from: expect.any(String),
      to: email,
      subject,
      html: expect.stringContaining('<p>Your OTP code is: </p>'),
    });
  });

  test('Error when email parameter is missing', async () => {
    const hashedPassword = await hashData('testing123');

    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: true,
    };
    await User.create(testUser);
    const result = await resetPasswordOTP({});
    expect(result).toEqual({ error: "Provide a value for email" });
  });

  test('User not found', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false, // Set user as verified for testing
    };
    await User.create(testUser);

    const email = 'nonexistentuser@example.com';


    const result = await resetPasswordOTP({ email });
    expect(result).toEqual({ error: "User not found" });
  });


  test('Edit an existing OTP', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'sanjanawork04@gmail.com',
      name: 'tester',
      age: 10,
      diploma: 'test',
      about: 'test',
      password: hashedPassword,
      role: 'member',
      verified: false,
    };
    await User.create(testUser);

    const email = 'sanjanawork04@gmail.com'; // Existing email from your example

    // Create an OTP model with an existing record
    const existingOTP = await generateOTP();
    const existingHashedOTP = await hashData(existingOTP);
    const existingOTPRecord = await OTP.create({
      email: testUser.email,
      otp: existingHashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 30, // Assuming a 30-second duration
    });

    // Call the resendSignupOTP function
    const result = await resetPasswordOTP({ email });

    // Verify the result
    expect(result).toEqual({ message: 'Email sent' });

    // Verify that the OTP record is updated
    const updatedOTPRecord = await OTP.findOne({ email });
    expect(updatedOTPRecord).toBeTruthy();
    expect(updatedOTPRecord.otp).not.toEqual(existingHashedOTP);
    expect(updatedOTPRecord.createdAt.getTime()).toBeGreaterThan(existingOTPRecord.createdAt.getTime());
    expect(updatedOTPRecord.expiresAt.getTime()).toBeGreaterThan(existingOTPRecord.expiresAt.getTime());
  });

  test('Generate a new OTP', async () => {
    const hashedPassword = await hashData('testing123');
    // Create a test user
    const testUser = {
      email: 'newuser@example.com',
      name: 'newtester',
      age: 20,
      diploma: 'newtest',
      about: 'newtest',
      password: hashedPassword,
      role: 'member',
      verified: false,
    };
    await User.create(testUser);

    const email = 'newuser@example.com';

    // Call the resendSignupOTP function to generate a new OTP
    const result = await resetPasswordOTP({ email });

    // Verify the result
    expect(result).toEqual({ message: 'Email sent' });

    // Verify that the OTP record is created
    const newOTPRecord = await OTP.findOne({ email });
    expect(newOTPRecord).toBeTruthy();
    expect(newOTPRecord.createdAt).toBeTruthy();
    expect(newOTPRecord.expiresAt).toBeTruthy();
    expect(newOTPRecord.otp).toBeTruthy();
  });

});

//viewProfile
describe('viewProfile', () => {
  test('Successfully view user profile', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      id: '123',
      email: 'test@example.com',
      name: 'tester',
      age: 25,
      diploma: 'Computer Science',
      about: 'A software developer',
      password: hashedPassword,
      role: 'member',
      verified: true,
    };
    const createdUser = await User.create(testUser);

    //Attempt to view the user profile
    const result = await viewProfile({ id: createdUser._id });

    //Ensure the user profile is retrieved successfully
    expect(result.userProfile).toBeTruthy();
    expect(result.userProfile.name).toEqual(testUser.name);
    expect(result.userProfile.email).toEqual(testUser.email);
    expect(result.userProfile.age).toEqual(testUser.age);
    expect(result.userProfile.diploma).toEqual(testUser.diploma);
    expect(result.userProfile.about).toEqual(testUser.about);
    expect(result.userProfile.role).toEqual(testUser.role);
    expect(result.userProfile.verified).toEqual(testUser.verified);
  });

  test('Invalid user ID ', async () => {
    // Attempt to view the profile of a nonexistent user
    const result = await viewProfile({ id: 'nonexistentuserid' });

    // Expect an error message indicating an invalid user ID
    expect(result).toEqual({ error: 'Invalid user ID' });
  });

  test('User profile not found', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      id: '658d9b7012c7d7tesa5dc1a8',
      email: 'test@example.com',
      name: 'tester',
      age: 25,
      diploma: 'Computer Science',
      about: 'A software developer',
      password: hashedPassword,
      role: 'member',
      verified: true,
    };
    const createdUser = await User.create(testUser);

    // Attempt to view the profile with an invalid user ID
    const result = await viewProfile({ id: 'nonexistentuserid' });

    // Expect an error message indicating invalid user ID
    expect(result).toEqual({ error: 'Invalid user ID' });
  });


});


// editProfile
describe('editProfile', () => {
  test('Successfully edit profile', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 25,
      diploma: 'Computer Science',
      about: 'A software developer',
      password: hashedPassword,
      role: 'member',
      verified: true,
    };

    // Create the test user
    const createdUser = await User.create(testUser);

    // Fetch the user's ID
    const userId = createdUser._id.toString();

    const newData = {
      id: userId,
      name: 'newName',
      age: 30,
      diploma: 'newDiploma',
      about: 'Updated profile',
    };

    // Attempt to edit the user profile
    const result = await editProfile(newData);

    // Fetch the updated user profile from the database
    const updatedUserProfile = await User.findById(userId);

    // Expect the updated user profile
    expect(result.updatedUserProfile).toBeTruthy();
    expect(updatedUserProfile.name).toEqual('newName');
    expect(updatedUserProfile.age).toEqual(30);
    expect(updatedUserProfile.diploma).toEqual('newDiploma');
    expect(updatedUserProfile.about).toEqual('Updated profile');
  });

  test('User profile not found during edit', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 25,
      diploma: 'Computer Science',
      about: 'A software developer',
      password: hashedPassword,
      role: 'member',
      verified: true,
    };

    // Create the test user and get the created user object
    const createdUser = await User.create(testUser);

    // Ensure that the user was created successfully
    expect(createdUser).toBeTruthy();

    const userId = createdUser && createdUser._id.toString();

    const newData = {
      //invalid id
      id: '6591b8f075c6028a73854f26',
      name: 'newName',
      age: 30,
      diploma: 'newDiploma',
      about: 'Updated profile',
    };

    // Attempt to edit the user profile
    const result = await editProfile(newData);

    // Expect that the user profile was not updated and contains an error
    expect(result.updatedUserProfile).toBeFalsy();
    expect(result).toEqual({ error: 'User profile not found' });
  });

})

//deleteUser
describe('deleteUser', () => {
  test('Successfully delete user', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 25,
      diploma: 'Computer Science',
      about: 'A software developer',
      password: hashedPassword,
      role: 'member',
      verified: true,
    };

    // Create the test user
    const createdUser = await User.create(testUser);

    // Fetch the user's ID
    const userId = createdUser._id.toString();
    console.log(userId)
    // Attempt to delete the user profile
    const result = await deleteUser({ params: { id: userId } });

    // Verify the result
    expect(result).toEqual({ message: 'User deleted successfully' });
  });



  test('User not found during delete', async () => {
    const hashedPassword = await hashData('testing123');
    const testUser = {
      email: 'test@example.com',
      name: 'tester',
      age: 25,
      diploma: 'Computer Science',
      about: 'A software developer',
      password: hashedPassword,
      role: 'member',
      verified: true,
    };

    // Create the test user and get the created user object
    const createdUser = await User.create(testUser);

    // Ensure that the user was created successfully
    expect(createdUser).toBeTruthy();


    const newData = {
      //invalid id
      id: '6591b8f075c6028a73854f26',
      name: 'newName',
      age: 30,
      diploma: 'newDiploma',
      about: 'deleted profile',
    };

    // Attempt to edit the user profile
    const result = await deleteUser({ params: { id: newData.id } });
    expect(result).toEqual({ error: 'User not found' });
  });

})
