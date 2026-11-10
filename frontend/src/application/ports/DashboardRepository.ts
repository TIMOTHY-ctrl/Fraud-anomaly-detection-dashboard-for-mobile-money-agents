import type { Alert } from "../../domain/entities/Alert";
import type { Transaction } from "../../domain/entities/Transaction";

export interface DashboardData {
  alerts: Alert[];
  transactions: Transaction[];
}

export interface DashboardRepository {
  getDashboardData(): Promise<DashboardData>;
}
