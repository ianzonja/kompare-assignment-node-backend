import express from "express";
import { connectToDatabase } from "./config/db";
import { insertToDB } from "./config/inserts";
import { router } from "./routes/insuranceRoutes";
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.PORT) || 8000;

const app = express();
app.use(cors())
app.use(express.json());
app.use(router);
connectToDatabase();
insertToDB();

app.listen(port, "0.0.0.0", () => {
  console.log(`now listening on port ${port}`);
});
