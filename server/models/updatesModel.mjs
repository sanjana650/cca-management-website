import mongoose from "mongoose";

const updatesSchema = new mongoose.Schema({
  content: { type: String, required: true },
  date_posted: { type: String }
});

const updatesModel = mongoose.model('updates', updatesSchema);

export default updatesModel;