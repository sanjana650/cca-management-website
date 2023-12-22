import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const createToken = async (
  tokenData,  //user details
  tokenKey = process.env.TOKEN_KEY,
  expiresIn = process.env.TOKEN_EXPIRY
) => {
  try {
    const token = await jwt.sign(tokenData, tokenKey, { expiresIn });
    return token;
  } catch (error) {
    throw error;
  }
};

export { createToken };
