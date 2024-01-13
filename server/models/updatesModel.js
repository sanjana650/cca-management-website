const mongoose = require("mongoose");

const updatesSchema = new mongoose.Schema({
  content: { type: String, required: true },
  date_posted: { type: String }
});

const updatesModel = mongoose.model('updates', updatesSchema);

module.exports = updatesModel;
