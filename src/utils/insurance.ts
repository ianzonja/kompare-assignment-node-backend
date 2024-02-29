import { Coverage, InsuranceCoverage } from "src/types/coverage";
import { getBaseModel, getCoverageModel, getDiscountModel } from "../config/db";
import { calculateCoveragePrice, calculateDiscountPrice } from "./pricing";
import Insurance from "../models/insurance";
import { InsuranceDiscount } from "src/types/discounts";

interface Builder {
  setCustomerName(name: string): void;
  setCustomerBirthdate(dob: Date): void;
  setCustomerCity(city: string): void;
  setVehiclePower(power: number): void;
  setVoucher(voucher: number): void;
  setPriceMatch(priceMatch: number): void;
  setBasePrice(age: number, city: string): Promise<void>;
  setAdditionalCoverages(coverageNames: string[], age: number): Promise<void>;
  setPriceBeforeDiscounts(): void;
  setDiscounts(discountNames: string[]): void;
  setTotalPrice(): void;
  buildInsurance(
    name: string,
    birthday: Date,
    city: string,
    vehiclePower: number,
    voucher: number,
    priceMatch: number,
    coverages: string[],
    discountes: string[],
  ): Promise<Insurance>;
}

export class InsuranceBuilder implements Builder {
  private insurance: Insurance;
  constructor() {
    this.insurance = new Insurance();
  }

  setCustomerName(name: string): void {
    this.insurance.customerName = name;
  }

  setCustomerBirthdate(dob: Date): void {
    this.insurance.customerBirthdate = dob;
  }

  setCustomerCity(city: string): void {
    this.insurance.customerCity = city;
  }

  setVehiclePower(power: number): void {
    this.insurance.vehiclePower = power;
  }

  setVoucher(voucher: number): void {
    this.insurance.voucher = voucher;
  }

  setPriceMatch(priceMatch: number): void {
    this.insurance.priceMatch = priceMatch;
  }

  async setBasePrice(age: number, city: string): Promise<void> {
    const baseModel = getBaseModel();
    let basePrice = 0;
    const document = await baseModel.findOne({
      ageMin: { $lte: age },
      ageMax: { $gte: age },
      city: city,
    });
    if (document) {
      basePrice = document.price;
    } else {
      if (age >= 18 && age <= 25) {
        basePrice = 90;
      } else if (age >= 26 && age <= 40) {
        basePrice = 95;
      } else if (age >= 41 && age <= 60) {
        basePrice = 100;
      } else if (age >= 61 && age <= 999) {
        basePrice = 105;
      }
    }
    this.insurance.basePrice = basePrice;
  }

  async setAdditionalCoverages(coverageNames: string[], age: number): Promise<void> {
    console.log("coverage names:");
    console.log(coverageNames);
    const finalCoverages: InsuranceCoverage[] = [];
    const additionalCoverages: Coverage[] = [];
    const coverageModel = getCoverageModel();
    const coverages = await coverageModel.find({
      name: coverageNames,
    });
    console.log("from db:");
    console.log(coverages);
    for (const coverage of coverages) {
      if (
        typeof coverage.ageMin === "number" &&
        typeof coverage.ageMax === "number"
      ) {
        if (coverage.ageMin <= age && coverage.ageMax >= age) {
          additionalCoverages.push(coverage);
        }
      } else {
        console.log("?");
        additionalCoverages.push(coverage);
      }
    }
    console.log("filtered:");
    console.log(additionalCoverages);
    for (const additionalCoverage of additionalCoverages) {
      const price = calculateCoveragePrice(additionalCoverage, this.insurance);
      finalCoverages.push({
        coverage: additionalCoverage,
        price: price,
      });
    }
    console.log("final coverages");
    console.log(finalCoverages);
    this.insurance.additionalCoverages = finalCoverages;
    console.log(this.insurance);
  }

  setPriceBeforeDiscounts(): void {
    let price = this.insurance.basePrice;
    for (const coverage of this.insurance.additionalCoverages) {
      price = price + coverage.price;
    }
    this.insurance.priceBeforeDiscounts = price;
  }

  async setDiscounts(discountNames: string[]) {
    const discountModel = getDiscountModel();
    const insuranceDiscounts: InsuranceDiscount[] = [];
    const discounts = await discountModel.find({
      name: discountNames,
    });
    for (const discount of discounts) {
      const price = calculateDiscountPrice(discount, this.insurance);
      insuranceDiscounts.push({
        discount: discount,
        price: price,
      });
    }
    this.insurance.discounts = insuranceDiscounts;
  }

  setTotalPrice(): void {
    let total = this.insurance.priceBeforeDiscounts;
    for (const discount of this.insurance.discounts) {
      total = total - discount.price;
    }
    this.insurance.totalPrice = total;
  }

  async buildInsurance(
    name: string,
    birthday: Date,
    city: string,
    vehiclePower: number,
    voucher: number,
    priceMatch: number,
    coverages: string[],
    discounts: string[]
    ): Promise<Insurance> {
    const now = new Date();
    let age = now.getFullYear() - birthday.getFullYear();
    const hasBirthdayOccurred = now.getMonth() > birthday.getMonth() || (now.getMonth() === birthday.getMonth() && now.getDate() >= birthday.getDate());
    if (!hasBirthdayOccurred) {
      age--;
    }
    this.setCustomerName(name);
    this.setCustomerBirthdate(birthday);
    this.setCustomerCity(city);
    this.setVehiclePower(vehiclePower);
    this.setVoucher(voucher);
    this.setPriceMatch(priceMatch);
    await this.setBasePrice(age, city);
    await this.setAdditionalCoverages(coverages, age);
    this.setPriceBeforeDiscounts();
    await this.setDiscounts(discounts);
    this.setTotalPrice();
    return this.insurance;
  }

  getInsurance(): Insurance {
    return this.insurance;
  }
}

export class PricingUtils {
  async getBasePrice(age: number, city: string) {
    const baseModel = getBaseModel();
    let basePrice = 0;
    const document = await baseModel.findOne({
      ageMin: { $lte: age },
      ageMax: { $gte: age },
      city: city,
    });
    if (document) {
      basePrice = document.price;
    } else {
      if (age >= 18 && age <= 25) {
        basePrice = 90;
      } else if (age >= 26 && age <= 40) {
        basePrice = 95;
      } else if (age >= 41 && age <= 60) {
        basePrice = 100;
      } else if (age >= 61 && age <= 999) {
        basePrice = 105;
      }
    }
    return basePrice;
  }
}
