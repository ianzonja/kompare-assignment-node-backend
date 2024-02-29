export type Discount = {
  name: string;
  description: string;
  type: string;
  value: number | null;
  target: string;
  coveragesMin: number | null;
  vehiclePowerMin: number | null;
};

export type InsuranceDiscount = {
  discount: Discount;
  price: number;
};
