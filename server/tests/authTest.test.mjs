import { expect } from 'chai';
import chai from 'chai';
import spies from 'chai-spies';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyToken, requireMemberRole, requireAdminRole } from "../utils/auth.mjs";

// Using Chai Spies
chai.use(spies);
const spy = chai.spy;


dotenv.config();
const { TOKEN_KEY } = process.env;
const tokenKey = TOKEN_KEY;

describe('Authentication Utils', () => {
  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const validTokenPayload = {
        userId: '6591b8f075c6028a73854f21',
        email: 'sanjanawork04@gmail.com',
        role: 'member',
        iat: Math.floor(Date.now() / 1000) - 3600, // issued at (1 hour ago)
        exp: Math.floor(Date.now() / 1000) + 3600, // expiration time (1 hour from now)
      };

      const validToken = jwt.sign(validTokenPayload, tokenKey);

      const req = { headers: { authorization: `Bearer ${validToken}` } };
      const res = {};
      const next = spy(); // Use Chai Spies here

      const result = await verifyToken(req, res, next);

      expect(result).to.be.undefined;
      expect(next).to.have.been.called.once; // Using Chai Spies for assertions
    });

    it('should handle expired token', async () => {
      //mock an expired token
      const expiredToken = jwt.sign({ exp: Math.floor(Date.now() / 1000) - 1 }, tokenKey);
      const req = { headers: { authorization: `Bearer ${expiredToken}` } };
      const res = {};
      const next = spy();

      try {
        await verifyToken(req, res, next);
        // If the token is not expired, this should not be reached
        expect(true).to.be.false;
      } catch (error) {
        //assertions for an expired token
        expect(error.message).to.equal('Token has expired, please login again');
        // Ensure next is not called in this case
        expect(next).not.to.have.been.called();
      }
    });

    it('should handle missing authorization header', async () => {
      const req = { headers: {} };
      const res = {};
      const next = spy();

      try {
        await verifyToken(req, res, next);
        // If no token is provided, this should not be reached
        expect(true).to.be.false;
      } catch (error) {
        expect(error.message).to.equal('An authentication token is required');
        expect(next).not.to.have.been.called();
      }
    });

    it('should handle token verification failure', async () => {
      // Mock a token with an invalid signature
      const invalidSignatureToken = jwt.sign({ data: 'payload' }, 'invalidSecret', { expiresIn: '1h' });
      const req = { headers: { authorization: `Bearer ${invalidSignatureToken}` } };
      const res = {};
      const next = spy();

      try {
        await verifyToken(req, res, next);
        // If the token verification fails, this should not be reached
        expect(true).to.be.false;
      } catch (error) {
        expect(error.message).to.equal('Invalid token provided, please login again to acquire a new token');
        expect(next).not.to.have.been.called();
      }
    });
  });

  describe('requireMemberRole', () => {
    it('should allow access for a user with the member role', () => {
      const req = { currentUser: { role: 'member' } };
      const res = {};
      const next = spy();

      requireMemberRole(req, res, next);

      expect(next).to.have.been.called.once;
    });

    it('should deny access for a user without the member role', () => {
      const req = { currentUser: { role: 'admin' } };
      const res = {};
      const next = spy();

      try {
        requireMemberRole(req, res, next);
        // If the user has the "member" role, this should not be reached
        expect(true).to.be.false;
      } catch (error) {
        expect(error.message).to.equal("Permission denied. User does not have the 'member' role.");
        expect(next).not.to.have.been.called();
      }
    });
  });

  describe('requireAdminRole', () => {
    it('should allow access for a user with the admin role', () => {
      const req = { currentUser: { role: 'admin' } };
      const res = {};
      const next = spy();

      requireAdminRole(req, res, next);

      expect(next).to.have.been.called.once;
    });

    it('should deny access for a user without the admin role', () => {
      const req = { currentUser: { role: 'member' } };
      const res = {};
      const next = spy();

      try {
        requireAdminRole(req, res, next);
        // If the user has the "admin" role, this should not be reached
        expect(true).to.be.false;
      } catch (error) {
        expect(error.message).to.equal("Permission denied. User does not have the 'admin' role.");
        expect(next).not.to.have.been.called();
      }
    });
  });
});
