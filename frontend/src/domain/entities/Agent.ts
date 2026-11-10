export interface Agent {
  id: string;
  name: string;
  initials: string;
  location: string;
  transactions: number;
  risk: "High" | "Elevated" | "Low";
}
