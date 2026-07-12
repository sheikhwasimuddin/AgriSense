export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface Farm {
  id: number;
  farm_name: string;
  location: string;
  latitude: number;
  longitude: number;
  area: number;
  crop: string;
  user_id: string;
  created_at: string;
}

export interface FarmCreate {
  farm_name: string;
  location: string;
  latitude: number;
  longitude: number;
  area: number;
  crop: string;
}

export interface YieldPredictionRequest {
  farm_id: number;
  Area: string;
  Item: string;
  Year: number;
  average_rain_fall_mm_per_year: number;
  avg_temp: number;
  pesticides_tonnes: number;
}

export interface YieldPredictionResponse {
  prediction: number;
  unit: string;
  saved: boolean;
}

export interface SensorData {
  id: number;
  farm_id: number;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  soil_ph: number;
  rainfall: number;
  light_intensity: number;
  timestamp: string;
}

export interface AnalyticsSummary {
  farm_id: number;
  averages: {
    temperature: number;
    humidity: number;
    soil_moisture: number;
  };
  latest_prediction: number | null;
}

export interface YieldPredictionHistory {
  id: number;
  farm_id: number;
  crop: string;
  year: number;
  rainfall: number;
  temperature: number;
  pesticides: number;
  predicted_yield: number;
  created_at: string;
}

export interface DiseasePredictionRequest {
  farm_id?: number;
  image_url: string;
}

export interface DiseasePredictionResponse {
  id?: number;
  disease: string;
  confidence: number;
  recommendation: string;
  created_at?: string;
}
