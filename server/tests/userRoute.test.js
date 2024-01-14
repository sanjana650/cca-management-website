const request = require('supertest');
const app = require('../server'); // Make sure to adjust the path based on your project structure
const { setUp, dropDatabase, dropCollections } = require('./testDb.js');

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

describe('User Routes', () => {
  // Mock user data for testing
  const userData = {
    email: 'test@example.com',
    password: 'password123',
    role: 'member',
  };

  // Mock user ID for testing
  let userId;

  // Login and send OTP
  test('POST /user/login-and-send-otp', async () => {
    const response = await request(app)
      .post('/user/login-and-send-otp')
      .send(userData)
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('otp');

    // Store the user ID for subsequent tests
    userId = response.body.userId;
  });

  // Verify login OTP
  test('POST /user/verify-login-otp', async () => {
    const otpData = {
      email: userData.email,
      otp: '123456', // Replace with the actual OTP sent in the previous test
    };

    const response = await request(app)
      .post('/user/verify-login-otp')
      .send(otpData)
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('message');
  });

  // Signup and send OTP
  test('POST /user/signup-and-send-otp', async () => {
    const signupData = {
      email: 'newuser@example.com',
      name: 'New User',
      age: 25,
      diploma: 'Computer Science',
      about: 'A new user',
      password: 'newpassword123',
      profile_pic: 'base64encodedimage', // Replace with a base64-encoded image string
    };

    const response = await request(app)
      .post('/user/signup-and-send-otp')
      .send(signupData)
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('otp');
  });

  // Verify signup OTP
  test('POST /user/verify-signup-otp', async () => {
    const otpData = {
      email: 'newuser@example.com', // Replace with the email used in the previous test
      otp: '123456', // Replace with the actual OTP sent in the previous test
    };

    const response = await request(app)
      .post('/user/verify-signup-otp')
      .send(otpData)
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('message');
  });

  // Resend signup OTP
  test('POST /user/resend-signup-otp', async () => {
    const resendData = {
      email: 'newuser@example.com', // Replace with the email used in the previous test
    };

    const response = await request(app)
      .post('/user/resend-signup-otp')
      .send(resendData)
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('message');
  });

  // Send OTP for reset password
  test('POST /user/send-otp-reset-password', async () => {
    const resetPasswordData = {
      email: userData.email,
    };

    const response = await request(app)
      .post('/user/send-otp-reset-password')
      .send(resetPasswordData)
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('message');
  });

  // Verify OTP for reset password
  test('POST /user/verify-otp-reset-password', async () => {
    const resetPasswordData = {
      email: userData.email,
      otp: '123456', // Replace with the actual OTP sent in the previous test
      password: 'newpassword456',
    };

    const response = await request(app)
      .post('/user/verify-otp-reset-password')
      .send(resetPasswordData)
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('message');
  });

  // View profile (requires authentication)
  test('GET /user/view-profile/:id', async () => {
    const response = await request(app)
      .get(`/user/view-profile/${userId}`)
      .set('Authorization', 'Bearer YOUR_AUTH_TOKEN') // Replace with a valid JWT token
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('age');
    expect(response.body).toHaveProperty('diploma');
    expect(response.body).toHaveProperty('about');
  });

  // Edit profile (requires authentication)
  test('PATCH /user/edit-profile/:id', async () => {
    const updatedProfileData = {
      name: 'Updated Name',
      age: 30,
      diploma: 'Updated Diploma',
      about: 'An updated profile',
    };

    const response = await request(app)
      .patch(`/user/edit-profile/${userId}`)
      .set('Authorization', 'Bearer YOUR_AUTH_TOKEN') // Replace with a valid JWT token
      .send(updatedProfileData)
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('name', updatedProfileData.name);
    expect(response.body).toHaveProperty('age', updatedProfileData.age);
    expect(response.body).toHaveProperty('diploma', updatedProfileData.diploma);
    expect(response.body).toHaveProperty('about', updatedProfileData.about);
  });

  // Delete profile (requires authentication)
  test('DELETE /user/delete-profile/:id', async () => {
    await request(app)
      .delete(`/user/delete-profile/${userId}`)
      .set('Authorization', 'Bearer YOUR_AUTH_TOKEN') // Replace with a valid JWT token
      .expect(200);
  });

  // Logout
  test('POST /user/logout', async () => {
    const logoutData = {
      userId: userId,
    };

    const response = await request(app)
      .post('/user/logout')
      .send(logoutData)
      .expect(200);

    // Ensure the response contains the expected properties
    expect(response.body).toHaveProperty('message');
  });
});

// Close the Express app after all tests
afterAll(() => {
  app.close();
});