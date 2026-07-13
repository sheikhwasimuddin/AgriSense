import api from "./api";
import type { User, LoginData, RegisterData, AuthResponse } from "../types";

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append("username", data.email);
    formData.append("password", data.password);
    
    // OAuth2PasswordRequestForm expects form-urlencoded
    const response = await api.post<AuthResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>("/auth/profile", data);
    return response.data;
  },
};
