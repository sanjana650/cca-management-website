import { createNewUser, authenticateUser } from "../controller/userController.mjs" //controller
import { verifyToken } from "../utils/auth.mjs";

import express from "express";

const router = express.Router();
const auth = verifyToken;


//signup
router.post('/signup', async (req, res) => {
  try {
    let { email, name, age, diploma, about, password } = req.body;

    email = email.trim();
    name = name.trim();
    diploma = diploma.trim();
    about = about.trim();
    password = password.trim();

    if (email == "" || name == "" || age == "" || diploma == "" || about == "" || password == "") {
      throw Error("Empty input fields");
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      throw Error("Invalid name entered");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw Error("Invalid email entered");
    } else if (password.length < 6) {
      throw Error("Password is too short");
    } else {
      const createdUser = await createNewUser({
        email, name, age, diploma, about, password
      });
      res.status(200).json({
        status: "SUCCESS",
        message: "Signup successful",
        data: createdUser
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email === "" || password === "") {
      throw new Error("Empty credentials given");
    }

    const authenticatedUser = await authenticateUser({ email, password });
    res.status(200).json(authenticatedUser);

  } catch (error) {
    res.status(400).send(error.message);
  }
});

//example function to show how to determine whether the user login is successful and has access to certain things using jwt
router.get("/private_data", auth, (req, res) => {
  res
    .status(200)
    .send(`you're in private territory of ${req.currentUser.email}`)
})



export default router;
