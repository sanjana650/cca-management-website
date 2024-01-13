const mongoose = require('mongoose');
const User = require('../models/userModel');
const OTP = require("../models/otpModel.js");
const { setUp, dropDatabase, dropCollections } = require('./testDb');
const { sendEmail } = require('../utils/sendEmail');
const { checkUserLoginCred, checkAdminLoginCred, sendVerificationOTP } = require('../controller/userController');
const { hashData, verifyHashedData } = require("../utils/hashData.js");

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

//Mock the sendEmail function so i can spy on whether this funciton is getting called during testing
jest.mock('../utils/sendEmail', () => ({
  sendEmail: jest.fn(),
}));


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

describe('sendVerificationOTP Function', () => {

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

    const email = 'sanjanawork04@gmail.com'; // Existing email from your example
    const subject = 'Verify Your Account';
    const message = 'Your OTP code is: ';

    const result = await sendVerificationOTP({ email, subject, message });
    expect(result).toBe(true);
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
  });



});