import Insurance from "src/models/insurance";
import { Coverage } from "src/types/coverage";
import { Coverages } from "./../enums/coverages";
import { Discounts } from "./../enums/discounts";
import { Discount } from "src/types/discounts";

export function calculateCoveragePrice(
  coverage: Coverage,
  insurance: Insurance,
) {
  let price = 0;
  if (coverage.name === Coverages.BONUS_PROTECTION) {
    price = insurance.basePrice! * (coverage.value / 100);
  } else if (coverage.name === Coverages.AO) {
    price = coverage.value;
  } else if (coverage.name === Coverages.GLASS_PROTECTION) {
    price = insurance.vehiclePower! * (coverage.value / 100);
  }
  return price;
}

export function calculateDiscountPrice(
  discount: Discount,
  insurance: Insurance,
) {
  let price = 0;
  if (
    discount.name === Discounts.ADVISER &&
    insurance.additionalCoverages.length === 2
  ) {
    let sum = 0;
    for (const coverage of insurance.additionalCoverages) {
      sum = sum + coverage.price;
    }
    price = sum * (discount.value! / 100);
  } else if (discount.name === Discounts.COMMERCIAL) {
    price = insurance.basePrice * (discount.value! / 100);
  } else if (discount.name === Discounts.STRONG_CAR_SURCHARGE) {
    price = insurance.priceBeforeDiscounts * (discount.value! / 100);
  } else if (discount.name === Discounts.VIP) {
    price = insurance.priceBeforeDiscounts * (discount.value! / 100);
  }
  return price;
}
