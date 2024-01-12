//connect using mongoose instead of mongoDB client as shown in lab
import mongoose from 'mongoose';


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

export default connectToDb;
