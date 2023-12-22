import express from "express";
import cors from "cors";
import connectToDb from './db/conn.mjs'; // Imports the function responsible for connecting to the MongoDB database.
import userRouter from './routes/user.mjs';

const PORT = process.env.PORT || 5050;
const app = express();

import dotenv from 'dotenv';

dotenv.config();

app.use(cors());
app.use(express.json());



// Connect to MongoDB
connectToDb();

app.use("/user", userRouter);

app.get("/", async (req, res) => {
  res.send("CCA MANAGEMENT REACT WEBSITE").status(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
