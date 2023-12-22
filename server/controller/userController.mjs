import User from "../models/userModel.mjs";
import { hashData, verifyHashedData } from "../utils/hashData.mjs";
import { createToken } from "../utils/createToken.mjs";


const createNewUser = async (data) => {
  try {
    const { email, name, age, diploma, about, password } = data;

    //checking if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw Error("User with provided email already exists");
    }

    //hash password
    const hashedPassword = await hashData(password);
    const newUser = new User({
      email,
      name,
      age,
      diploma,
      about,
      password: hashedPassword
    });
    //save user
    const createdUser = await newUser.save();
    return createdUser;

  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (data) => {
  try {
    const { email, password } = data;
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      throw Error("Invalid credentials entered!");
    }

    const hashedPassword = fetchedUser.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);

    if (!passwordMatch) {
      throw Error("Invalid password entered")
    }

    //create new token if password matches
    const tokenData = { userId: fetchedUser._id, email };
    const token = await createToken(tokenData);

    //assign user token
    fetchedUser.token = token;
    return fetchedUser;

  } catch (error) {
    throw error;
  }
}


export { createNewUser, authenticateUser };
