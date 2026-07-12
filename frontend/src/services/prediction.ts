import api from "./api";
import type { 
  YieldPredictionRequest, 
  YieldPredictionResponse,
  YieldPredictionHistory,
  DiseasePredictionResponse
} from "../types";

export const predictionService = {
  predictYield: async (data: YieldPredictionRequest): Promise<YieldPredictionResponse> => {
    const response = await api.post<YieldPredictionResponse>("/predict/yield", data);
    return response.data;
  },
  
  getYieldHistory: async (farmId: number): Promise<YieldPredictionHistory[]> => {
    const response = await api.get<YieldPredictionHistory[]>(`/predict/yield/history/${farmId}`);
    return response.data;
  },

  predictDisease: async (formData: FormData): Promise<DiseasePredictionResponse> => {
    const response = await api.post<DiseasePredictionResponse>("/disease/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  getDiseaseHistory: async (farmId: number): Promise<DiseasePredictionResponse[]> => {
    const response = await api.get<DiseasePredictionResponse[]>(`/disease/history/${farmId}`);
    return response.data;
  }
};
