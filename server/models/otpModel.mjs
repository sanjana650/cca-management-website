import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  otp: { type: String },
  createdAt: { type: Date },
  expiresAt: { type: Date },

});

const OTPModel = mongoose.model('otp', OTPSchema);

export default OTPModel;