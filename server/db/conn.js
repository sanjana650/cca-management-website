const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/cca-management-project', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = connectToDb;
