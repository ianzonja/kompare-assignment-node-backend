import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["percentage", "price"], required: true },
  target: { type: String, required: true },
  value: { type: Number, default: null },
  coveragesMin: { type: Number, default: null },
  vehiclePowerMin: { type: Number, default: null },
});

export default discountSchema;
