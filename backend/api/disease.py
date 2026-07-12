from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_active_user
from db import crud, schemas, models
from core.logger import logger
import random
import base64

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
    farm_id: Optional[int] = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if farm_id is not None:
        farm = await crud.get_farm(db, farm_id)
        if not farm or farm.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Farm not found or not owned by user")
            
    try:
        contents = await file.read()
        
        # Consistent mock prediction logic based on file size
        file_size = len(contents)
        result_idx = file_size % len(DISEASES)
        result = DISEASES[result_idx]
        confidence = round(0.75 + ((file_size % 100) / 400.0), 4)
        
        # Convert small images to base64 to store in DB for preview, otherwise use a placeholder
        # Limit base64 string size to avoid huge DB rows
        if file_size < 100000: # ~100KB
            base64_img = base64.b64encode(contents).decode('utf-8')
            content_type = file.content_type or 'image/jpeg'
            mock_image_url = f"data:{content_type};base64,{base64_img}"
        else:
            mock_image_url = f"https://source.unsplash.com/random/400x300/?leaf,crop,disease&sig={file_size}"
        
        saved_id = None
        created_at = None
        
        # Save to database
        if farm_id is not None:
            prediction = await crud.create_disease_prediction(
                db=db,
                farm_id=farm_id,
                image_url=mock_image_url,
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
