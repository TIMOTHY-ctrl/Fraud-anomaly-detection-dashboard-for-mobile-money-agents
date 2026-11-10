import { useEffect, useState } from "react";
import type { DashboardData, DashboardRepository } from "../ports/DashboardRepository";

export function useDashboardData(repository: DashboardRepository) {
  const [data, setData] = useState<DashboardData>({ alerts: [], transactions: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    repository.getDashboardData()
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setError("We couldn’t load your dashboard. Please try again.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [repository]);

  return { ...data, isLoading, error };
}
