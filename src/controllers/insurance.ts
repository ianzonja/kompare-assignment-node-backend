import { Request, Response } from "express";
import { getInsuranceModel } from "./../config/db";
import { InsuranceBuilder } from "./../utils/insurance";

export interface CalculateInsuranceRequest {
  name: string;
  birthdate: string;
  city: string;
  vehiclePower: number;
  voucher: number;
  priceMatch: number;
  coverages: string[];
  discounts: string[];
}

class InsuranceController {
  static async calculateInsurance(req: Request, res: Response) {
    try {
      if (req.body) {
        const request: CalculateInsuranceRequest = req.body;
        const dob = new Date(request.birthdate);
        const insuranceBuilder = new InsuranceBuilder();
        const insurance = await insuranceBuilder.buildInsurance(
          request.name,
          dob,
          request.city,
          request.vehiclePower,
          request.voucher,
          request.priceMatch,
          request.coverages,
          request.discounts,
        );
        console.log("insurance finally:");
        console.log(insurance);
        const coverages = [];
        const discounts = [];
        for (const additionalCoverage of insurance.additionalCoverages) {
          coverages.push({
            name: additionalCoverage.coverage.name,
            description: additionalCoverage.coverage.description,
            price: additionalCoverage.price,
          });
        }
        for (const insuranceDiscount of insurance.discounts) {
          discounts.push({
            name: insuranceDiscount.discount.name,
            description: insuranceDiscount.discount.description,
            price: insuranceDiscount.price,
          });
        }
        const insuranceModel = getInsuranceModel();
        await insuranceModel
          .create({
            customerName: insurance.customerName,
            customerBirthdate: insurance.customerBirthdate,
            customerCity: insurance.customerCity,
            voucher: insurance.voucher,
            vehiclePower: insurance.vehiclePower,
            basePrice: insurance.basePrice,
            additionalCoverages: coverages,
            discounts: discounts,
            priceBeforeDiscounts: insurance.priceBeforeDiscounts,
            totalPrice: insurance.totalPrice,
          })
          .then(() => {
            res.status(201).json(insurance);
          });
      } else {
        res.status(500).json("Request body is missing!");
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json("Server error! Please check if your request body is correct.");
    }
  }
}

export default InsuranceController;
