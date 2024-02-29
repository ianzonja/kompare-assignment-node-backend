import dotenv from "dotenv";
import mongoose from "mongoose";
import discountSchema from "./schemas/discount";
import coverageSchema from "./schemas/coverage";
import baseSchema from "./schemas/base";
import insuranceSchema from "./schemas/insurance";
dotenv.config(); // Load environment variables from .env file

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  const connectionUri = uri! + dbName!;

  mongoose
    .connect(connectionUri)
    .then(() => {
      console.log("Connected to MongoDB!");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}

export function getCoverageModel() {
  const Coverage = mongoose.model("Coverage", coverageSchema);
  return Coverage;
}

export function getDiscountModel() {
  const Discount = mongoose.model("Discount", discountSchema);
  return Discount;
}

export function getBaseModel() {
  const Base = mongoose.model("Base", baseSchema);
  return Base;
}

export function getInsuranceModel() {
  const Insurance = mongoose.model("Insurance", insuranceSchema);
  return Insurance;
}
