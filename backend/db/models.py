from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    role = Column(String, default="Farmer") # Farmer, Agricultural Officer, Admin
    hashed_password = Column(String, nullable=False) # Only if using custom auth instead of pure Supabase
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    farms = relationship("Farm", back_populates="owner")

class Farm(Base):
    __tablename__ = "farms"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    farm_name = Column(String, index=True)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    area = Column(Float)
    crop = Column(String)
    
    owner = relationship("User", back_populates="farms")
    sensors = relationship("SensorData", back_populates="farm")
    yield_predictions = relationship("YieldPrediction", back_populates="farm")
    disease_predictions = relationship("DiseasePrediction", back_populates="farm")

class SensorData(Base):
    __tablename__ = "sensor_data"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    temperature = Column(Float)
    humidity = Column(Float)
    soil_moisture = Column(Float)
    soil_ph = Column(Float)
    rainfall = Column(Float)
    light_intensity = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    farm = relationship("Farm", back_populates="sensors")

class YieldPrediction(Base):
    __tablename__ = "yield_predictions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    crop = Column(String)
    year = Column(Integer)
    rainfall = Column(Float)
    temperature = Column(Float)
    pesticides = Column(Float)
    predicted_yield = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    farm = relationship("Farm", back_populates="yield_predictions")

class DiseasePrediction(Base):
    __tablename__ = "disease_predictions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    image_url = Column(String)
    disease = Column(String)
    confidence = Column(Float)
    recommendation = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    farm = relationship("Farm", back_populates="disease_predictions")
