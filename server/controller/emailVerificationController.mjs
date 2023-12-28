import User from "../models/userModel.mjs";
import { sendOTP, verifyOTP, deleteOTP } from "../controller/otpController.mjs" //controller

//send the email with otp
const sendVerificationOTPEmail = async (email) => {
  try {
    //check if account exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw Error("There's no account for the provided email.")
    }

    const otpDetails = {
      email,
      subject: "Email Verification",
      message: "Verify your email with the code below",
      duration: 1
    };
    const createdOTP = await sendOTP(otpDetails);
    return createdOTP
  } catch (error) {
    throw error;
  }
}

//verify the otp & remove them from the otp collection in db
const verifyUserEmail = async ({ email, otp }) => {
  try {
    const validOTP = await verifyOTP({ email, otp });
    if (!validOTP) {
      throw Error("Invalid code passed. Check you inbox.")
    }

    //update the user status from false to true for verified value
    await User.updateOne({ email }, { login_verified: true });


    //delete the user from the otp collection since they are verified
    await deleteOTP(email);
    return;
  } catch (error) {
    throw error;
  }
}


export { sendVerificationOTPEmail, verifyUserEmail };

