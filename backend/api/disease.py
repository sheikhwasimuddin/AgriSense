from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_active_user
from db import crud, schemas, models
from core.logger import logger
import random

router = APIRouter()

# Mock disease classification model
DISEASES = [
    {"name": "Healthy", "recommendation": "Maintain current practices. Crop is healthy."},
    {"name": "Leaf Rust", "recommendation": "Apply fungicide containing azoxystrobin or tebuconazole. Ensure proper spacing for airflow."},
    {"name": "Blight", "recommendation": "Remove infected leaves immediately. Apply copper-based fungicide. Avoid overhead watering."},
    {"name": "Powdery Mildew", "recommendation": "Apply sulfur or potassium bicarbonate spray. Improve air circulation."},
]

@router.post("/predict", response_model=schemas.DiseasePredictionResponse)
async def predict_disease(
    request: schemas.DiseasePredictionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if request.farm_id is not None:
        farm = await crud.get_farm(db, request.farm_id)
        if not farm or farm.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Farm not found or not owned by user")
            
    try:
        # Mock prediction logic based on the image URL
        # In a real app, this would download the image or pass the URL to a PyTorch/TensorFlow model
        result = random.choice(DISEASES)
        confidence = round(random.uniform(0.75, 0.99), 4)
        
        saved_id = None
        created_at = None
        
        # Save to database
        if request.farm_id is not None:
            prediction = await crud.create_disease_prediction(
                db=db,
                farm_id=request.farm_id,
                image_url=request.image_url,
                disease=result["name"],
                confidence=confidence,
                recommendation=result["recommendation"]
            )
            saved_id = prediction.id
            created_at = prediction.created_at
            
        return schemas.DiseasePredictionResponse(
            id=saved_id,
            disease=result["name"],
            confidence=confidence,
            recommendation=result["recommendation"],
            created_at=created_at
        )
    except Exception as e:
        logger.error(f"Disease prediction error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process disease prediction")

@router.get("/history/{farm_id}", response_model=list[schemas.DiseasePredictionResponse])
async def get_disease_history(
    farm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    farm = await crud.get_farm(db, farm_id)
    if not farm or farm.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Farm not found or not owned by user")
        
    return await crud.get_disease_predictions(db, farm_id)
