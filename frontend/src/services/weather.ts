import api from "./api";

export const weatherService = {
  getWeather: async (farmId: number) => {
    const response = await api.get(`/weather/${farmId}`);
    return response.data;
  },
};
