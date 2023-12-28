import jwt from 'jsonwebtoken';

// Check and Verify a JWT 
const verifyToken = async (req, res, next) => {
  const tokenKey = process.env.TOKEN_KEY;
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // Check if a token is provided
  if (!token) {
    return res.status(403).send("An authentication token is required");
  }

  // Verify the token
  try {
    const decodedToken = await jwt.verify(token, tokenKey);
    console.log('Decoded Token:', decodedToken);

    //check if the token has expired
    if (decodedToken.exp < Date.now() / 1000) {
      return res.status(401).send("Token has expired, please login again");
    }

    // Attach the decoded token to the request
    req.currentUser = decodedToken;

  } catch (error) {
    //console.error('Token Verification Error:', error);

    // Check if the error is a TokenExpiredError
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send("Token has expired, please login again");
    }

    // For other errors, return "Invalid token provided"
    return res.status(401).send("Invalid token provided, please login again to acquire a new token");
  }

  return next();
};

export { verifyToken };
