import { InsuranceCoverage } from "src/types/coverage";
import { InsuranceDiscount } from "src/types/discounts";

export class Insurance {
  customerName: string = "";
  customerBirthdate: Date | null = null;
  customerCity: string = "";
  vehiclePower: number = 0;
  voucher: number = 0;
  priceMatch: number = 0;
  basePrice: number = 0;
  additionalCoverages: InsuranceCoverage[] = [];
  discounts: InsuranceDiscount[] = [];
  priceBeforeDiscounts: number = 0;
  totalPrice: number = 0;
}

export default Insurance;
