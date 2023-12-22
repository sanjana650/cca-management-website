import jwt from "jsonwebtoken";

//gives access to certain functions if jwt token is valid after user logs in
const verifyToken = async (req, res, next) => {
  const tokenKey = process.env.TOKEN_KEY;
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  //check if provided token exists
  if (!token) {
    return res.status(403).send("An authentication token is required");
  }
  //verify token
  try {
    const decodedToken = await jwt.verify(token, tokenKey);
    req.currentUser = decodedToken;

  } catch (error) {
    return res.status(401).send("Invalid token provided");
  }

  return next();
}

export { verifyToken };
