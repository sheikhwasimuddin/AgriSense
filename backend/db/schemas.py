from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    city: Optional[str] = None
    age: Optional[int] = None
    food_stock: Optional[float] = None
    role: str = "Farmer"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    age: Optional[int] = None
    food_stock: Optional[float] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    created_at: datetime
    
    model_config = {"from_attributes": True}

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Farm Schemas
class FarmBase(BaseModel):
    farm_name: str
    location: str
    latitude: float
    longitude: float
    area: float
    crop: str

class FarmCreate(FarmBase):
    pass

class Farm(FarmBase):
    id: int
    user_id: UUID
    
    model_config = {"from_attributes": True}

# Sensor Schemas
class SensorDataBase(BaseModel):
    farm_id: int
    temperature: float
    humidity: float
    soil_moisture: float
    soil_ph: float
    rainfall: float
    light_intensity: float

class SensorDataCreate(SensorDataBase):
    pass

class SensorData(SensorDataBase):
    id: int
    timestamp: datetime
    
    model_config = {"from_attributes": True}

# Prediction Schemas
class YieldPredictionRequest(BaseModel):
    farm_id: Optional[int] = None
    Area: str
    Item: str
    Year: int
    average_rain_fall_mm_per_year: float
    pesticides_tonnes: float
    avg_temp: float

class YieldPredictionResponse(BaseModel):
    prediction: float
    unit: str = "hg/ha"
    saved: bool = True

class YieldPredictionHistory(BaseModel):
    id: int
    farm_id: int
    crop: str
    year: int
    rainfall: float
    temperature: float
    pesticides: float
    predicted_yield: float
    created_at: datetime

    model_config = {"from_attributes": True}

class DiseasePredictionRequest(BaseModel):
    farm_id: Optional[int] = None
    image_url: str

class DiseasePredictionResponse(BaseModel):
    id: Optional[int] = None
    disease: str
    confidence: float
    recommendation: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
