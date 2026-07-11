from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.security import get_current_active_user
from db import crud, schemas, models
from ml.predictor import predictor_service
from core.logger import logger

router = APIRouter()

@router.post("/yield", response_model=schemas.YieldPredictionResponse)
async def predict_yield_endpoint(
    request: schemas.YieldPredictionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Verify farm belongs to user (only if farm_id is provided)
    if request.farm_id is not None:
        farm = await crud.get_farm(db, request.farm_id)
        if not farm or farm.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Farm not found or not owned by user")
        
    try:
        # Get prediction
        prediction = predictor_service.predict_yield(request)
        
        # Save to database only if farm_id is provided
        saved = False
        if request.farm_id is not None:
            await crud.create_yield_prediction(db, request.farm_id, request, prediction)
            saved = True
        
        return schemas.YieldPredictionResponse(
            prediction=prediction,
            unit="hg/ha",
            saved=saved
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process prediction")

@router.get("/yield/history/{farm_id}", response_model=list[schemas.YieldPredictionHistory])
async def get_yield_history(
    farm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    farm = await crud.get_farm(db, farm_id)
    if not farm or farm.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Farm not found or not owned by user")
        
    return await crud.get_yield_predictions(db, farm_id)
