import OTP from "../models/otpModel.mjs";
import { generateOTP } from "../utils/generateOTP.mjs";
import { sendEmail } from "../utils/sendEmail.mjs";
import { hashData, verifyHashedData } from "../utils/hashData.mjs";
const { AUTH_EMAIL } = process.env;

const sendOTP = async ({ email, subject, message, duration = 1 }) => {
  try {
    // Ensure no missing values
    if (!(email && subject && message)) {
      throw Error("Provide values for email, subject, and message");
    }

    // Clear any old records of OTP
    await OTP.deleteOne({ email });

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

    // Save OTP record in the database
    const hashedOTP = await hashData(generatedOTP);
    const newOTP = new OTP({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * +duration,
    });

    const createdOTPRecord = await newOTP.save();
    return createdOTPRecord;
  } catch (error) {
    throw error;
  }
};

const verifyOTP = async ({ email, otp }) => {
  try {
    // Ensure no missing values
    if (!(email && otp)) {
      throw Error("Provide values for email and otp");
    }

    //ensure otp record exists
    const matchedOTPRecord = await OTP.findOne({
      email
    });
    if (!matchedOTPRecord) {
      throw Error("No otp records found")
    }

    //checking for expired code
    const { expiresAt } = matchedOTPRecord;

    if (expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      throw Error("Code has expired. Request for a new one")
    }

    //not expired yet, verify otpp by unhashing it first
    const hashedOTP = matchedOTPRecord.otp;
    const validOTP = await verifyHashedData(otp, hashedOTP);
    return validOTP;

  } catch (error) {
    throw error;
  }
}

const deleteOTP = async (email) => {
  try {
    await OTP.deleteOne({ email });
  } catch (error) {
    throw error;
  }
}

const sendLoginVerificationOTP = async ({ email, subject, message, duration = 1 }) => {
  try {
    // Ensure no missing values
    if (!(email && subject && message)) {
      throw Error("Provide values for email, subject, and message");
    }

    // Find existing OTP record for the same email and loginType "login"
    let existingOTPRecord = await OTP.findOne({ email});

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

    // Save or update OTP record in the database
    const hashedOTP = await hashData(generatedOTP);

    if (existingOTPRecord) {
      // Update existing OTP record
      existingOTPRecord.otp = hashedOTP;
      existingOTPRecord.createdAt = Date.now();
      existingOTPRecord.expiresAt = Date.now() + 3600000 * +duration;
      await existingOTPRecord.save();
    } else {
      // Create a new OTP record
      const newOTP = new OTP({
        email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000 * +duration,
      });

      await newOTP.save();
    }

    return true; // Indicate successful OTP generation and sending
  } catch (error) {
    throw error;
  }
};




export { sendOTP, verifyOTP, deleteOTP, sendLoginVerificationOTP };
