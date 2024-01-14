const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

const { AUTH_EMAIL, AUTH_PASS } = process.env;
let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASS,
  },
  debug: true, // Add this line for detailed logging
});

// test transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

// actually send email
const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully");
    return;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = { sendEmail };
