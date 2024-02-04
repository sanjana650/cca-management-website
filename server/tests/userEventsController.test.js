const mongoose = require('mongoose');
const { Types } = mongoose;
const { setUp, dropDatabase, dropCollections } = require('./testDb.js');
const eventsModel = require('../models/eventsModel');
const userModel = require('../models/userModel.js');
const {
  joinEvent,
  leaveEvent,
  userSearchEvent,
  userFilterEvent,
} = require('../controller/userEventsController.js');

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

describe('joinEvent', () => {
  test('should successfully join an existing event', async () => {
    // Create a test user with all required fields
    const userData = await userModel.create({
      email: 'test@example.com',
      password: 'password123',
      about: 'Lorem ipsum',
      diploma: 'Bachelor',
      age: 25,
      name: 'John Doe',
    });

    const eventData = await eventsModel.create({
      title: 'Test Event',
      description: 'Lorem ipsum',
      max_slots: 50,
      location: 'Test Location',
      event_time: '15:00',
      event_date: '2024-02-03',
      event_image: 'image_data',
      event_type: 'Workshop',
      count: 0,
    });


    const req = {
      params: { eventId: eventData._id.toString() },
      body: { userId: userData._id.toString(), email: userData.email },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await joinEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User successfully signed up for the event.',
    });
  });
});

describe('leaveEvent', () => {
  test('should successfully leave an existing event', async () => {
    // Create a test user with all required fields
    const userData = await userModel.create({
      email: 'test@example.com',
      password: 'password123',
      about: 'Lorem ipsum',
      diploma: 'Bachelor',
      age: 25,
      name: 'John Doe',
    });

    const eventData = await eventsModel.create({
      title: 'Test Event',
      description: 'Lorem ipsum',
      max_slots: 50,
      location: 'Test Location',
      event_time: '15:00',
      event_date: '2024-02-03',
      event_image: 'image_data',
      event_type: 'Workshop',
      count: 0,
    });


    const reqJoin = {
      params: { eventId: eventData._id.toString() },
      body: { userId: userData._id.toString(), email: userData.email },
    };

    const resJoin = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await joinEvent(reqJoin, resJoin);

    const req = {
      params: { eventId: eventData._id.toString() },
      body: { userId: userData._id.toString(), email: userData.email },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await leaveEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User successfully left the event.',
    });
  });
});

describe('userSearchEvent', () => {
  test('should successfully search for events by title', async () => {
    // Create a test event with all required fields
    await eventsModel.create({
      title: 'Test Event',
      description: 'Lorem ipsum',
      max_slots: 50,
      location: 'Test Location',
      event_time: '15:00',
      event_date: '2024-02-03',
      event_image: 'image_data',
      event_type: 'Workshop',
      count: 0,
    });

    const req = { params: { title: 'Test' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Wait for the asynchronous operation to complete
    await userSearchEvent(req, res);

    setTimeout(() => {
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    }, 100); //delay time
  });

  test('should return a 400 status if title is not provided for search', async () => {
    const req = { params: {} };
    const res = { status: jest.fn(), json: jest.fn() };

    await userSearchEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should return a message if no matching events are found', async () => {
    const req = { params: { title: 'Nonexistent Event' } };
    const res = { status: jest.fn(), json: jest.fn() };

    await userSearchEvent(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'No matching events found.' });
  });
});

describe('userFilterEvent', () => {
  test('should successfully filter events by event type', async () => {
    // Create a test event with the specified event type
    const eventData = await eventsModel.create({
      title: 'Filtered Event',
      description: 'Lorem ipsum',
      max_slots: 50,
      location: 'Test Location',
      event_time: '15:00',
      event_date: '2024-02-03',
      event_image: 'image_data',
      event_type: 'Workshop',
      count: 0,
    });

    const req = { params: { event_type: 'Workshop' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Mock the response object

    await userFilterEvent(req, res);

    // Check the expectations
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining(eventData.toObject())]));
  });


  test('should return a 404 status if no events found with the specified event type', async () => {
    const req = { params: { event_type: 'NonexistentType' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Mock the response object

    await userFilterEvent(req, res);

    // Check the expectations
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No events found with the specified event_type.' });
  });

  test('should return a 400 status if event type is not provided for search', async () => {
    const req = { params: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Mock the response object

    await userFilterEvent(req, res);

    // Check the expectations
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Event Type is required for search.' });
  });


});

