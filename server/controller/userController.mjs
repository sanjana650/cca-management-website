import User from "../models/userModel.mjs";
import OTP from "../models/otpModel.mjs";
import { hashData, verifyHashedData } from "../utils/hashData.mjs";
import { generateOTP, verifyOTP } from "../utils/otpUtils.mjs";
import { sendEmail } from "../utils/sendEmail.mjs";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
const { AUTH_EMAIL, TOKEN_EXPIRY, TOKEN_KEY } = process.env;

//LOGIN

//create a JWT token
const createToken = (data) => {
  // Use a secure, random secret key for signing the token
  const secretKey = TOKEN_KEY;

  // Create the token with an expiration time (e.g., 1 hour)
  const token = jwt.sign(data, secretKey, { expiresIn: TOKEN_EXPIRY }); // Pass expiresIn as an options object
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

      return { email }; // Return email for further processing (e.g., OTP verification)
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


//send otp email for signup & login
const sendVerificationOTP = async ({ email, subject, message, duration = 30 }) => {
  try {

    // Fetch user by email
    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      return { error: "User not found" };
    }

    // Ensure no missing values
    if (!(email && subject && message)) {
      return { error: "Provide values for email, subject, and message" };

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

    return { token }; // Return the result here
  } catch (error) {
    throw error;
  }
};


//sign up and send verification otp email 
const createNewUserSendOTP = async (data) => {
  try {
    const { email, name, age, diploma, about, password, role } = data;

    //checking if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { error: "User with provided email already exists" };
    }

    else {
      //hash password
      const hashedPassword = await hashData(password);
      const newUser = new User({
        email,
        name,
        age,
        diploma,
        about,
        password: hashedPassword,
        role
      });
      //save user
      const createdUser = await newUser.save();

      // If credentials are correct, send verification OTP
      const signupVerificationOptions = {
        email,
        subject: "Member registration Verification",
        message: "Verify your account with the code below",
        duration: 30, // Set duration to 30 seconds
      };

      //send otp email
      await sendVerificationOTP(signupVerificationOptions)


      return createdUser;
    }

  } catch (error) {
    throw error;
  }
}

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

//view profile
const viewProfile = async (data) => {
  try {
    const { userId, role, id } = data;
    // check if id and userId match and role is member
    if (userId !== id && role !== 'member') {
      return { error: "Permission denied" };
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

export { checkUserLoginCred, verifyLoginOTP, createNewUserSendOTP, verifySignupOTP, resendSignupOTP, checkAdminLoginCred, viewProfile };
