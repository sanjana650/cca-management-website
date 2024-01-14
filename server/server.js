const express = require("express");
const cors = require("cors");

const connectToDb = require('./db/conn.js');
const userRouter = require('./routes/user.js');
// const otpRouter = require('./routes/otp.js');
// const emailVerificationRouter = require('./routes/emailVerification.js');

const adminUpdatesRouter = require('./routes/adminUpdates.js');
const adminMembersRouter = require('./routes/adminMembers.js');
const adminEventsRouter = require('./routes/adminEvents.js');

const userMembersRouter = require('./routes/userMembers.js');
const userEventsRouter = require('./routes/userEvents.js');
const userUpdatesRouter = require('./routes/userUpdates.js');


const PORT = process.env.PORT || 5050;
const app = express();

const dotenv = require('dotenv');

dotenv.config();

app.use(cors());

//increase payload size limit for JSON and URL-encoded data like base64
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


connectToDb();

app.use("/user", userRouter);
app.use("/user-updates", userUpdatesRouter);
app.use("/user-members", userMembersRouter);
app.use("/user-events", userEventsRouter);
// app.use("/otp", otpRouter);
// app.use("/emailVerification", emailVerificationRouter);


app.use("/admin-updates", adminUpdatesRouter);
app.use("/admin-members", adminMembersRouter);
app.use("/admin-events", adminEventsRouter);


app.get("/", async (req, res) => {
  res.send("CCA MANAGEMENT REACT WEBSITE").status(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});


