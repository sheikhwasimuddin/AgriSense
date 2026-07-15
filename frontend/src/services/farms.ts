import api from "./api";
import type { Farm, FarmCreate } from "../types";

export const farmsService = {
  getFarms: async (): Promise<Farm[]> => {
    const response = await api.get<Farm[]>("/farms/");
    return response.data;
  },

  getFarm: async (farmId: number): Promise<Farm> => {
    const response = await api.get<Farm>(`/farms/${farmId}`);
    return response.data;
  },

  createFarm: async (data: FarmCreate): Promise<Farm> => {
    const response = await api.post<Farm>("/farms/", data);
    return response.data;
  },

  deleteFarm: async (farmId: number): Promise<void> => {
    await api.delete(`/farms/${farmId}`);
  },

  updateFarm: async (farmId: number, data: Partial<FarmCreate>): Promise<Farm> => {
    const response = await api.put<Farm>(`/farms/${farmId}`, data);
    return response.data;
  },
};
