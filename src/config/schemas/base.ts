import mongoose from "mongoose";

const baseSchema = new mongoose.Schema({
  city: { type: String, required: true },
  ageMin: { type: String, required: true },
  ageMax: { type: String, required: true },
  price: { type: Number, required: true },
});

export default baseSchema;
