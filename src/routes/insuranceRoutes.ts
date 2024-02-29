import express from "express";
const router = express.Router();
import InsuranceController from "./../controllers/insurance";

// Route to calculate insurance
router.post("/calculate-insurance", InsuranceController.calculateInsurance);

export { router };
