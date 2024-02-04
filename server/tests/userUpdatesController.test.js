const { Types } = require('mongoose');
const { setUp, dropDatabase, dropCollections } = require('./testDb.js');
const updatesModel = require("../models/updatesModel.js")
const {viewUpdates} = require('../controller/userUpdatesController.js');

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

describe('userViewAllUpdates', () => {
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
    await viewUpdates(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalled();
  });
});