const mongoose = require('mongoose');
const { Types } = mongoose;
const { setUp, dropDatabase, dropCollections } = require('./testDb.js');
const User = require('../models/userModel.js');
const {
  userViewAllMembers, userSearchMember
} = require('../controller/userMembersController.js');

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

describe('userViewAllMembers', () => {
  test('should return all members with specified fields', async () => {
    const testData = [
      {
        profile_pic: 'picture',
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        diploma: 'Engineering',
        about: 'Lorem ipsum',
        role: 'member',
        password: 'somepassword',
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 30,
        diploma: 'Computer Science',
        about: 'Lorem ipsum',
        role: 'member',
        password: 'somepassword',
      },
    ];

    await User.create(testData);

    const req = {}; // Mock request object
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Mock status function
    };

    await userViewAllMembers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});


describe('userSearchMember', () => {
  test('should return matching members based on the search query', async () => {
    const testData = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        diploma: 'Engineering',
        about: 'Lorem ipsum',
        role: 'member',
        password: 'somepassword'
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 30,
        diploma: 'Computer Science',
        about: 'Lorem ipsum',
        role: 'member',
        password: 'somepassword'
      }
    ];
    await User.create(testData);

    const req = {
      params: {
        name: 'John'
      }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await userSearchMember(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test('should return no matching members if the search query does not match', async () => {
    const testData = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        diploma: 'Engineering',
        about: 'Lorem ipsum',
        role: 'member',
        password: 'somepassword'
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 30,
        diploma: 'Computer Science',
        about: 'Lorem ipsum',
        role: 'member',
        password: 'somepassword'
      }
    ];
    await User.create(testData);

    const req = {
      params: {
        name: 'Unknown'
      }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await userSearchMember(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No matching members found.' });
  });
});