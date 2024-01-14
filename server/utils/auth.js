const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const tokenKey = process.env.TOKEN_KEY;
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  // Check if a token is provided
  if (!token) {
    throw new Error("An authentication token is required");
  }

  // Verify the token
  try {
    const decodedToken = await jwt.verify(token, tokenKey);

    // Check if the token has expired
    if (decodedToken.exp < Date.now() / 1000) {
      // throw new Error("Token has expired, please login again");
      return res.status(401).json({ error: "Token has expired, please login again" });

    }

    // Attach the decoded token to the request
    req.currentUser = decodedToken;

    return next();
  } catch (error) {
    // Check if the error is a TokenExpiredError
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token has expired, please login again" });
    }

    return res.status(401).json({ error: "Invalid token provided, please login again to acquire a new token" });
  }
};

// Middleware to check if the user has the 'member' role
const requireMemberRole = (req, res, next) => {
  const { role } = req.currentUser;

  if (role !== 'member') {
    throw new Error("Permission denied. User does not have the 'member' role.");
  }

  next();
};

// Middleware to check if the user has the 'admin' role
const requireAdminRole = (req, res, next) => {
  const { role } = req.currentUser;

  if (role !== 'admin') {
    throw new Error("Permission denied. User does not have the 'admin' role.");
  }

  next();
};

module.exports = { verifyToken, requireMemberRole, requireAdminRole };
