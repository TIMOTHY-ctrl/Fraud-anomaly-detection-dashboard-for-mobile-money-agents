import type { DashboardData, DashboardRepository } from "../../application/ports/DashboardRepository";
import type { Alert } from "../../domain/entities/Alert";
import type { Transaction } from "../../domain/entities/Transaction";

const alerts: Alert[] = [
  {
    id: "ALT-2048",
    title: "Unusual transaction velocity",
    description: "18 transactions in 4 minutes",
    time: "2 min ago",
    severity: "Critical",
    amount: 248000,
    agentName: "James Mwangi",
    initials: "JM",
  },
  {
    id: "ALT-2047",
    title: "Transaction above usual limit",
    description: "Amount is 4.2× agent’s average",
    time: "8 min ago",
    severity: "High",
    amount: 185000,
    agentName: "Amina Wanjiku",
    initials: "AW",
  },
  {
    id: "ALT-2046",
    title: "Unusual location detected",
    description: "Transaction outside normal area",
    time: "14 min ago",
    severity: "Medium",
    amount: 72000,
    agentName: "Peter Otieno",
    initials: "PO",
  },
];

const transactions: Transaction[] = [
  { id: "TXN-8492051", agentName: "James Mwangi", agentInitials: "JM", location: "Westlands, Nairobi", amount: 248000, currency: "UGX", type: "Cash out", time: "10:42:18 AM", status: "Flagged", riskScore: 94 },
  { id: "TXN-8492048", agentName: "Amina Wanjiku", agentInitials: "AW", location: "Kilimani, Nairobi", amount: 185000, currency: "UGX", type: "Transfer", time: "10:39:05 AM", status: "Reviewing", riskScore: 78 },
  { id: "TXN-8492042", agentName: "Peter Otieno", agentInitials: "PO", location: "Kisumu Central", amount: 72000, currency: "UGX", type: "Cash out", time: "10:35:41 AM", status: "Flagged", riskScore: 86 },
  { id: "TXN-8492037", agentName: "Grace Njeri", agentInitials: "GN", location: "Thika, Kiambu", amount: 12500, currency: "UGX", type: "Cash in", time: "10:32:16 AM", status: "Cleared", riskScore: 12 },
  { id: "TXN-8492029", agentName: "David Kiptoo", agentInitials: "DK", location: "Nakuru Town", amount: 96000, currency: "UGX", type: "Transfer", time: "10:28:53 AM", status: "Reviewing", riskScore: 69 },
  { id: "TXN-8492025", agentName: "James Mwangi", agentInitials: "JM", location: "Westlands, Nairobi", amount: 35000, currency: "UGX", type: "Cash in", time: "10:24:37 AM", status: "Cleared", riskScore: 8 },
  { id: "TXN-8492019", agentName: "James Mwangi", agentInitials: "JM", location: "Westlands, Nairobi", amount: 18400, currency: "UGX", type: "Transfer", time: "10:17:12 AM", status: "Cleared", riskScore: 16 },
  { id: "TXN-8492013", agentName: "James Mwangi", agentInitials: "JM", location: "Westlands, Nairobi", amount: 62000, currency: "UGX", type: "Cash out", time: "10:03:48 AM", status: "Cleared", riskScore: 22 },
  { id: "TXN-8492006", agentName: "James Mwangi", agentInitials: "JM", location: "Westlands, Nairobi", amount: 12500, currency: "UGX", type: "Cash in", time: "9:52:31 AM", status: "Cleared", riskScore: 7 },
  { id: "TXN-8491998", agentName: "James Mwangi", agentInitials: "JM", location: "Westlands, Nairobi", amount: 48000, currency: "UGX", type: "Transfer", time: "9:38:09 AM", status: "Cleared", riskScore: 19 },
  { id: "TXN-8491991", agentName: "James Mwangi", agentInitials: "JM", location: "Westlands, Nairobi", amount: 27500, currency: "UGX", type: "Cash out", time: "9:24:56 AM", status: "Reviewing", riskScore: 64 },
  { id: "TXN-8491985", agentName: "James Mwangi", agentInitials: "JM", location: "Westlands, Nairobi", amount: 8000, currency: "UGX", type: "Cash in", time: "9:10:22 AM", status: "Cleared", riskScore: 10 },
  { id: "TXN-8491977", agentName: "James Mwangi", agentInitials: "JM", location: "Westlands, Nairobi", amount: 55000, currency: "UGX", type: "Cash out", time: "8:56:04 AM", status: "Cleared", riskScore: 24 },
];

export const dashboardApi: DashboardRepository = {
  async getDashboardData(): Promise<DashboardData> {
    return { alerts, transactions };
  },
};
