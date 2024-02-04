const mongoose = require('mongoose');
const { Types } = mongoose;
const { setUp, dropDatabase, dropCollections } = require('./testDb.js');
const User = require('../models/userModel');
const {
  adminViewAllMembers,
  adminSearchMember,
  adminDeleteMember
} = require('../controller/adminMembersController.js');

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

describe('adminViewAllMembers', () => {
  test('should return all members with specified fields', async () => {
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

    const req = {}; // Mock request object
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis() // Mock status function
    };

    await adminViewAllMembers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();
  });
});


describe('adminSearchMember', () => {
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

    await adminSearchMember(req, res);
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

    await adminSearchMember(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'No matching members found.' });
  });
});

describe('adminDeleteMember', () => {
  test('should delete a member and return success message', async () => {
    // Create a test user
    const testData = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
      diploma: 'Engineering',
      about: 'Lorem ipsum',
      role: 'member',
      password: 'somepassword'
    });

    // Fetch the user's ID
    const userId = testData._id.toString();

    // Mock req and res objects
    const req = { params: { id: userId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call adminDeleteMember with the mock req and res
    await adminDeleteMember(req, res);

    // Verify the result
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
  });

  test('should return a message if the user is not found for deletion', async () => {
    // Spy on findByIdAndDelete method
    const findByIdAndDeleteSpy = jest.spyOn(User, 'findByIdAndDelete');
    findByIdAndDeleteSpy.mockResolvedValue(null);

    const req = {
      params: {
        id: new Types.ObjectId().toString() // Create a new ObjectId for a non-existing user
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await adminDeleteMember(req, res);

    // Assertions
    expect(findByIdAndDeleteSpy).toHaveBeenCalledWith(req.params.id, { new: true });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

});

