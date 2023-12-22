import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  diploma: { type: String, required: true },
  about: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String }, //jwt token
  events_signedup: { type: Array },
});

const UserModel = mongoose.model('users', userSchema);

export default UserModel;