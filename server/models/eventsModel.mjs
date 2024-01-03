import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema({
  event_image: { type: String, required: true },
  title: { type: String, required: true },
  event_type: { type: String, required: true },
  event_date: { type: String, required: true },
  event_time: { type: String, required: true },
  location: { type: String, required: true },
  max_slots: { type: Number, required: true },
  count: { type: Number },
  description: { type: String, required: true },
  members_signedup: { type: Array },


});

const eventsModel = mongoose.model('events', eventsSchema);

export default eventsModel;


