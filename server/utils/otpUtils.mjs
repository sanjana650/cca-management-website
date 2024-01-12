import { verifyHashedData } from "../utils/hashData.mjs";
import OTP from "../models/otpModel.mjs";
// import User from "../models/userModel.mjs";


//generate a 4 digit otp
const generateOTP = async () => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    return otp;
  } catch (error) {
    throw error;
  }
}


//verifyOTP will use for login,signup
const verifyOTP = async ({ email, otp }) => {
  try {
    // Ensure no missing values
    if (!email) {
      return { error: "Email should be filled" };
    }

    if (!otp) {
      return { error: "Ensure OTP is filled" };
    }

    // Ensure otp record exists
    const matchedOTPRecord = await OTP.findOne({
      email,
    });

    if (!matchedOTPRecord) {
      return { error: "No otp records found" };
    }

    // Checking for expired code
    const { expiresAt } = matchedOTPRecord;
    // Calculate the time difference in seconds
    const timeDifferenceInSeconds = Math.floor((new Date(expiresAt) - Date.now()) / 1000);
    console.log(timeDifferenceInSeconds);

    // Check if OTP is expired (30 seconds duration)
    if (timeDifferenceInSeconds < 0 || timeDifferenceInSeconds > 30) {
      // Delete expired OTP record
      await OTP.deleteOne({ email });
      return { error: "Code has expired. Request for a new one" };
    } else {
      // Verify OTP by unhashing it first
      const hashedOTP = matchedOTPRecord.otp;
      const validOTP = await verifyHashedData(otp, hashedOTP);

      // If OTP is valid, delete the OTP record
      if (validOTP) {
        await OTP.deleteOne({ email });
        console.log('line 60: OTP is valid'); // Log the result before returning
        return { valid: true };
      } else {
        console.log('line 60: OTP is invalid'); // Log the result before returning
        return { valid: false, error: "Invalid OTP" };
      }
    }
  } catch (error) {
    console.error("Error in verify OTP:", error);
    throw error;
  }
};


//verify reset password otp
const resetPasswordVerifyOTP = async ({ email, otp }) => {
  try {
    // Ensure no missing values
    if (!email) {
      return { error: "Email should be filled" };
    }

    if (!otp) {
      return { error: "Ensure OTP is filled" };
    }

    // Ensure otp record exists
    const matchedOTPRecord = await OTP.findOne({
      email,
    });

    if (!matchedOTPRecord) {
      return { error: "No otp records found" };
    }

    // Checking for expired code
    const { expiresAt } = matchedOTPRecord;
    // Calculate the time difference in seconds
    const timeDifferenceInSeconds = Math.floor((new Date(expiresAt) - Date.now()) / 1000);
    console.log(timeDifferenceInSeconds);

    // Check if OTP is expired (30 seconds duration)
    if (timeDifferenceInSeconds < 0 || timeDifferenceInSeconds > 30) {
      // Delete expired OTP record
      await OTP.deleteOne({ email });
      return { error: "Code has expired. Request for a new one" };
    } else {
      // Verify OTP by unhashing it first
      const hashedOTP = matchedOTPRecord.otp;
      const validOTP = await verifyHashedData(otp, hashedOTP);

      // If OTP is valid, delete the OTP record
      if (validOTP) {
        //await OTP.deleteOne({ email });
        console.log('OTP is valid');
        return { valid: true };
      } else {
        console.log('line 60: OTP is invalid');
        return { valid: false, error: "Invalid OTP" };
      }
    }
  } catch (error) {
    console.error("Error in verify OTP:", error);
    throw error;
  }
};



export { generateOTP, verifyOTP, resetPasswordVerifyOTP };