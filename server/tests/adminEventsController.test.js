const { Types } = require('mongoose');
const { setUp, dropDatabase, dropCollections } = require('./testDb.js');
const eventsModel = require('../models/eventsModel');
const {
  createNewEvent,
  editEvent,
  viewAllEvents,
  viewSelectedEvent,
  deleteEvent
} = require('../controller/adminEventsController.js');

beforeAll(async () => {
  await setUp();
});

afterEach(async () => {
  await dropCollections();
});

afterAll(async () => {
  await dropDatabase();
});

describe('createNewEvent', () => {
  test('should create a new event', async () => {
    const eventData = {
      event_image: 'image_data',
      title: 'Test Event',
      event_type: 'Test Type',
      event_date: '2024-02-10',
      event_time: '15:00',
      location: 'Test Location',
      max_slots: 10,
      description: 'Test Description',
      count: 0
    };

    const createdEvent = await createNewEvent(eventData);

    // Assertions
    expect(createdEvent.title).toBe('Test Event');
    // Add more assertions based on your requirements
  });
});


describe('viewAllEvents', () => {
  test('should return all events', async () => {
    // Create test events
    const testData = [
      {
        description: "Description 1",
        event_date: "2024-02-03",
        event_image: "image1",
        event_time: "15:00",
        event_type: "Workshop",
        location: "Location 1",
        max_slots: 50,
        title: "Event 1",
      },
      {
        description: "Description 2",
        event_date: "2024-02-04",
        event_image: "image2",
        event_time: "16:00",
        event_type: "Seminar",
        location: "Location 2",
        max_slots: 30,
        title: "Event 2",
      },
    ];
  
    const createdEvents = await eventsModel.create(testData);
  
    // Mock the request and response objects
    const req = {};
    const res = {
      json: jest.fn(),
    };
  
    // Call the controller function
    await viewAllEvents(req, res);
  
    // Assertions
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(createdEvents.map(event => expect.objectContaining(event.toObject()))));
  });
  
  
});

describe('viewSelectedEvent', () => {
  test('should return the selected event', async () => {
    // Create a test event
    const testData = await eventsModel.create({
      description: "Lorem ipsum",
      event_date: "2024-02-03",
      event_image: "image_data",
      event_time: "15:00",
      event_type: "Workshop",
      location: "Test Location",
      max_slots: 50,
      title: "Test Event",
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
    await viewSelectedEvent(req, res);
  
    // Assertions
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      description: testData.description,
      event_date: testData.event_date,
      event_image: testData.event_image,
      event_time: testData.event_time,
      event_type: testData.event_type,
      location: testData.location,
      max_slots: testData.max_slots,
      title: testData.title,
    }));
  });
});


describe('deleteEvent', () => {
  test('should delete the selected event', async () => {
    // Create a test event
    const testData = await eventsModel.create({
      event_image: 'image_data',
      title: 'Test Event',
      event_type: 'Workshop',
      event_date: '2024-02-03',
      event_time: '15:00',
      location: 'Test Location',
      max_slots: 50,
      description: 'Lorem ipsum',
    });

    // Mock the request and response objects
    const req = {
      params: {
        id: testData._id.toString(), // Convert ObjectId to string
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Call the controller function
    await deleteEvent(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith({ message: 'Event deleted successfully' });
  });

});