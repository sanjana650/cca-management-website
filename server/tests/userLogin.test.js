const mongoose = require('mongoose');
const { userModel } = require("../models/userModel.js")


describe('User Login Tests', () => {

  //conect to mongodb memeroy server using mongoose.connect
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

});
