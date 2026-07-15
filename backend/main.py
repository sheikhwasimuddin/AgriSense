import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.logger import logger
from ml.predictor import predictor_service
from api import auth, farms, prediction, sensors, analytics, disease, weather, chatbot, tasks

# Define lifecycle events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Starting up AgriSense AI Backend...")
    predictor_service.load_models()
    yield
    # Shutdown logic
    logger.info("Shutting down AgriSense AI Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for AgriSense IoT Crop Yield Prediction",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(farms.router, prefix="/api/v1/farms", tags=["Farms"])
app.include_router(prediction.router, prefix="/api/v1/predict", tags=["Prediction"])
app.include_router(disease.router, prefix="/api/v1/disease", tags=["Disease Prediction"])
app.include_router(sensors.router, prefix="/api/v1/sensors", tags=["Sensors"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(weather.router, prefix="/api/v1/weather", tags=["Weather"])
app.include_router(chatbot.router, prefix="/api/v1/chatbot", tags=["Chatbot"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "ml_loaded": predictor_service.pipeline is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
