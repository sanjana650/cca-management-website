import express from "express";
import cors from "cors";
import connectToDb from './db/conn.mjs'; // Imports the function responsible for connecting to the MongoDB database.
import userRouter from './routes/user.mjs';
// import otpRouter from './routes/otp.mjs';
// import emailVerificationRouter from './routes/emailVerification.mjs';


// import adminUpdatesRouter from './routes/adminUpdates.mjs';
// import adminMembersRouter from './routes/adminMembers.mjs';
// import adminEventsRouter from './routes/adminEvents.mjs';

// import userMembersRouter from './routes/userMembers.mjs';
// import userEventsRouter from './routes/userEvents.mjs';


const PORT = process.env.PORT || 5050;
const app = express();

import dotenv from 'dotenv';

dotenv.config();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDb();

app.use("/user", userRouter);
// app.use("/otp", otpRouter);
// app.use("/emailVerification", emailVerificationRouter);


// app.use("/adminUpdates", adminUpdatesRouter);
// app.use("/adminMembers", adminMembersRouter);
// app.use("/adminEvents", adminEventsRouter);

// app.use("/userMembers", userMembersRouter);
// app.use("/userEvents", userEventsRouter);



app.get("/", async (req, res) => {
  res.send("CCA MANAGEMENT REACT WEBSITE").status(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
