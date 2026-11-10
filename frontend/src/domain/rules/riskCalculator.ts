export type RiskLevel = "Low" | "Elevated" | "High";

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 85) return "High";
  if (score >= 60) return "Elevated";
  return "Low";
}

export function formatCurrency(amount: number, currency = "UGX"): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
