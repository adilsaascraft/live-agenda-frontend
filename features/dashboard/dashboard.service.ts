
import { api } from "@/services/api";

import type { DashboardApiResponse } from "./dashboard.types";

const DASHBOARD_ENDPOINT = "/api/dashboard";

/**
 * Fetch all dashboard metrics and activity.
 */
export async function getDashboard(): Promise<DashboardApiResponse> {
  return api.get<DashboardApiResponse>(DASHBOARD_ENDPOINT);
}
