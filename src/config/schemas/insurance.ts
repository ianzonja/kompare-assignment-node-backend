import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerCity: { type: String, required: true },
  customerBirthdate: { type: Date, required: true },
  vehiclePower: { type: Number, required: true },
  voucher: { type: Number, default: 0 },
  basePrice: { type: Number, required: true },
  additionalCoverages: {
    type: [
      {
        name: String,
        description: String,
        price: Number,
      },
    ],
    default: [],
  },
  discounts: {
    type: [
      {
        name: String,
        description: String,
        price: Number,
      },
    ],
    default: [],
  },
  priceBeforeDiscounts: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

export default insuranceSchema;
