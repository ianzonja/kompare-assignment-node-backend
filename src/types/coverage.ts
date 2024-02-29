export type Coverage = {
  name: string;
  description: string;
  type: string;
  target: string;
  value: number;
  ageMin?: number | null;
  ageMax?: number | null;
};

export type InsuranceCoverage = {
  coverage: Coverage;
  price: number;
};
