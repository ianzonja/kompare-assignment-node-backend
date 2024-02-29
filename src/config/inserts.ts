import { getBaseModel, getCoverageModel, getDiscountModel } from "./db";
import basePricesData from "./../data/base.json";
import { BasePrice } from "./../types/basePrice";
import coveragesData from "./../data/coverages.json";
import { Coverage } from "./../types/coverage";
import discountsData from "./../data/discounts.json";
import { Discount } from "./../types/discounts";

export async function insertToDB() {
  const baseModel = getBaseModel();
  console.log(baseModel);
  const countBase = await baseModel.countDocuments();
  console.log("COUNT BASE:");
  console.log(countBase);
  if (countBase === 0) {
    const basePrices: BasePrice[] = basePricesData.basePrices;
    await baseModel.create(basePrices);
  }

  const coverageModel = getCoverageModel();
  const countCoverages = await coverageModel.countDocuments();
  if (countCoverages === 0) {
    const coverages: Coverage[] = coveragesData.coverages;
    await coverageModel.create(coverages);
  }

  const discountModel = getDiscountModel();
  const countDiscounts = await discountModel.countDocuments();
  if (countDiscounts === 0) {
    const discounts: Discount[] = discountsData.discounts;
    await discountModel.create(discounts);
  }
}
