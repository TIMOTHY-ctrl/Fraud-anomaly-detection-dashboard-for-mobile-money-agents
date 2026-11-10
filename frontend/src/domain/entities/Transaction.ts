export interface Transaction {
  id: string;
  agentName: string;
  agentInitials: string;
  location: string;
  amount: number;
  currency: string;
  type: "Cash out" | "Transfer" | "Cash in";
  time: string;
  status: "Flagged" | "Reviewing" | "Cleared";
  riskScore: number;
}
