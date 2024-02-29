import mongoose from "mongoose"

const coverageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["percentage", "price"], required: true },
    target: { type: String, required: true },
    value: { type: Number, required: true },
    ageMin: { type: Number, default: null },
    ageMax: { type: Number, default: null }
});

export default coverageSchema