// test file (e.g., adminEventsController.test.mjs)
import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { createNewEvent, editEvent } from '../controller/adminEventsController.mjs';
import eventsModel from '../models/eventsModel.mjs';

describe('admin events', () => {
  //sample data
  const eventData = {
    _id: 'sampleId',
    event_image: 'sampleImage',
    title: 'Sample Event',
    event_type: 'Sample Type',
    event_date: '2024-01-31',
    event_time: '19:38',
    location: 'Sample Location',
    max_slots: 10,
    description: 'Sample Description',
    count: 0,
  };
  describe('createNewEvent', () => {
    it('should create a new event successfully', async () => {

      // Stub the Mongoose model's save method
      const saveStub = sinon.stub(eventsModel.prototype, 'save').resolves({
        _id: 'sampleId',
        event_image: 'sampleImage',
        title: 'Sample Event',
        event_type: 'Sample Type',
        event_date: '2024-01-31',
        event_time: '19:38',
        location: 'Sample Location',
        max_slots: 10,
        description: 'Sample Description',
        count: 0,
      });

      // Call the createNewEvent function with sample data
      const createdEvent = await createNewEvent(eventData);

      // Assertions to verify if the function behaves as expected
      expect(createdEvent).to.have.property('event_image').to.equal(eventData.event_image);
      expect(createdEvent).to.have.property('title').to.equal(eventData.title);
      expect(createdEvent).to.have.property('event_type').to.equal(eventData.event_type);
      expect(createdEvent).to.have.property('event_date').to.equal(eventData.event_date);
      expect(createdEvent).to.have.property('event_time').to.equal(eventData.event_time);
      expect(createdEvent).to.have.property('location').to.equal(eventData.location);
      expect(createdEvent).to.have.property('max_slots').to.equal(eventData.max_slots);
      expect(createdEvent).to.have.property('description').to.equal(eventData.description);

      // Restore the original method to avoid interference with other tests
      saveStub.restore();
    });
  });


});
