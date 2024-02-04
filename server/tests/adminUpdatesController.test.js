const { Types } = require('mongoose');
const { setUp, dropDatabase, dropCollections } = require('./testDb.js');
const updatesModel = require("../models/updatesModel.js")
const {
  createNewUpdate, editUpdate, deleteUpdate, viewAllUpdates, viewSelectedUpdate
} = require('../controller/adminUpdatesController.js');

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

describe('createNewUpdate', () => {
  test('should create a new update', async () => {
    const testData = {
      content: 'Lorem ipsum',
      date_posted: '2024-02-03',
    };

    const createdUpdate = await createNewUpdate(testData);

    // Assertions
    expect(createdUpdate.content).toBe(testData.content);
    expect(createdUpdate.date_posted).toBe(testData.date_posted);
  });

  test('should throw an error on invalid data', async () => {
    // Invalid data (missing required fields)
    const invalidData = {};

    await expect(createNewUpdate(invalidData)).rejects.toThrow();
  });
});

describe('adminViewAllUpdates', () => {
  test('should return all updates', async () => {
    // Create test updates
    await updatesModel.create({
      content: 'Lorem ipsum 1',
      date_posted: '2024-02-03',
    });
    await updatesModel.create({
      content: 'Lorem ipsum 2',
      date_posted: '2024-02-04',
    });

    // Mock the request and response objects
    const req = {};
    const res = {
      json: jest.fn(),
    };

    // Call the controller function
    await viewAllUpdates(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalled();
  });
});

describe('viewSelectedUpdate', () => {
  test('should return the selected update', async () => {
    // Create a test update
    const testData = await updatesModel.create({
      content: 'Lorem ipsum',
      date_posted: '2024-02-03',
    });

    // Mock the request and response objects
    const req = {
      params: {
        id: testData._id.toString(),
      },
    };
    const res = {
      json: jest.fn(),
    };

    // Call the controller function
    await viewSelectedUpdate(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      content: testData.content,
      date_posted: testData.date_posted
    }));
  });
});

describe('deleteUpdate', () => {
  test('should delete an existing update', async () => {
    // Create a test update
    const testData = await updatesModel.create({
      content: 'Lorem ipsum',
      date_posted: '2024-02-03',
    });

    // Mock the request and response objects
    const req = {
      params: {
        id: testData._id.toString(),
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Call the controller function
    await deleteUpdate(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith({ message: 'Update deleted successfully' });
  });
});

describe('editUpdate', () => {
  test('should edit an existing update', async () => {
    // Create a test update
    const testData = await updatesModel.create({
      content: 'Lorem ipsum',
      date_posted: '2024-02-03',
    });

    // Mock the request and response objects
    const req = {
      params: {
        id: testData._id.toString(),
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };

    const newData = {
      content: 'Updated content',
      date_posted: '2024-02-04',
    };

    // Call the controller function
    await editUpdate(req, res, newData);

    // Assertions
    expect(res.json).toHaveBeenCalledWith({
      message: 'Update successfully edited',
      updated: expect.objectContaining(newData),
    });
  });

});

