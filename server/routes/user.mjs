import express from "express";
import { checkUserLoginCred, verifyLoginOTP, createNewUserSendOTP, verifySignupOTP, resendSignupOTP, checkAdminLoginCred } from "../controller/userController.mjs" //controller

const router = express.Router();

//check login(email & password credentials) & then send otp email
router.post('/login-and-send-otp', async (req, res) => {
  try {
    let { email, password, role } = req.body;

    // Trim whitespaces from input fields
    email = email.trim();
    password = password.trim();
    role = role.trim()

    // Validate input fields
    if (!email || !password) {
      throw new Error("Empty credentials given");
    }

    // Login, send OTP, and return email
    const result = await checkUserLoginCred({ email, password, role });
    res.status(200).json(result);
  }
  catch (error) {
    res.status(400).send(error.message);
  }
})

router.post('/admin-login-and-send-otp', async (req, res) => {
  try {
    let { email, password, role } = req.body;

    // Trim whitespaces from input fields
    email = email.trim();
    password = password.trim();
    role = role.trim()

    // Validate input fields
    if (!email || !password) {
      throw new Error("Empty credentials given");
    }

    // Login, send OTP, and return email
    const result = await checkAdminLoginCred({ email, password, role });
    res.status(200).json(result);
  }
  catch (error) {
    res.status(400).send(error.message);
  }
})

//verify the otp for login verification
router.post('/verify-login-otp', async (req, res) => {
  try {
    let { otp, email } = req.body;


    // Ensure no missing values
    if (!(email && otp)) {
      throw Error("Provide values for email and otp");
    }

    const result = await verifyLoginOTP({ email, otp })
    res.status(200).json(result);

  } catch (error) {
    res.status(400).send(error.message || "An error occurred");
  }
});

router.post('/signup-and-send-otp', async (req, res) => {
  try {

    let { email, name, age, diploma, about, password } = req.body;

    // Trim whitespaces from input fields
    email = email.trim();
    name = name.trim();
    diploma = diploma.trim();
    about = about.trim();
    password = password.trim();


    // Validate input fields
    if (!email || !name || !age || !diploma || !about || !password) {
      return res.status(400).json({ error: "Empty input fields" });
    }

    if (!/^[a-zA-Z0-9 ]*$/.test(name)) {
      return res.status(400).json({ error: "Invalid name entered" });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ error: "Invalid email entered" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password is too short" });
    }

    // Create user and send verification email
    const role = "member";
    const createdUser = await createNewUserSendOTP({
      email, name, age, diploma, about, password, role
    });

    res.status(200).json(createdUser);

  } catch (error) {
    res.status(400).send(error.message);
  }
});

//verify sign up otp and change verified status to true
router.post('/verify-signup-otp', async (req, res) => {
  try {
    let { otp, email } = req.body;
    // Ensure no missing values
    if (!(email && otp)) {
      throw Error("Provide values for email and otp");
    }

    const result = await verifySignupOTP({ email, otp })
    res.status(200).json(result);

  } catch (error) {
    res.status(400).send(error.message || "An error occurred");
  }
});

router.post('/resend-signup-otp', async (req, res) => {
  try {
    let { email } = req.body;

    const result = await resendSignupOTP({ email });
    res.status(200).json(result);

  } catch (error) {
    res.status(400).send(error.message || "An error occurred");

  }
})


export default router;

//verifyOTP
//createToken
//loginUserAndSendVerificationOTP
//