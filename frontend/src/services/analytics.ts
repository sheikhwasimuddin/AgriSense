import api from "./api";
import type { AnalyticsSummary } from "../types";

export const analyticsService = {
  getSummary: async (farmId: number): Promise<AnalyticsSummary> => {
    const response = await api.get<AnalyticsSummary>(`/analytics/${farmId}/summary`);
    return response.data;
  }
};
