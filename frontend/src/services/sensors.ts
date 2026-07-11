import api from "./api";
import type { SensorData } from "../types";

export const sensorsService = {
  getLatest: async (farmId: number): Promise<SensorData> => {
    const response = await api.get<SensorData>(`/sensors/latest`, {
      params: { farm_id: farmId }
    });
    return response.data;
  },

  getHistory: async (farmId: number): Promise<SensorData[]> => {
    const response = await api.get<SensorData[]>(`/sensors/history/${farmId}`);
    return response.data;
  }
};
