const User = require("../models/userModel.js");
const OTP = require("../models/otpModel.js");
const { hashData, verifyHashedData } = require("../utils/hashData.js");
const { generateOTP, verifyOTP, resetPasswordVerifyOTP } = require("../utils/otpUtils.js");
const { sendEmail } = require("../utils/sendEmail.js");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const  eventsModel  = require("../models/eventsModel.js")


dotenv.config();
const { AUTH_EMAIL, TOKEN_EXPIRY, TOKEN_KEY } = process.env;

//LOGIN

//create a JWT token
const createToken = (data) => {
  const secretKey = TOKEN_KEY;

  // Create the token with an expiration time 
  const token = jwt.sign(data, secretKey, { expiresIn: TOKEN_EXPIRY });
  return token;
};

//function that checks if credentials are valid and then calls the function to verify if otp is correct
const checkUserLoginCred = async (data) => {
  try {
    const { email, password, role } = data;

    // Fetch user by email
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      return { error: "Email not found" };
    }

    // Check for missing or incorrect parameters before proceeding
    if (!password || !role || !email) {
      return { error: "Missing or incorrect data parameters" };
    }

    const hashedPassword = fetchedUser.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);

    if (!passwordMatch) {
      return { error: "Invalid password entered" };
    }

    if (fetchedUser.verified == false) {
      return { error: "Verify your account first before logging in" };
    }

    if (role == 'member' && fetchedUser.role == 'member') {
      // If credentials are correct, send verification OTP
      const loginVerificationOptions = {
        email,
        subject: "Login Verification",
        message: "Verify your login with the code below",
        duration: 30, // Set duration to 30 seconds
      };

      await sendVerificationOTP(loginVerificationOptions);

      return { email };
    }
    else {
      return { error: "Only members can login" };

    }

  } catch (error) {
    throw error;
  }
};

const checkAdminLoginCred = async (data) => {
  try {
    const { email, password, role } = data;

    // Fetch user by email
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      return { error: "Email not found" };
    }

    // Check for missing or incorrect parameters before proceeding
    if (!password || !role || !email) {
      return { error: "Missing or incorrect data parameters" };
    }

    if (role == 'admin' && fetchedUser.role == 'admin') {
      // Fetch user by email
      const fetchedUser = await User.findOne({ email });


      const hashedPassword = fetchedUser.password;
      const passwordMatch = await verifyHashedData(password, hashedPassword);

      if (!passwordMatch) {
        return { error: "Invalid password entered" };
      }

      if (fetchedUser.verified == false) {
        return { error: "Verify your account first before logging in" };
      }

      // If credentials are correct, send verification OTP
      const loginVerificationOptions = {
        email,
        subject: "Login Verification",
        message: "Verify your login with the code below",
        duration: 30, // Set duration to 30 seconds
      };

      await sendVerificationOTP(loginVerificationOptions);

      return { email }; // Return email for further processing (e.g., OTP verification)
    }
    else {
      return { error: "Only admins can log in" };
    }


  } catch (error) {
    throw error;
  }
};


//send otp email for signup & login worked before testing revert back to this if error
const sendVerificationOTP = async ({ email, subject, message, duration = 30 }) => {
  try {

    // Ensure no missing values
    if (!(email || subject || message)) {
      return { error: "Provide values for email, subject, and message" };
    }

    // Fetch user by email
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      return { error: "User not found" };
    }

    // Find existing OTP record for the same email
    let existingOTPRecord = await OTP.findOne({ email });

    // Generate new pin
    const generatedOTP = await generateOTP();

    // Send email
    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject,
      html: `<p>${message}</p>
        <p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOTP} </b>[Expires in ${duration} seconds]</p>`,
    };
    await sendEmail(mailOptions);

    //save or update OTP record in the database
    const hashedOTP = await hashData(generatedOTP);

    if (existingOTPRecord) {
      //update existing OTP record
      existingOTPRecord.otp = hashedOTP;
      existingOTPRecord.createdAt = Date.now();
      existingOTPRecord.expiresAt = Date.now() + 1000 * duration; // Convert seconds to milliseconds
      await existingOTPRecord.save();
    } else {
      //create a new OTP record
      const newOTP = new OTP({
        email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * duration, // Convert seconds to milliseconds

      });

      await newOTP.save();
    }

    return true; // Indicate successful OTP generation and sending
  } catch (error) {
    throw error;
  }
};



//verify login otp & actually login user
const verifyLoginOTP = async (data) => {
  try {
    const { email, otp } = data;

    // Fetch user by email
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      return { error: "User not found" };
    }

    //verify OTP for login
    const otpResult = await verifyOTP({ email, otp });

    if (otpResult.error) {
      //handle the error from verifyOTP
      return { error: otpResult.error };
    }

    // OTP verification succeeded, update login_verified status
    fetchedUser.login_verified = true;
    await fetchedUser.save();


    // create a new token if password matches 
    const tokenData = {
      userId: fetchedUser._id,
      email: fetchedUser.email,
      role: fetchedUser.role,
    };
    const token = await createToken(tokenData);

    return { token };
  } catch (error) {
    throw error;
  }
};

// Sign up and send verification OTP email
const createNewUserSendOTP = async (data) => {
  try {
    let { profile_pic, email, name, age, diploma, about, password, role } = data;

    // Trim whitespaces from input fields
    profile_pic = profile_pic.trim();
    email = email.trim();
    name = name.trim();
    diploma = diploma.trim();
    about = about.trim();
    password = password.trim();


    // Checking if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { error: "User with provided email already exists" };
    } else {

      // Validate input fields
      if (!profile_pic || !email || !name || !age || !diploma || !about || !password) {
        return { error: "Empty input fields" };
      }

      if (!/^[a-zA-Z0-9 ]*$/.test(name)) {
        return { error: "Invalid name entered" };
      }

      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return { error: "Invalid email entered" };
      }

      if (password.length < 6) {
        return { error: "Password is too short" };
      }

      // Hash password
      const hashedPassword = await hashData(password);
      const newUser = new User({
        profile_pic,
        email,
        name,
        age,
        diploma,
        about,
        password: hashedPassword,
        role
      });

      // Save user
      const createdUser = await newUser.save();

      // If credentials are correct, send verification OTP
      const signupVerificationOptions = {
        email,
        subject: "Member registration Verification",
        message: "Verify your account with the code below",
        duration: 30, // Set duration to 30 seconds
      };

      // Send OTP email
      await sendVerificationOTP(signupVerificationOptions);

      return createdUser;
    }
  } catch (error) {
    throw error;
  }
};

//verify signup otp & make user verified
const verifySignupOTP = async (data) => {
  try {
    const { email, otp } = data;


    // Fetch user by email
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      return { error: "User not found" };
    }

    // Verify OTP for signup
    const otpResult = await verifyOTP({ email, otp });

    if (otpResult.error) {
      //handle the error from verifyOTP
      return { error: otpResult.error };
    }
    // OTP verification succeeded, update verified status
    fetchedUser.verified = true;
    await fetchedUser.save();

    //return user details
    const user = await User.findOne({ email });

    await fetchedUser.save(); //SAVE TOKEN TO DB
    return { email, user }; // Return the result here

  } catch (error) {
    throw error;
  }
}

//resend otp for sign up if the user is created but is not verified
const resendSignupOTP = async (data) => {
  try {
    const { email } = data;

    // Ensure no missing values
    if (!email) {
      return { error: "Provide a value for email" };
    }

    // Fetch user by email
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      return { error: "User not found" };
    }

    if (fetchedUser.verified === true) {
      return { error: "User is already verified please login" };

    }

    // Find existing OTP record for the same email
    let existingOTPRecord = await OTP.findOne({ email });

    // Generate new pin
    const generatedOTP = await generateOTP();

    const subject = "Resend OTP for Sign Up";
    const message = "Verify your OTP for sign up"
    const duration = 30;

    // Send email
    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject,
      html: `<p>${message}</p>
    <p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOTP} </b>[Expires in ${duration} hour]</p>`,
    };
    await sendEmail(mailOptions);

    //save or update OTP record in the database
    const hashedOTP = await hashData(generatedOTP);

    if (existingOTPRecord) {
      //update existing OTP record
      existingOTPRecord.otp = hashedOTP;
      existingOTPRecord.createdAt = Date.now();
      existingOTPRecord.expiresAt = Date.now() + 1000 * duration; // Convert seconds to milliseconds
      await existingOTPRecord.save();
    } else {
      //create a new OTP record
      const newOTP = new OTP({
        email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * duration, // Convert seconds to milliseconds
      });

      await newOTP.save();
    }

    return { message: "Email sent" }; // Indicate successful OTP generation and sending
  } catch (error) {
    throw error;
  }
};

//send otp for reset password
const resetPasswordOTP = async (data) => {
  try {
    const { email } = data;

    // Ensure no missing values
    if (!email) {
      return { error: "Provide a value for email" };
    }

    // Fetch user by email
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      return { error: "User not found" };
    }


    // Find existing OTP record for the same email
    let existingOTPRecord = await OTP.findOne({ email });

    // Generate new pin
    const generatedOTP = await generateOTP();

    const subject = "Resend OTP for Sign Up";
    const message = "Verify your OTP for sign up"
    const duration = 30;

    // Send email
    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject,
      html: `<p>${message}</p>
    <p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOTP} </b>[Expires in ${duration} hour]</p>`,
    };
    await sendEmail(mailOptions);

    //save or update OTP record in the database
    const hashedOTP = await hashData(generatedOTP);

    if (existingOTPRecord) {
      //update existing OTP record
      existingOTPRecord.otp = hashedOTP;
      existingOTPRecord.createdAt = Date.now();
      existingOTPRecord.expiresAt = Date.now() + 1000 * duration; // Convert seconds to milliseconds
      await existingOTPRecord.save();
    } else {
      //create a new OTP record
      const newOTP = new OTP({
        email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000 * duration, // Convert seconds to milliseconds

      });

      await newOTP.save();
    }

    return { message: "Email sent" }; // Indicate successful OTP generation and sending
  } catch (error) {
    throw error;
  }
};

//verify otp for reset password
const resetPassword = async (data) => {
  try {
    const { otp, email, password } = data;
    console.log('email:' + email)
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      return { message: "User not found" };
    }

    // Verify OTP for signup
    const otpResult = await resetPasswordVerifyOTP({ email, otp });

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }
    if (await bcrypt.compare(password, fetchedUser.password)) {
      return { error: 'Password must be different from the old password' };
    }

    if (otpResult.error) {
      return { error: otpResult.error };
    }

    // Hash the new password
    const hashedNewPassword = await hashData(password);

    // Update the user's password only if all conditions are met
    await User.updateOne({ email }, { password: hashedNewPassword });
    // Delete the OTP record after successful password update
    await OTP.deleteOne({ email });

    return { message: 'Password updated successfully' };
  } catch (error) {
    throw error;
  }
}



//view profile
const viewProfile = async (data) => {
  try {
    let { id } = data;

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return { error: 'Invalid user ID' };
    }

    // fetch user profile from the database based on id
    const userProfile = await User.findById(id);

    if (!userProfile) {
      return { error: 'User profile not found' };

    }
    return { userProfile };
  } catch (error) {
    throw error;
  }
};

// edit profile
const editProfile = async (data) => {
  try {
    // const { id, profile_pic, name, age, diploma, about, password } = data;
    const { id, profile_pic, name, age, diploma, about } = data;


    // Construct the body with the fields to be updated
    // const body = { name, age, diploma, about, password };
    const body = { name, age, diploma, about };


    // If a new profile_pic is provided, update it
    if (profile_pic) {
      body.profile_pic = profile_pic;
    }

    // Find and update the user profile
    const updatedUserProfile = await User.findOneAndUpdate({ _id: id }, body, { new: true });

    // Check if the user profile was found
    if (!updatedUserProfile) {
      return { error: 'User profile not found' };
    }

    return { updatedUserProfile };
  } catch (error) {
    throw error;
  }
};

//delete profile
// const deleteUser = async (req, res) => {
//   try {
//     const deleted = await User.findByIdAndDelete(req.params.id, { new: true });

//     if (!deleted) {
//       return { error: "User not found" };
//     }

//     res.json({ message: "User deleted successfully" });
//     return deleted;
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// delete profile
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    //remove them from events they signed up to

    if (!deleted) {
      return { error: 'User not found' };
      //return res.status(404).json({ error: "User not found" });
    }

    return { message: "User deleted successfully" };

  } catch (error) {
    throw error;
  }
};

module.exports = { createToken, checkUserLoginCred, verifyLoginOTP, createNewUserSendOTP, verifySignupOTP, resendSignupOTP, checkAdminLoginCred, viewProfile, editProfile, deleteUser, resetPasswordOTP, resetPassword, sendVerificationOTP };
