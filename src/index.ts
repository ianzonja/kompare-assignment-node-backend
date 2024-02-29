import express, { Request, Response } from "express";
import { connectToDatabase } from "./config/db";
import { insertToDB } from "./config/inserts";
import { router } from "./routes/insuranceRoutes";
import dotenv from "dotenv";
dotenv.config();

const port = 8000;

const app = express();
app.use(express.json());
app.use(router);
connectToDatabase();
insertToDB();
console.log(dotenv.config());
console.log(process.env.BASE);

app.get("/", (_req: Request, res: Response) => {
  res.send("HELLO FROM EXPRESS + TS!!");
});

app.get("/hi", (_req: Request, res: Response) => {
  res.send("BYEEE!!");
});

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
