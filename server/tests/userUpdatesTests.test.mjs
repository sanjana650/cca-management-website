// test/userUpdatesController.test.mjs
import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';  // Import sinon here
import { viewUpdates } from '../controller/userUpdatesController.mjs';
import updatesModel from '../models/updatesModel.mjs';

describe('user ', () => {
  describe('viewUpdates', () => {
    it('should return an array of updates when called with valid authentication', async () => {
      // Create a mock request and response
      //the bearer token is always valid as if its not valid in the client side the user will automatically be redirect to the landing page and wouldnt have access to this function
      const req = { headers: { authorization: 'Bearer validTokenHere' } };
      const res = {
        json: (data) => {
          expect(data).to.be.an('array');
          // You can add more specific assertions based on your requirements
        },
        status: (code) => {
          expect(code).to.equal(200);
          return res; // For chaining
        },
      };

      // Stub the updatesModel.find method to return a mock result
      const mockFind = sinon.stub(updatesModel, 'find').resolves([{ content: 'Update 1' }]);

      // Call the viewUpdates function
      await viewUpdates(req, res);

      // Verify that the updatesModel.find method was called with the correct parameters
      expect(mockFind.calledOnceWithExactly()).to.be.true;

      // Restore the stub after the test
      mockFind.restore();
    });


  });
});
