export interface Alert {
  id: string;
  title: string;
  description: string;
  time: string;
  severity: "Critical" | "High" | "Medium";
  amount?: number;
  agentName: string;
  initials: string;
}
