import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profile_pic:{type:String},
  email: { type: String, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  diploma: { type: String, required: true },
  about: { type: String, required: true },
  password: { type: String, required: true },
  events_signedup: { type: Array },
  role: { type: String },
  verified: { type: Boolean, default: false },
  login_verified: { type: Boolean, default: false }
});

const UserModel = mongoose.model('users', userSchema);

export default UserModel;