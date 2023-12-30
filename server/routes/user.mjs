import express from "express";
import { checkUserLoginCred, verifyLoginOTP, createNewUserSendOTP, verifySignupOTP, resendSignupOTP, checkAdminLoginCred, viewProfile, editProfile } from "../controller/userController.mjs" //controller
import { verifyToken, requireMemberRole, requireAdminRole } from "../utils/auth.mjs";
import User from "../models/userModel.mjs";

import multer from "multer";

const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

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


router.post('/signup-and-send-otp', upload.single('image'), async (req, res) => {
  try {

    let { profile_pic, email, name, age, diploma, about, password } = req.body;
    // Check if a file was uploaded
    const imageBuffer = req.body.profile_pic;

    if (!imageBuffer) {
      return res.status(400).json({ error: "No image uploaded" });
    }


    // Trim whitespaces from input fields
    profile_pic = profile_pic.trim();
    email = email.trim();
    name = name.trim();
    diploma = diploma.trim();
    about = about.trim();
    password = password.trim();

    // Validate input fields
    if (!profile_pic || !email || !name || !age || !diploma || !about || !password) {
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
      profile_pic: imageBuffer,  // Pass the image buffer to the controller
      email,
      name,
      age,
      diploma,
      about,
      password,
      role,
    });

    res.status(200).json(createdUser);

  } catch (error) {
    console.error('Error during image upload:', error.message);
    res.status(400).json({ error: 'Bad Request. Check your input data.' });
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


// View profile of the user (requires token verification and 'member' role)
router.get('/view-profile/:id', verifyToken, requireMemberRole, async (req, res) => {
  try {
    let { id } = req.params;
    let userProfile = await viewProfile({ id });
    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

//edit profile
// router.patch('/edit-profile/:id', verifyToken, requireMemberRole, async (req, res) => {
//   try {
//     let { id } = req.params;
//     let { profile_pic, name, age, diploma, about, password } = req.body;
//     let updatedProfile = await editProfile({ id, profile_pic, name, age, diploma, about, password });
//     res.json(updatedProfile);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// })
router.patch('/edit-profile/:id', verifyToken, requireMemberRole, upload.single('profile_pic'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, diploma, about, password } = req.body;
    const profilePic = req.file; // This should now contain the uploaded file data

    let body = { name, age, diploma, about, password };

    if (profilePic) {
      // If a new profile picture is uploaded, handle it accordingly
      // You might want to save the file to disk or a cloud storage service
      // and store the file path or URL in your database.
      // For now, I'll assume you save it as a base64-encoded string.
      body.profile_pic = profilePic.buffer.toString('base64');
    }

    const updatedUserProfile = await User.findByIdAndUpdate(id, body, { new: true });
    if (!updatedUserProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    return res.status(200).json({ updatedUserProfile });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//delete profile


//log out
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { $set: { login_verified: false } }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

export default router;

