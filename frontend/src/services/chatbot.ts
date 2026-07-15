import api from "./api";

export const chatbotService = {
  ask: async (message: string): Promise<{ reply: string }> => {
    const response = await api.post("/chatbot/ask", { message });
    return response.data;
  },
};
